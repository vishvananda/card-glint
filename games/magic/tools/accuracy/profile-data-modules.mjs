// Data-only additions can be omitted from a historical executable inventory.
// This does not authorize reuse of any current renderer/calibration scores.
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile, readdir } from 'node:fs/promises';
import { checkSetProfile } from './set-profile-check.mjs';

export function parseProfileData(text, file = 'profile.ts') {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0, 'Invalid profile source');
  const literal = (node) => {
    if (
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isParenthesizedExpression(node)
    )
      return literal(node.expression);
    if (ts.isStringLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
      const n = literal(node.operand);
      assert.equal(typeof n, 'number');
      return -n;
    }
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node)) {
      const result = {};
      for (const p of node.properties) {
        assert(ts.isPropertyAssignment(p), 'Profile data cannot contain executable properties');
        assert(
          ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) || ts.isNumericLiteral(p.name),
        );
        assert(!Object.hasOwn(result, p.name.text), 'Duplicate profile key');
        assert(!['__proto__', 'prototype', 'constructor'].includes(p.name.text));
        Object.defineProperty(result, p.name.text, {
          value: literal(p.initializer),
          enumerable: true,
        });
      }
      return result;
    }
    assert.fail('Profile modules must contain literal data only: ' + ts.SyntaxKind[node.kind]);
  };
  const result = {};
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      assert(statement.importClause?.isTypeOnly, 'Only erased type imports are allowed');
      continue;
    }
    assert(ts.isVariableStatement(statement), 'Profile modules cannot execute statements');
    assert(statement.declarationList.flags & ts.NodeFlags.Const);
    assert.deepEqual(
      statement.modifiers?.map((m) => m.kind),
      [ts.SyntaxKind.ExportKeyword],
    );
    for (const d of statement.declarationList.declarations) {
      assert(ts.isIdentifier(d.name) && ['profile', 'review'].includes(d.name.text));
      assert(!Object.hasOwn(result, d.name.text));
      result[d.name.text] = literal(d.initializer);
    }
  }
  assert.deepEqual(Object.keys(result).sort(), ['profile', 'review']);
  return result;
}

/** Known modules retain their historical proof. New modules must be inert,
 * complete profiles, validated against their registered generated payload. */
export async function additionalProfileDataModules(known) {
  const directory = 'games/magic/src/calibration/sets/';
  const manifest = JSON.parse(await readFile('games/magic/assets.json'));
  const result = [];
  for (const name of await readdir(directory)) {
    const file = directory + name;
    if (!name.endsWith('.ts') || known.has(file)) continue;
    assert.match(name, /^[a-z0-9]{2,8}\.ts$/);
    const { profile, review } = parseProfileData(await readFile(file, 'utf8'), file);
    assert.equal(profile.set + '.ts', name);
    checkSetProfile(profile, review, manifest);
    const generated = await readFile('games/magic/src/data/sets/' + name, 'utf8');
    const parsed = ts.createSourceFile(name, generated, ts.ScriptTarget.Latest, true);
    const declaration = parsed.statements.find((s) => ts.isVariableStatement(s));
    assert(declaration);
    // Parse the literal payload without evaluating generated code.
    const initializer = declaration.declarationList.declarations[0].initializer.getText(parsed);
    const data = JSON.parse(initializer);
    assert.deepEqual(data.tables.setCalibrationProfiles[profile.set], profile);
    result.push(file);
  }
  return result;
}
