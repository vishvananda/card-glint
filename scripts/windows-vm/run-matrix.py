#!/usr/bin/env python3
"""Queue sequential Windows probes; keep both quality levels and source identity."""
import argparse
import fcntl
import hashlib
import json
import re
import time
import uuid
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('root', type=Path)
parser.add_argument('--browser', choices=['msedge', 'chromium', 'firefox'], default='msedge')
parser.add_argument('--backend', choices=['default', 'warp', 'swiftshader'], default='default')
parser.add_argument('--suite', choices=['finishes', 'visible', 'stress', 'control', 'bare', 'all'], default='all')
parser.add_argument('--timeout', type=int, default=600)
parser.add_argument('--prefix', default=time.strftime('%Y%m%dT%H%M%SZ', time.gmtime()) + '-' + uuid.uuid4().hex[:6])
args = parser.parse_args()
if not re.fullmatch(r'[A-Za-z0-9_-]{1,40}', args.prefix):
    parser.error('prefix must contain 1–40 letters, digits, underscores or hyphens')
if not 30 <= args.timeout <= 600:
    parser.error('timeout must be 30–600 seconds')
if args.browser == 'firefox' and args.backend == 'swiftshader':
    parser.error('Firefox supports default or WARP, not Chromium SwiftShader')
root = args.root.resolve()
for directory in ['state', 'tools/payload', 'tools/sdk', 'results']:
    if not (root / directory).is_dir():
        parser.error('VM directory is not prepared: ' + directory)


def fingerprint():
    digest = hashlib.sha256()
    files = list((root / 'tools/sdk').rglob('*'))
    files += [root / 'tools/payload' / name for name in [
        'shader-probe.mjs', 'visible-print-probe.mjs', 'stress-scene.mjs', 'stress-probe.mjs', 'stress-control-probe.mjs', 'stress-bare-probe.mjs',
    ]]
    for file in sorted(files):
        if file.is_file():
            digest.update(str(file.relative_to(root / 'tools')).encode())
            digest.update(hashlib.sha256(file.read_bytes()).digest())
    return digest.hexdigest()


def report_from(result):
    report = None
    for line in (result.get('stdout') or '').splitlines():
        try:
            data = json.loads(line)
        except ValueError:
            continue
        if isinstance(data, dict) and data.get('stage') == 'report':
            report = data
    return report


scripts = {'finishes': 'shader-probe.mjs', 'visible': 'visible-print-probe.mjs', 'stress': 'stress-probe.mjs', 'control': 'stress-control-probe.mjs', 'bare': 'stress-bare-probe.mjs'}
suites = list(scripts) if args.suite == 'all' else [args.suite]
plan = [(suite, quality) for suite in suites for quality in (['reduced'] if suite in ['control', 'bare'] else ['reduced', 'full'])]
summary = {'schema': 1, 'browser': args.browser, 'backend': args.backend, 'fingerprint': fingerprint(), 'cases': []}
summary_path = root / 'results' / ('matrix-' + args.prefix + '.json')
lock = (root / 'state/queue.lock').open('w')
try:
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
except BlockingIOError:
    parser.error('Another matrix producer owns this VM queue')

for suite, quality in plan:
    identity = args.prefix + '-' + suite + '-' + quality
    job = {'id': identity, 'script': scripts[suite], 'backend': args.backend, 'quality': quality, 'browser': args.browser, 'timeoutSeconds': args.timeout}
    result_path = root / 'results' / (identity + '.json')
    if result_path.exists():
        raise RuntimeError('Use a new prefix; result already exists: ' + identity)
    temporary = root / 'tools/job.next'
    temporary.write_text(json.dumps(job))
    temporary.replace(root / 'tools/job.json')
    print('Running', identity, flush=True)
    deadline = time.monotonic() + args.timeout + 90
    while not result_path.exists():
        if time.monotonic() > deadline:
            raise TimeoutError('Guest coordinator did not return: ' + identity)
        time.sleep(2)
    result = json.loads(result_path.read_text())
    if result.get('jobId') != identity:
        raise RuntimeError('Unexpected result identity')
    if fingerprint() != summary['fingerprint']:
        raise RuntimeError('SDK or probe inputs changed during this matrix; use a new prefix')
    report = report_from(result)
    unsupported = report is not None and report.get('supported') is False
    valid_rows = report is not None and (
        len(report.get('rows', [])) == 10 if suite in ['finishes', 'visible'] else
        [row.get('count') for row in report.get('rows', [])] == [100, 300, 100]
    )
    passed = result.get('exitCode') == 0 and not result.get('timedOut') and valid_rows and report.get('selectedQuality') == quality and not report.get('error') and not report.get('errors')
    status = 'unsupported' if unsupported else 'pass' if passed else 'fail'
    summary['cases'].append({'job': job, 'status': status, 'elapsedMs': result.get('elapsedMs'), 'timedOut': result.get('timedOut'), 'report': report})
    temporary = summary_path.with_suffix('.tmp')
    temporary.write_text(json.dumps(summary, indent=2) + '\n')
    temporary.replace(summary_path)
    print(status, identity, '→', summary_path.name, flush=True)
raise SystemExit(1 if any(case['status'] == 'fail' for case in summary['cases']) else 2 if any(case['status'] == 'unsupported' for case in summary['cases']) else 0)
