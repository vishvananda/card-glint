import ts from 'typescript';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const operations = new Set([
  'moveTo',
  'lineTo',
  'quadraticCurveTo',
  'bezierCurveTo',
  'arc',
  'arcTo',
  'ellipse',
  'rect',
  'roundRect',
  'fillRect',
  'strokeRect',
  'clip',
]);
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : e.name.endsWith('.ts')
            ? [path.join(dir, e.name)]
            : [],
      ),
    )
  )
    .flat()
    .sort();
}
function owner(node) {
  let current = node;
  while (current.parent) {
    current = current.parent;
    if (ts.isFunctionDeclaration(current) && current.name) return current.name.text;
    if (
      ts.isVariableDeclaration(current) &&
      current.initializer &&
      (ts.isArrowFunction(current.initializer) || ts.isFunctionExpression(current.initializer))
    )
      return current.name.getText();
  }
  return '<module>';
}
const groups = new Map();
for (const file of await files(path.join(root, 'games/magic/src'))) {
  const source = await readFile(file, 'utf8'),
    ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const module = path.relative(root, file),
    sha256 = createHash('sha256').update(source).digest('hex');
  function visit(node) {
    const op =
      ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
        ? node.expression.name.text
        : ts.isNewExpression(node) && node.expression.getText(ast) === 'Path2D'
          ? 'Path2D'
          : null;
    if (operations.has(op) || op === 'Path2D') {
      const fn = owner(node),
        id = module + '#' + fn;
      if (!groups.has(id))
        groups.set(id, {
          id,
          module,
          owner: fn,
          sourceSha256: sha256,
          status: 'unmeasured',
          operations: [],
        });
      groups.get(id).operations.push({
        kind: op,
        line: ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1,
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
const result = {
  schema: 1,
  scope:
    'Source inventory of Magic-owned Canvas paths, primitive boundaries and clips. A source occurrence is a review candidate, not proof of an independently visible printed shape. Bitmap boundaries, glyphs and host-only status/ability UI require explicit classification. No completion is inferred from an old overlap score.',
  priorities: [
    'planeswalker-type-contours',
    'ordinary-modern-curves',
    'planeswalker-background-asset-and-hsb',
    'remaining-drawn-print-shapes-by-frame-family',
  ],
  groups: [...groups.values()],
};
const output = JSON.stringify(result, null, 2) + '\n';
if (process.argv[2]) await writeFile(process.argv[2], output);
else process.stdout.write(output);
