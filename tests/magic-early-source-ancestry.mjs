import { preFourthBasicBodySource } from '../games/magic/tools/accuracy/fourth-basic-body-ancestry.mjs';
import { abuFlowAffected } from '../games/magic/tools/accuracy/abu-flow-ancestry.mjs';
import { preAbuPerimeterSource } from '../games/magic/tools/accuracy/abu-perimeter-ancestry.mjs';
import {
  preAbuFractionalSource,
  abuFractionalAncestry,
} from '../games/magic/tools/accuracy/abu-fractional-ancestry.mjs';
import { profilePreparationProofDependency } from '../games/magic/tools/accuracy/profile-preparation-ancestry.mjs';
import { profileAdapterProofDependency } from '../games/magic/tools/accuracy/profile-adapter-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  preEarlyCalibrationSource,
  earlyCalibrationAffected,
  EARLY_SOURCE_RECEIPT,
} from '../games/magic/tools/accuracy/abu-source-ancestry.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preOracleInsetSource } from '../games/magic/tools/accuracy/alpha-oracle-ancestry.mjs';
const proof = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-through-fourth/source-proof.json'),
);
for (const [file, entry] of Object.entries(proof.files)) {
  const current = await readFile(file),
    before = await preEarlyCalibrationSource(
      file,
      await profilePreparationProofDependency(file, current),
    );
  assert.equal(
    hash(await preOracleInsetSource(file, await profileAdapterProofDependency(file, current))),
    entry.after,
  );
  assert.equal(hash(before), entry.before);
  assert.deepEqual(await preEarlyCalibrationSource(file, before), before);
  await assert.rejects(
    preEarlyCalibrationSource(file, Buffer.concat([current, Buffer.from('\n// unknown change\n')])),
    /Unreviewed (?:early source|M21 style source|Eighth source|ABU fractional source|AB perimeter source|AB raster source|AB paper source)/,
  );
}
const unrelated = Buffer.from('Unrelated source is not rewritten');
assert.deepEqual(await preEarlyCalibrationSource('unknown.ts', unrelated), unrelated);
console.log(
  'Early source ancestry: exact four-file restoration, immutable ancestor acceptance and unknown-edit rejection pass.',
);

const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const lea = structuredClone(ledger.sets.find((s) => s.set === 'lea'));
const group = lea.groups.find((g) =>
  g.printingIds.includes('f13ad58a-6f9b-420a-bac1-40929f5e616a'),
);
assert(await earlyCalibrationAffected('lea', group, 'rules'));
assert.equal(await earlyCalibrationAffected('lea', group, 'headings'), false);
assert.equal(await earlyCalibrationAffected('lea', group, 'rules', true), false);
const { calibrationReport } = await import('../games/magic/tools/accuracy/calibration-report.mjs');
lea.groups = [group];
lea.inventory.ordinaryPrintings = group.printings;
group.tasks.rules.status = 'validated';
delete group.tasks.rules.proof.earlyBatchReceipt;
group.tasks.rules.guards['games/magic/src/presentation/early-text-tiers.ts'] =
  proof.files['games/magic/src/presentation/early-text-tiers.ts'].before;
const [reopened] = await calibrationReport({ ...ledger, sets: [lea] });
assert.equal(reopened.byTask.rules['needs-audit'], 1);
assert.equal(reopened.byTask.headings.validated, 1);
group.tasks.rules.proof.earlyBatchReceipt = EARLY_SOURCE_RECEIPT;
group.tasks.rules.proof.abuFractionalSource = (await abuFractionalAncestry()).afterRenderer;
const [stale] = await calibrationReport({ ...ledger, sets: [lea] });
assert.equal(
  stale.byTask.rules[
    (await abuFlowAffected('lea', 'rules', false, group)) ? 'needs-audit' : 'stale'
  ],
  1,
  'A marker cannot authorize an old fit or old source guards',
);
group.tasks.headings.guards['games/magic/src/presentation/early-text-tiers.ts'] = '0'.repeat(64);
const [badHeadingGuard] = await calibrationReport({ ...ledger, sets: [lea] });
assert.equal(
  badHeadingGuard.byTask.headings.stale,
  1,
  'An unchanged component still enforces its source guards',
);
console.log(
  'Component scope: changed rules reopen, unchanged headings survive, marker-only evidence fails closed.',
);

const { preUnlimitedEmptySource } = await import(
  '../games/magic/tools/accuracy/unlimited-empty-ancestry.mjs'
);
const emptyAdapter = 'games/magic/tools/accuracy/empty-printing-text.mjs';
const emptyBytes = await readFile(emptyAdapter);
assert.equal(
  hash(await preUnlimitedEmptySource(emptyAdapter, emptyBytes)),
  'c014fd2b2c2c950c7442338716f2cf5bc7fe50d3fbc9da4354a98fc034b1f911',
);
await assert.rejects(
  preUnlimitedEmptySource(
    emptyAdapter,
    Buffer.concat([emptyBytes, Buffer.from('\n// unknown adapter change\n')]),
  ),
  /Unreviewed Unlimited/,
);
assert.deepEqual(await preUnlimitedEmptySource('unrelated.mjs', unrelated), unrelated);
console.log(
  'Unlimited adapter ancestry: exact scoped entry, original bytes and unknown-edit rejection pass.',
);

const oracleProof = JSON.parse(
  await readFile(
    'games/magic/fixtures/accuracy/early-through-fourth/alpha-oracle-source-proof.json',
  ),
);
for (const [file, entry] of Object.entries(oracleProof.files)) {
  const current = await preAbuFractionalSource(file, await readFile(file));
  assert.equal(hash(current), entry.after);
  const original = await preOracleInsetSource(file, current);
  assert.equal(hash(original), entry.before);
  assert.deepEqual(await preOracleInsetSource(file, original), original);
  await assert.rejects(
    preOracleInsetSource(file, Buffer.concat([current, Buffer.from('\n// unknown Oracle edit\n')])),
    /Unreviewed (?:early source|M21 style source|Eighth source|ABU fractional source|AB perimeter source|AB raster source|AB paper source)/,
  );
}
console.log(
  'Oracle-only source restoration verifies 295 identical original layouts and rejects unknown edits.',
);

const { preProfilePreparationSource } = await import(
  '../games/magic/tools/accuracy/profile-preparation-ancestry.mjs'
);
const preparation = JSON.parse(
  await readFile(
    'games/magic/fixtures/accuracy/early-through-fourth/profile-preparation-source-proof.json',
  ),
);
// Historical membership is an explicit test fixture, not a claim about the
// current registered profiles. Current/new profiles are checked separately.
const historicalScopes = Buffer.from(
  "export const profileSets: readonly string[] = ['4ed', 'chr', 'fem'];",
);
const historicalProfiles = async (file) =>
  file.endsWith('/data/scopes.ts')
    ? historicalScopes
    : file.endsWith('/sets/2ed.ts')
      ? undefined
      : preFourthBasicBodySource(file, await readFile(file));
// Remove only the separately proven AB perimeter edit before testing optional
// profile activation. It cannot authorize changes to the probed set profile.
for (const [file, entry] of Object.entries(preparation.files)) {
  const bytes = await preAbuPerimeterSource(file, await readFile(file));
  assert.equal(hash(await preProfilePreparationSource(file, bytes, 'lea')), entry.before);
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes, '4ed'),
    bytes,
    'Current Fourth body data activates the helper and must retain its current guards',
  );
  assert.equal(
    hash(await preProfilePreparationSource(file, bytes, undefined, historicalProfiles)),
    entry.before,
  );
  await assert.rejects(
    preProfilePreparationSource(
      file,
      Buffer.concat([bytes, Buffer.from('// unknown helper edit')]),
      'lea',
    ),
    /Unreviewed/,
  );
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes, '4ed', async () =>
      Buffer.from('changed set data'),
    ),
    bytes,
    'A changed profile must keep current source guards',
  );
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes, '2ed', async () =>
      Buffer.from('new full profile'),
    ),
    bytes,
    'Newly activated profiles must not inherit historical helper guards',
  );
  assert.deepEqual(await preProfilePreparationSource(file, bytes, '../'), bytes);
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes, '2ed'),
    bytes,
    'Installed Unlimited data must keep its new helper identity',
  );
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes),
    bytes,
    'Current unscoped source cannot approve a newly installed profile',
  );
  const scopesPath = 'games/magic/src/data/scopes.ts';
  const scopes = historicalScopes;
  const activeAlias = async (path) =>
    path === scopesPath
      ? Buffer.from(
          scopes.toString().replace("['4ed', 'chr', 'fem']", "['4ed', 'chr', 'fem', '2ed']"),
        )
      : path.endsWith('/2ed.ts')
        ? undefined
        : historicalProfiles(path);
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes, '2ed', activeAlias),
    bytes,
    'A newly registered full profile must bypass restoration even without a matching filename',
  );
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes, undefined, activeAlias),
    bytes,
    'Unscoped restoration cannot ignore newly registered full profiles',
  );
  const removed = async (path) =>
    path === scopesPath
      ? Buffer.from(scopes.toString().replace("['4ed', 'chr', 'fem']", "['chr', 'fem']"))
      : historicalProfiles(path);
  assert.deepEqual(
    await preProfilePreparationSource(file, bytes, '4ed', removed),
    bytes,
    'Removed profile membership invalidates its old helper guards',
  );
}
console.log(
  'Profile preparation ancestry: 302 actual native pairs and 25,200 metadata cases; inactive defaults restore, changed/new profiles bypass restoration, unknown edits reject.',
);
