import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { calibrationVariant, calibrationApplicability } from './calibration-groups.mjs';

/** Refresh exact existing groups; never merge groups, infer approvals or drop cards. */
export function reviewGroupMembership(set, entries) {
  assert.equal(entries.length, set.inventory.ordinaryPrintings, 'Incomplete set membership');
  assert.equal(new Set(entries.map((e) => e.id)).size, entries.length, 'Duplicate printing');
  const groups = new Map();
  for (const entry of entries) {
    assert.equal(entry.card.set, set.set, 'Foreign printing');
    assert.equal(entry.card.id, entry.id, 'Printing identity mismatch');
    const variant = calibrationVariant(entry.card);
    if (!groups.has(variant.key)) groups.set(variant.key, { variant, entries: [] });
    groups.get(variant.key).entries.push(entry);
  }
  assert.equal(new Set(set.groups.map((g) => g.key)).size, set.groups.length, 'Duplicate group');
  assert.equal(groups.size, set.groups.length, 'Group inventory changed');
  const rows = [];
  const updated = structuredClone(set);
  updated.groups = updated.groups.map((group) => {
    const next = groups.get(group.key);
    assert(next, 'Missing existing group: ' + group.key);
    const ids = next.entries.map((e) => e.id).sort();
    const membershipHash = hash(JSON.stringify(ids));
    assert.equal(ids.length, group.printings, 'Group size changed');
    assert(group.membershipHash || group.scopeHash, 'Missing prior membership identity');
    for (const key of ['membershipHash', 'scopeHash'])
      if (group[key]) assert.equal(group[key], membershipHash, 'Group membership changed');
    if (group.printingIds) assert.deepEqual(group.printingIds, ids, 'Explicit members changed');
    const { applicable, reasons } = calibrationApplicability(next.entries.map((e) => e.card));
    // Provider metadata alone cannot hide reviewed Original flavor or cost content.
    if (!applicable.flavor)
      assert(
        next.entries.every((e) => !e.face.rulesParagraphs?.some((p) => p.role === 'flavor')),
        'Original flavor contradicts absent component',
      );
    if (!applicable.manaGeometry)
      assert(
        next.entries.every((e) => !e.face.manaSymbols?.length),
        'Original mana cost contradicts absent component',
      );
    const tasks = { ...group.tasks },
      changes = [];
    for (const [task, applies] of Object.entries(applicable)) {
      if (!applies) {
        const after = { status: 'not-applicable', reason: reasons[task] };
        if (JSON.stringify(tasks[task]) !== JSON.stringify(after))
          changes.push({ task, before: tasks[task]?.status ?? 'pending', after: after.status });
        tasks[task] = after;
      } else {
        assert.notEqual(tasks[task]?.status, 'not-applicable', 'Present component was excluded');
      }
    }
    rows.push({ key: group.key, printingIds: ids, membershipHash, applicable, changes });
    return {
      ...next.variant,
      ...group,
      printingIds: ids,
      scopeHash: membershipHash,
      applicable,
      tasks,
    };
  });
  return { set: updated, rows };
}
