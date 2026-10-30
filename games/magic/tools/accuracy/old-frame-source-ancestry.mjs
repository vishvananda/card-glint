import { preFontGeometrySource, fontGeometryHistoricalFiles } from './font-geometry-ancestry.mjs';
import {
  preOldFrameAdoptionSource,
  oldFrameAdoptionHistoricalFiles,
  oldFrameAdoptionRuntimeParent,
} from './old-frame-adoption-ancestry.mjs';
import { preOnslaughtSymbolSource } from './old-frame-symbol-source-ancestry.mjs';
import {
  preArtifactSourceRepair,
  artifactSourceRepairDelta,
} from './artifact-source-repair-ancestry.mjs';
// Exact source history for additional old-frame families; no fit approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/mirage-onslaught/source-family-adapter-delta.json.gz';
const RECEIPT = '6f039cbca11a0b4988b86ab238822d78f9c22060c41c9fea150fa4656fc650f5';
let checked;
export function oldFrameSourceDelta() {
  return (checked ??= (async () => {
    const zipped = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(zipped), RECEIPT, 'Changed source-family receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'old-frame-source-families');
    assert.equal(
      p.beforeRenderer,
      '36be60f78b232e5311f4be839c3fc44e016b6eacdbb6a745260b0a8ed612ce7e',
    );
    assert.equal(Object.keys(p.files).length, 8);
    for (const e of Object.values(p.files)) {
      assert.match(e.after, /^[a-f0-9]{64}$/);
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    const { nativeProof, nativeTool, scope, ...draft } = p;
    assert(scope.length > 0);
    assert.equal(nativeProof.source.deltaHash, hash(JSON.stringify(draft, null, 2) + '\n'));
    assert.equal(nativeProof.source.rendererHash, p.afterRenderer);
    assert.equal(nativeProof.status, 'unchanged-native-frame-family-controls');
    assert.equal(nativeProof.count, 65);
    assert.equal(nativeProof.changed, 0);
    assert.equal(nativeProof.rows.length, 65);
    assert.equal(new Set(nativeProof.rows.map((r) => r.id)).size, 65);
    for (const r of nativeProof.rows) {
      assert.match(r.inputHash, /^[a-f0-9]{64}$/);
      assert.match(r.sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(nativeProof.source.toolHash, nativeTool.sha256);
    assert.equal(hash(await fs.readFile(path.join(root, nativeTool.file))), nativeTool.sha256);
    return p;
  })());
}

const AUDIT_FILE =
  'games/magic/fixtures/accuracy/mirage-onslaught/source-family-audit-tools.json.gz';
const AUDIT_HASH = '38e810a60f431b4cf0b0aecc676d62c2d259bda1bf88489c2edf3779dd64721e';
let auditChecked;
export function oldFrameAuditToolsDelta() {
  return (auditChecked ??= (async () => {
    const zipped = await fs.readFile(path.join(root, AUDIT_FILE));
    assert.equal(hash(zipped), AUDIT_HASH, 'Changed audit-routing receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'old-frame-audit-routing');
    assert.equal(p.familyAdapterReceipt, RECEIPT);
    assert.equal(Object.keys(p.files).length, 23);
    for (const [file, e] of Object.entries(p.files)) {
      assert(
        file.startsWith('games/magic/tools/accuracy/') &&
          (file.endsWith('ancestry.mjs') ||
            file.endsWith('/set-profile-check.mjs') ||
            file.endsWith('/wall-wording-data.mjs')),
      );
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    return p;
  })());
}

const ART_FILE = 'games/magic/fixtures/accuracy/mirage-onslaught/art-window-source-delta.json.gz';
const ART_HASH = 'efe629d7fca8729069378d9dd9609f682a5d20b74cad7d66e8624539e90f3314';
let artChecked;
export function oldFrameArtWindowDelta() {
  return (artChecked ??= (async () => {
    const zipped = await fs.readFile(path.join(root, ART_FILE));
    assert.equal(hash(zipped), ART_HASH, 'Changed art-window receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'old-frame-art-window');
    assert.equal(p.beforeRenderer, (await oldFrameSourceDelta()).afterRenderer);
    assert.equal(Object.keys(p.files).length, 4);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    const { nativeProof, nativeTool, ...draft } = p;
    assert.equal(nativeProof.source.deltaHash, hash(JSON.stringify(draft, null, 2) + '\n'));
    assert.equal(nativeProof.source.rendererHash, p.afterRenderer);
    assert.equal(nativeProof.status, 'unchanged-native-frame-family-controls');
    assert.equal(nativeProof.count, 65);
    assert.equal(nativeProof.changed, 0);
    assert.equal(nativeProof.rows.length, 65);
    assert.equal(new Set(nativeProof.rows.map((r) => r.id)).size, 65);
    for (const row of nativeProof.rows) {
      assert.match(row.inputHash, /^[a-f0-9]{64}$/);
      assert.match(row.sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(nativeProof.source.toolHash, nativeTool.sha256);
    assert.equal(hash(await fs.readFile(path.join(root, nativeTool.file))), nativeTool.sha256);
    return p;
  })());
}
export async function preArtWindowSource(file, bytes) {
  const p = await oldFrameArtWindowDelta(),
    e = p.files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}

const COMPONENT_FILE =
  'games/magic/fixtures/accuracy/mirage-onslaught/optional-components-source-delta.json.gz';
const COMPONENT_HASH = '24c52953a6f970b79dcaf94152ffd6e55bcfc7cc4e0d4b8123848c06998a57d3';
let componentChecked;
export function oldFrameOptionalComponentsDelta() {
  return (componentChecked ??= (async () => {
    const zipped = await fs.readFile(path.join(root, COMPONENT_FILE));
    assert.equal(hash(zipped), COMPONENT_HASH, 'Changed optional-component receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'old-frame-optional-components');
    assert.equal(p.beforeRenderer, (await oldFrameArtWindowDelta()).afterRenderer);
    assert.equal(Object.keys(p.files).length, 11);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    const { nativeProof, nativeTool, ...draft } = p;
    assert.equal(nativeProof.source.deltaHash, hash(JSON.stringify(draft, null, 2) + '\n'));
    assert.equal(nativeProof.source.rendererHash, p.afterRenderer);
    assert.equal(nativeProof.status, 'unchanged-native-frame-family-controls');
    assert.equal(nativeProof.count, 65);
    assert.equal(nativeProof.changed, 0);
    assert.equal(nativeProof.rows.length, 65);
    assert.equal(new Set(nativeProof.rows.map((r) => r.id)).size, 65);
    for (const row of nativeProof.rows) {
      assert.match(row.inputHash, /^[a-f0-9]{64}$/);
      assert.match(row.sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(nativeProof.source.toolHash, nativeTool.sha256);
    assert.equal(hash(await fs.readFile(path.join(root, nativeTool.file))), nativeTool.sha256);
    return p;
  })());
}
export async function preOptionalComponentsSource(file, bytes) {
  const p = await oldFrameOptionalComponentsDelta(),
    e = p.files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}

const BASIC_FILE =
  'games/magic/fixtures/accuracy/mirage-onslaught/basic-icons-source-delta.json.gz';
const BASIC_HASH = '63b5157b96e49c09f2b1a5949dd48091147ee90b7ceef79354123a851d39903c';
let basicChecked;
export function oldFrameBasicIconsDelta() {
  return (basicChecked ??= (async () => {
    const zipped = await fs.readFile(path.join(root, BASIC_FILE));
    assert.equal(hash(zipped), BASIC_HASH, 'Changed basic-icon receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'old-frame-basic-icons');
    assert.equal(p.beforeRenderer, (await oldFrameOptionalComponentsDelta()).afterRenderer);
    assert.equal(Object.keys(p.files).length, 7);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    const { nativeProof, nativeTool, ...draft } = p;
    assert.equal(nativeProof.source.deltaHash, hash(JSON.stringify(draft, null, 2) + '\n'));
    assert.equal(nativeProof.source.rendererHash, p.afterRenderer);
    assert.equal(nativeProof.status, 'unchanged-native-frame-family-controls');
    assert.equal(nativeProof.count, 65);
    assert.equal(nativeProof.changed, 0);
    assert.equal(nativeProof.rows.length, 65);
    assert.equal(new Set(nativeProof.rows.map((r) => r.id)).size, 65);
    for (const row of nativeProof.rows) {
      assert.match(row.inputHash, /^[a-f0-9]{64}$/);
      assert.match(row.sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(nativeProof.source.toolHash, nativeTool.sha256);
    assert.equal(hash(await fs.readFile(path.join(root, nativeTool.file))), nativeTool.sha256);
    return p;
  })());
}
export async function preBasicIconsSource(file, bytes) {
  bytes = await preFontGeometrySource(file, bytes);
  bytes = await preOldFrameAdoptionSource(file, bytes);
  bytes = await preOnslaughtSymbolSource(file, bytes);
  bytes = await preArtifactSourceRepair(file, bytes);
  const p = await oldFrameBasicIconsDelta(),
    e = p.files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}

export async function preOldFrameSource(file, bytes) {
  bytes = await preFontGeometrySource(file, bytes);
  bytes = await preBasicIconsSource(file, bytes);
  bytes = await preOptionalComponentsSource(file, bytes);
  bytes = await preArtWindowSource(file, bytes);
  const tools = await oldFrameAuditToolsDelta();
  const tool = tools.files[file];
  if (tool && hash(bytes) === tool.after) bytes = Buffer.from(tool.beforeSource);
  const p = await oldFrameSourceDelta(),
    e = p.files[file];
  if (!e || e.beforeSource === null || hash(bytes) !== e.after) return bytes;
  return Buffer.from(e.beforeSource);
}
export async function oldFrameHistoricalSourceFiles(files) {
  const p = await oldFrameSourceDelta(),
    kept = [];
  for (const file of await oldFrameAdoptionHistoricalFiles(
    await fontGeometryHistoricalFiles(files),
  )) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (
      e?.beforeSource === null &&
      hash(await preArtWindowSource(key, await fs.readFile(path.join(root, key)))) === e.after
    )
      continue;
    kept.push(file);
  }
  return kept;
}
/** The receipt changes no selected defaults. Foreign changes cannot reuse it. */
export async function oldFrameSourceRuntimeCompatible(directory, expected, set) {
  if (directory !== 'games/magic/src') return false;
  const p = await oldFrameSourceDelta();
  const art = await oldFrameArtWindowDelta();
  const component = await oldFrameOptionalComponentsDelta();
  const basic = await oldFrameBasicIconsDelta();
  let actual = await sourceHash(path.join(root, directory));
  const adoptedParent = await oldFrameAdoptionRuntimeParent(actual, set);
  if (adoptedParent !== actual && expected === adoptedParent) return true;
  actual = adoptedParent;
  const repair = await artifactSourceRepairDelta();
  if (actual === repair.afterRenderer && set && !repair.affectedSets.includes(set.toLowerCase())) {
    if (expected === repair.beforeRenderer) return true;
    actual = repair.beforeRenderer;
  }
  return (
    (expected === p.beforeRenderer &&
      [p.afterRenderer, art.afterRenderer, component.afterRenderer, basic.afterRenderer].includes(
        actual,
      )) ||
    (expected === art.beforeRenderer &&
      [art.afterRenderer, component.afterRenderer, basic.afterRenderer].includes(actual)) ||
    (expected === component.beforeRenderer &&
      [component.afterRenderer, basic.afterRenderer].includes(actual)) ||
    (expected === basic.beforeRenderer && actual === basic.afterRenderer)
  );
}
