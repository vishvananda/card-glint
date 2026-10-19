import path from 'node:path';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { hash } from './common.mjs';

/** Freeze local metric imports too: a policy/helper edit changes the metric. */
export async function metricSourceGraph(entry) {
  const root = path.dirname(path.resolve(entry)),
    seen = new Map();
  const visit = async (file) => {
    if (seen.has(file)) return;
    const bytes = await readFile(file);
    seen.set(file, hash(bytes));
    const source = ts.createSourceFile(file, bytes.toString('utf8'), ts.ScriptTarget.Latest),
      imports = [];
    const walk = (node) => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier)
        imports.push(node.moduleSpecifier);
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        if (node.arguments.length !== 1) throw Error('Unsupported dynamic metric import');
        imports.push(node.arguments[0]);
      }
      ts.forEachChild(node, walk);
    };
    walk(source);
    for (const specifier of imports) {
      if (!ts.isStringLiteral(specifier)) throw Error('Metric imports must be static literals');
      const name = specifier.text;
      if (name.startsWith('node:')) continue;
      if (!name.startsWith('.'))
        throw Error('Metric package imports need an explicit lockfile identity');
      await visit(path.resolve(path.dirname(file), name));
    }
  };
  await visit(path.resolve(entry));
  const sources = [...seen]
    .map(([file, digest]) => [path.relative(root, file), digest])
    .sort((a, b) => a[0].localeCompare(b[0]));
  return {
    hash: hash(JSON.stringify({ node: process.version, sources })),
    node: process.version,
    sources,
  };
}
