import http.client
import json
import socket
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path


class ControlTransportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.folder = tempfile.TemporaryDirectory()
        cls.root = Path(cls.folder.name)
        for name in ['state', 'logs', 'results', 'tools/payload', 'tools/sdk']:
            (cls.root / name).mkdir(parents=True, exist_ok=True)
        (cls.root / 'state/control-token').write_text('fixture-token')
        (cls.root / 'state/private.txt').write_text('not an asset')
        (cls.root / 'tools/sdk/browser.js').write_text('export const probe = true;')
        (cls.root / 'tools/sdk/core.wasm').write_bytes(b'\x00asm')
        with socket.socket() as reserve:
            reserve.bind(('127.0.0.1', 0))
            cls.port = reserve.getsockname()[1]
        cls.process = subprocess.Popen(
            [sys.executable, str(Path(__file__).with_name('control-server.py')), str(cls.root), '--port', str(cls.port)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        for _ in range(100):
            try:
                cls.call('GET', '/job')
                break
            except OSError:
                time.sleep(.02)
        else:
            raise RuntimeError('Test controller did not start')

    @classmethod
    def tearDownClass(cls):
        cls.process.terminate()
        cls.process.wait(timeout=5)
        cls.folder.cleanup()

    @classmethod
    def call(cls, method, path, body=None, auth=True, extra_headers=None):
        connection = http.client.HTTPConnection('127.0.0.1', cls.port, timeout=5)
        try:
            headers = {'Authorization': 'Bearer fixture-token'} if auth else {}
            headers.update(extra_headers or {})
            connection.request(method, path, body, headers)
            response = connection.getresponse()
            return response.status, dict(response.getheaders()), response.read()
        finally:
            connection.close()

    def test_all_routes_require_authentication(self):
        for method, path in [('GET', '/job'), ('GET', '/sdk/browser.js'), ('POST', '/event')]:
            self.assertEqual(self.call(method, path, auth=False)[0], 403)

    def test_browser_assets_and_wasm_mime(self):
        self.assertEqual(self.call('GET', '/sdk/browser.js')[2], b'export const probe = true;')
        status, headers, body = self.call('GET', '/sdk/core.wasm')
        self.assertEqual((status, headers['Content-Type'], body), (200, 'application/wasm', b'\x00asm'))

    def test_traversal_cannot_read_private_state(self):
        for path in ['/sdk/../../state/private.txt', '/payload/../../state/private.txt', '/sdk/%2e%2e/%2e%2e/state/private.txt']:
            self.assertEqual(self.call('GET', path)[0], 404)

    def test_symlink_cannot_escape_payload_root(self):
        target = self.root / 'tools/payload/escape'
        target.symlink_to(self.root / 'state/private.txt')
        self.assertEqual(self.call('GET', '/payload/escape')[0], 404)

    def test_idle_job_and_selected_job(self):
        self.assertEqual(json.loads(self.call('GET', '/job')[2]), {'idle': True})
        job = self.root / 'tools/job.json'
        try:
            job.write_text(json.dumps({'id': 'probe', 'backend': 'warp'}))
            self.assertEqual(json.loads(self.call('GET', '/job')[2])['backend'], 'warp')
        finally:
            job.unlink(missing_ok=True)

    def test_malformed_or_oversized_report_is_rejected(self):
        self.assertEqual(self.call('POST', '/event', b'invalid')[0], 400)
        self.assertEqual(self.call('POST', '/event', b'[]')[0], 400)
        self.assertEqual(self.call('POST', '/event', extra_headers={'Content-Length': 'invalid'})[0], 400)
        self.assertEqual(self.call('POST', '/event', extra_headers={'Content-Length': str(5 * 1024 * 1024)})[0], 413)

    def test_bootstrap_marks_existing_installation_to_prevent_accidental_reinstall(self):
        self.assertEqual(self.call('POST', '/event', json.dumps({'stage': 'bootstrap'}))[0], 200)
        self.assertTrue((self.root / 'state/installed').exists())

    def test_result_is_saved_atomically_with_validated_name(self):
        payload = {'stage': 'complete', 'jobId': 'matrix-1', 'timedOut': True}
        self.assertEqual(self.call('POST', '/event', json.dumps(payload))[0], 200)
        result = json.loads((self.root / 'results/matrix-1.json').read_text())
        self.assertTrue(result['timedOut'])
        self.assertIn('hostReceivedAt', result)
        self.assertFalse((self.root / 'results/matrix-1.tmp').exists())
        payload['jobId'] = '../outside'
        self.assertEqual(self.call('POST', '/event', json.dumps(payload))[0], 200)
        self.assertFalse((self.root / 'outside.json').exists())

    @unittest.skipUnless(shutil.which('node'), 'Node is needed for the guest coordinator check')
    def test_coordinator_returns_child_exit_and_both_logs(self):
        guest = self.root / 'guest'
        (guest / 'runner').mkdir(parents=True)
        shutil.copyfile(Path(__file__).with_name('guest-agent.mjs'), guest / 'guest-agent.mjs')
        (guest / 'settings.json').write_text(json.dumps({'base': f'http://127.0.0.1:{self.port}', 'token': 'fixture-token'}))
        (self.root / 'tools/payload/smoke.mjs').write_text('console.log("child complete"); console.error("diagnostic warning");')
        job = self.root / 'tools/job.json'
        job.write_text(json.dumps({'id': 'coordinator-smoke', 'script': 'smoke.mjs', 'backend': 'default', 'quality': 'reduced', 'browser': 'msedge', 'timeoutSeconds': 30}))
        agent = subprocess.Popen([shutil.which('node'), str(guest / 'guest-agent.mjs')], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        try:
            result = self.root / 'results/coordinator-smoke.json'
            deadline = time.monotonic() + 10
            while not result.exists() and time.monotonic() < deadline:
                if agent.poll() is not None:
                    self.fail(agent.stderr.read().decode())
                time.sleep(.05)
            self.assertTrue(result.exists(), 'Coordinator must return completion without a redirected-process deadlock')
            data = json.loads(result.read_text())
            self.assertEqual(data['exitCode'], 0)
            self.assertFalse(data['timedOut'])
            self.assertIn('child complete', data['stdout'])
            self.assertIn('diagnostic warning', data['stderr'])
        finally:
            job.unlink(missing_ok=True)
            agent.terminate()
            agent.wait(timeout=5)
            agent.stderr.close()


if __name__ == '__main__':
    unittest.main()
