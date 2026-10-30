import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
test('all Magic text operations and font assignments use the shared geometry boundary', async () => {
  const root = 'games/magic/src',
    bad = [];
  for (const entry of await fs.readdir(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.ts')) continue;
    const file = path.join(entry.parentPath, entry.name);
    if (path.resolve(file) === path.resolve(root, 'presentation/font-geometry.ts')) continue;
    const text = await fs.readFile(file, 'utf8'),
      source = ts.createSourceFile(file, text, 99, true);
    function visit(n) {
      if (
        ts.isCallExpression(n) &&
        ts.isPropertyAccessExpression(n.expression) &&
        ['fillText', 'strokeText', 'measureText'].includes(n.expression.name.text)
      )
        bad.push(file + ':' + n.expression.getText(source));
      if (
        ts.isBinaryExpression(n) &&
        n.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        ts.isPropertyAccessExpression(n.left) &&
        n.left.name.text === 'font' &&
        ['c', 'context', 'ink'].includes(n.left.expression.getText(source))
      )
        bad.push(file + ':' + n.left.getText(source));
      ts.forEachChild(n, visit);
    }
    visit(source);
  }
  assert.deepEqual(bad, [], 'Text code bypassed the audited font policy');
});
