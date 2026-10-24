import { checkSetProfile } from './set-profile-check.mjs';
import { hash } from './common.mjs';
// Data-only Eighth profiles may evolve without invalidating unrelated painters.
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile, readdir } from 'node:fs/promises';
import { parseProfileData } from './profile-data-modules.mjs';

export function parseEighthProfileData(text, manifest, masks, file = '8ed.ts') {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0);
  const value = (node) => {
    if (
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isParenthesizedExpression(node)
    )
      return value(node.expression);
    if (ts.isStringLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
      const n = value(node.operand);
      assert.equal(typeof n, 'number');
      return -n;
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const a = value(node.left),
        b = value(node.right);
      assert.equal(typeof a, 'string');
      assert.equal(typeof b, 'string');
      return a + b;
    }
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
      const base = node.expression.text,
        key = node.name.text;
      if (base === 'manifest' && ['CONJURER_ROOT', 'RETRO_ROOT'].includes(key))
        return manifest[key];
      if (base === 'EIGHTH_PAPER_MASKS' && ['paper', 'title', 'type'].includes(key))
        return masks[key];
    }
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(value);
    if (ts.isObjectLiteralExpression(node)) {
      const result = {};
      for (const p of node.properties) {
        assert(ts.isPropertyAssignment(p), 'No executable profile properties');
        assert(
          ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) || ts.isNumericLiteral(p.name),
        );
        const key = p.name.text;
        assert(!['__proto__', 'prototype', 'constructor'].includes(key));
        assert(!Object.hasOwn(result, key));
        Object.defineProperty(result, key, { value: value(p.initializer), enumerable: true });
      }
      return result;
    }
    assert.fail('Eighth profiles must be inert data: ' + ts.SyntaxKind[node.kind]);
  };
  let profile;
  for (const s of source.statements) {
    if (ts.isImportDeclaration(s)) {
      if (s.importClause?.isTypeOnly) continue;
      const specifier = s.moduleSpecifier.text;
      if (specifier === '../../../assets.json') {
        assert.equal(s.importClause?.name?.text, 'manifest');
        assert(!s.importClause?.namedBindings);
        continue;
      }
      assert.equal(specifier, '../../presentation/eighth-paper-masks.js');
      const binding = s.importClause?.namedBindings;
      assert(binding && ts.isNamedImports(binding));
      assert.equal(binding.elements.length, 1);
      assert.equal(binding.elements[0].name.text, 'EIGHTH_PAPER_MASKS');
      assert(!binding.elements[0].propertyName);
      continue;
    }
    assert(ts.isVariableStatement(s));
    assert(s.declarationList.flags & ts.NodeFlags.Const);
    assert.deepEqual(
      s.modifiers?.map((m) => m.kind),
      [ts.SyntaxKind.ExportKeyword],
    );
    assert.equal(s.declarationList.declarations.length, 1);
    const d = s.declarationList.declarations[0];
    assert(ts.isIdentifier(d.name) && d.name.text === 'profile');
    assert(!profile);
    profile = value(d.initializer);
  }
  assert(profile && profile.revision >= 1);
  assert.equal(profile.root, manifest.CONJURER_ROOT + '/img/frames/8th');
  assert(!profile.inheritedFrom, 'Authoritative profiles cannot masquerade as inherited');
  return profile;
}
export async function eighthProfileDataModules() {
  const directory = 'games/magic/src/calibration/eighth/';
  const manifest = JSON.parse(await readFile('games/magic/assets.json'));
  const contours = JSON.parse(
    await readFile('games/magic/src/presentation/eighth-basic-contours.json'),
  );
  const masks = Object.fromEntries(
    ['paper', 'title', 'type'].map((key) => [
      key,
      {
        kind: 'polygon',
        points: [
          ...contours[key].left.map(([y, x]) => [x / 488, y / 680]),
          ...contours[key].right.toReversed().map(([y, x]) => [x / 488, y / 680]),
        ],
        feather: 0.4 / 488,
      },
    ]),
  );
  const modules = [];
  for (const name of await readdir(directory)) {
    assert.match(name, /^[a-z0-9]{2,8}[.]ts$/);
    const file = directory + name,
      profile = parseEighthProfileData(await readFile(file, 'utf8'), manifest, masks, file);
    const generated = await readFile('games/magic/src/data/sets/' + name, 'utf8');
    const parsed = ts.createSourceFile(name, generated, ts.ScriptTarget.Latest, true);
    const declaration = parsed.statements.find((s) => ts.isVariableStatement(s));
    assert(declaration);
    const data = parseProfileData(
      'export const profile = ' +
        declaration.declarationList.declarations[0].initializer.getText(parsed) +
        '; export const review = {};',
    ).profile;
    assert.deepEqual(
      data.tables.EIGHTH_PRINTING_PROFILES[name.slice(0, -3)],
      profile,
      'Stale Eighth payload',
    );
    modules.push(file);
  }
  return modules;
}

/** Decode the generated payload without evaluating it; permit only a type import,
 * a single const data literal and export default data. */
export function eighthPayloadData(text, file = 'payload.ts') {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0);
  let declaration,
    exported = false;
  for (const s of source.statements) {
    if (ts.isImportDeclaration(s)) {
      assert(s.importClause?.isTypeOnly);
      continue;
    }
    if (ts.isVariableStatement(s)) {
      assert(!declaration);
      assert(s.declarationList.flags & ts.NodeFlags.Const);
      assert.equal(s.declarationList.declarations.length, 1);
      declaration = s.declarationList.declarations[0];
      assert(ts.isIdentifier(declaration.name) && declaration.name.text === 'data');
      continue;
    }
    assert(
      ts.isExportAssignment(s) &&
        !s.isExportEquals &&
        ts.isIdentifier(s.expression) &&
        s.expression.text === 'data',
    );
    assert(!exported);
    exported = true;
  }
  assert(declaration && exported);
  return parseProfileData(
    'export const profile = ' +
      declaration.initializer.getText(source) +
      '; export const review = {};',
  ).profile;
}

/** The eager compatibility entry contains the same inert per-set payloads. */
export function eighthAggregateData(text, file = 'eager.ts') {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0);
  const rows = [];
  let imported = false;
  for (const s of source.statements) {
    if (ts.isImportDeclaration(s)) {
      assert(!imported);
      imported = true;
      assert.equal(s.moduleSpecifier.text, './registry.js');
      const named = s.importClause?.namedBindings;
      assert(named && ts.isNamedImports(named));
      assert.equal(named.elements.length, 1);
      assert.equal(named.elements[0].name.text, 'registerSet');
      assert(!named.elements[0].propertyName);
      continue;
    }
    assert(ts.isExpressionStatement(s) && ts.isCallExpression(s.expression));
    const call = s.expression;
    assert(ts.isIdentifier(call.expression) && call.expression.text === 'registerSet');
    assert.equal(call.arguments.length, 1);
    rows.push(
      parseProfileData(
        'export const profile = ' +
          call.arguments[0].getText(source) +
          '; export const review = {};',
      ).profile,
    );
  }
  assert(imported && rows.length);
  return rows;
}

/** Existing one-file calibration formats retain their own set scope as well. */
export async function runtimeCalibrationDataModules() {
  const result = await eighthProfileDataModules();
  const directory = 'games/magic/src/calibration/sets/';
  const manifest = JSON.parse(await readFile('games/magic/assets.json'));
  for (const name of await readdir(directory)) {
    if (!name.endsWith('.ts')) continue;
    const file = directory + name,
      text = await readFile(file, 'utf8');
    if (name === 'lea-title.ts') {
      const profile = parseProfileData(text + '\nexport const review = {};').profile;
      const generated = eighthPayloadData(
        await readFile('games/magic/src/data/sets/lea.ts', 'utf8'),
      );
      assert.deepEqual(generated.tables.setTitleCalibrations.lea, profile);
    } else {
      const { profile, review } = parseProfileData(text, file);
      checkSetProfile(profile, review, manifest);
      const generated = eighthPayloadData(
        await readFile('games/magic/src/data/sets/' + name, 'utf8'),
      );
      assert.deepEqual(generated.tables.setCalibrationProfiles[profile.set], profile);
    }
    result.push(file);
  }
  return result.sort();
}
export function runtimePayloadBase(data) {
  const tables = { ...data.tables };
  for (const key of ['EIGHTH_PRINTING_PROFILES', 'setCalibrationProfiles', 'setTitleCalibrations'])
    delete tables[key];
  return { ...data, tables };
}
export function runtimeProfileHashes(payloads) {
  const result = {};
  for (const data of payloads) {
    const values = {};
    for (const key of [
      'EIGHTH_PRINTING_PROFILES',
      'setCalibrationProfiles',
      'setTitleCalibrations',
    ])
      if (data.tables[key]) values[key] = data.tables[key];
    if (Object.keys(values).length) result[data.set] = hash(JSON.stringify(values));
  }
  return result;
}
