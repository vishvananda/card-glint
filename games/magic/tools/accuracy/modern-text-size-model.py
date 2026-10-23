"""Exploratory shared size rules from a complete fixed-candidate text census.
No scan pixels, poses, card-name branches or runtime tables are produced.
"""
import hashlib
import json
import re
import sys
from pathlib import Path
import numpy as np

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def features(entry, row, layout_aware):
    paragraphs = entry["face"].get("rulesParagraphs", [])
    texts = {role: ["".join(run["text"] for run in p["runs"])
                    for p in paragraphs if p["role"] == role]
             for role in ["rules", "flavor"]}
    result = {}
    for role, lines in texts.items():
        text = " ".join(lines)
        words = re.findall(r"\w+", text)
        result.update({
            role + "Characters": len(text),
            role + "Words": len(words),
            role + "Paragraphs": len(lines),
            role + "LongestWord": max(map(len, words), default=0),
            role + "LongestParagraph": max(map(len, lines), default=0),
        })
    result["manaTokens"] = sum(text.count("{") for text in texts["rules"])
    result["hasAttribution"] = int(any(text.startswith(("—", "--")) for text in texts["flavor"]))
    result["totalCharacters"] = result["rulesCharacters"] + result["flavorCharacters"]
    type_line = entry["face"].get("canonicalTypeLine", entry["face"].get("typeLine", ""))
    for trait in ["Land", "Artifact", "Creature", "Legendary"]:
        result["is" + trait] = int(bool(re.search(r"\b" + trait + r"\b", type_line)))
    if layout_aware:
        result["currentFontSize"] = row["trials"][0]["size"]
        result["currentLineCount"] = row["trials"][0]["lineCount"]
    return result

def report(rows, scores, actions):
    before = scores[:, 0] * 100
    after = scores[np.arange(len(rows)), actions] * 100
    delta = after - before
    order = np.argsort(delta)
    return {
        "fields": len(rows), "before100": float(before.mean()), "after100": float(after.mean()),
        "delta100": float(delta.mean()), "improved": int((delta > 1e-8).sum()),
        "regressed": int((delta < -1e-8).sum()),
        "worst": [{"id": rows[i]["id"], "name": rows[i]["name"], "delta100": float(delta[i])}
                  for i in order[:5]],
    }

def fit_tree(x, utility, names, indices, depth, minimum=20, split_cost=5):
    def best(ids):
        sums = utility[ids].sum(axis=0)
        action = int(np.argmax(sums))
        return float(sums[action]), action
    total, action = best(indices)
    node = {"action": action, "fields": len(indices)}
    if depth == 0:
        return node
    winner = None
    for feature, name in enumerate(names):
        unique = np.unique(x[indices, feature])
        if len(unique) < 2:
            continue
        # A bounded threshold vocabulary reduces data-mined branching.
        cuts = (unique[:-1] + unique[1:]) / 2
        if len(cuts) > 16:
            cuts = cuts[np.unique(np.linspace(0, len(cuts)-1, 16).astype(int))]
        for cut in cuts:
            mask = x[indices, feature] <= cut
            left, right = indices[mask], indices[~mask]
            if min(len(left), len(right)) < minimum:
                continue
            improvement = best(left)[0] + best(right)[0] - total - split_cost
            if improvement > 1e-8 and (winner is None or improvement > winner[0]):
                winner = (improvement, feature, float(cut), left, right)
    if winner is not None:
        _, feature, cut, left, right = winner
        node = {"feature": names[feature], "threshold": cut, "fields": len(indices),
                "left": fit_tree(x, utility, names, left, depth-1, minimum, split_cost),
                "right": fit_tree(x, utility, names, right, depth-1, minimum, split_cost)}
    return node

def predict(tree, sample):
    while "feature" in tree:
        tree = tree["left"] if sample[tree["feature"]] <= tree["threshold"] else tree["right"]
    return tree["action"]

def main():
    if len(sys.argv) != 4:
        raise SystemExit("Usage: modern-text-size-model.py INPUTS FIXED_STUDY OUTPUT")
    inputs_file, study_file, output = sys.argv[1:]
    inputs = json.loads(Path(inputs_file).read_text())
    study = json.loads(Path(study_file).read_text())
    assert inputs["set"] == "m21" and len(inputs["entries"]) == 297
    assert len(study["rows"]) == 297 and not study["faults"]
    assert "perPrinting" not in study["parameters"], "Adaptive optimal centers would leak scan labels"
    assert study["definition"]["inputsHash"] == digest(inputs_file)
    entries = {entry["id"]: entry for entry in inputs["entries"]}
    rows = [row for row in study["rows"] if row.get("trials")]
    assert len(rows) == 268 and len({row["id"] for row in rows}) == 268
    scores = np.array([[trial["score"] for trial in row["trials"]] for row in rows])
    assert np.isfinite(scores).all() and ((scores >= 0) & (scores <= 1)).all()
    assert all(not trial["invalid"] for row in rows for trial in row["trials"])
    # Keep every printing of one Oracle identity in the same exploratory fold.
    folds = np.array([hashlib.sha256((entries[row["id"]]["card"].get("oracle_id") or row["name"]).encode()).digest()[0] % 5 for row in rows])
    results = []
    for layout_aware in [False, True]:
        samples = [features(entries[row["id"]], row, layout_aware) for row in rows]
        names = list(samples[0])
        x = np.array([[sample[name] for name in names] for sample in samples], dtype=float)
        for penalty in [0, 3]:
            delta = (scores - scores[:, :1]) * 100
            utility = delta - penalty * np.maximum(0, -delta - 5)
            tree = fit_tree(x, utility, names, np.arange(len(rows)), 2)
            actions = np.array([predict(tree, sample) for sample in samples])
            cv = np.zeros(len(rows), dtype=int)
            for fold in range(5):
                training = np.flatnonzero(folds != fold)
                held = np.flatnonzero(folds == fold)
                model = fit_tree(x, utility, names, training, 2)
                cv[held] = [predict(model, samples[i]) for i in held]
            results.append({"features": "layout-and-text" if layout_aware else "text-only",
                            "tailPenalty": penalty, "maximumDepth": 2, "minimumLeaf": 20,
                            "tree": tree, "development": report(rows, scores, actions),
                            "exploratoryCrossValidation": report(rows, scores, cv)})
    result = {
        "schema": 1, "set": "m21", "status": "exploratory-shared-font-size-model-not-adopted",
        "policy": "No per-printing adaptive centers used as features/actions. Shared fixed cap choices only. Five Oracle-identity folds avoid name leakage, but are exploratory because features and trials were chosen after viewing the census; not independent final validation. Worst losses remain explicit. No runtime rule or printing exception generated.",
        "source": {"inputsHash": digest(inputs_file), "studyHash": digest(study_file),
                   "toolHash": digest(__file__)},
        "candidates": study["parameters"]["candidates"], "results": results,
    }
    Path(output).write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps([{"features": r["features"], "penalty": r["tailPenalty"],
                       "development": r["development"], "crossValidation": r["exploratoryCrossValidation"]}
                      for r in results], indent=2))

if __name__ == "__main__":
    main()
