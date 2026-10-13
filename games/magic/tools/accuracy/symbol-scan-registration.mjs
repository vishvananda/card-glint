import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, fixtureRoot, hash } from './common.mjs';
import { fitScanStockRegistration, SCAN_STOCK_POLICY } from './scan-stock-registration.mjs';
const [set] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]{2,6}$/);
const diagnostic = await readJson(`${fixtureRoot}/${set}-symbol-material-diagnostic.json`),
  profile = await readJson(`${fixtureRoot}/old-frame-registration-${set}.json`);
assert.equal(hash(JSON.stringify(profile)), diagnostic.profileHash);
const rows = diagnostic.rows.map((row) => ({
  id: row.id,
  referenceHash: row.referenceHash,
  material: row.material,
  ...(row.frameAdmitted
    ? fitScanStockRegistration(row.stock, profile.targets[row.material])
    : { accepted: false, reason: 'frame-template-unvalidated', transform: null }),
}));
const result = {
  schemaVersion: 1,
  scope:
    'Per-scan translation and uniform scale for comparison only. Frozen independent stock edges; no symbol or text fitting and no renderer settings. Attempt every ordinary card. Rejected or unvalidated cases keep explicit reasons and cannot inherit a shared transform in normalized score summaries.',
  methodHash: hash(
    Buffer.concat(
      await Promise.all(
        ['symbol-scan-registration.mjs', 'scan-stock-registration.mjs'].map((file) =>
          readFile(new URL(file, import.meta.url)),
        ),
      ),
    ),
  ),
  profileHash: diagnostic.profileHash,
  diagnosticHash: hash(JSON.stringify(diagnostic)),
  policy: SCAN_STOCK_POLICY,
  summary: Object.fromEntries(
    [...new Set(rows.map((r) => r.reason ?? 'accepted'))].map((reason) => [
      reason,
      rows.filter((r) => (r.reason ?? 'accepted') === reason).length,
    ]),
  ),
  rows,
};
await writeJson(`${fixtureRoot}/${set}-symbol-scan-registration.json`, result);
console.log(set, result.summary);
