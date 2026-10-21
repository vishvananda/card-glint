import assert from 'node:assert/strict';
import ts from 'typescript';
import { format } from 'prettier';

/** Offline proof helper: replace exactly one compiled set profile, preserving
 * every other aggregate/shard payload. Never used by the renderer. */
export async function restoreUnlimitedProfilePayload(source, profile) {
  const ast = ts.createSourceFile('payload.ts', source, ts.ScriptTarget.Latest, true);
  assert.equal(ast.parseDiagnostics.length, 0);
  const matches = [];
  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.text === '2ed' &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      const names = new Set(
        node.initializer.properties.filter(ts.isPropertyAssignment).map((p) => p.name.text),
      );
      if (['schema', 'revision', 'set', 'frames', 'dualLand'].every((k) => names.has(k)))
        matches.push(node.initializer);
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  assert.equal(matches.length, 1, 'Expected one Unlimited compiled profile');
  const value = matches[0];
  return format(
    source.slice(0, value.getStart(ast)) + JSON.stringify(profile) + source.slice(value.end),
    { parser: 'typescript', singleQuote: true, printWidth: 100 },
  );
}
