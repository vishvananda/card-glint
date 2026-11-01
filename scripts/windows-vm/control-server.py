#!/usr/bin/env python3
"""Local-only VM payload/result transport. No host shell or arbitrary file API."""
import argparse
import hmac
import json
import mimetypes
import os
import re
import shutil
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

parser = argparse.ArgumentParser()
parser.add_argument('root', type=Path)
parser.add_argument('--port', type=int, default=48765)
args = parser.parse_args()
root = args.root.resolve()
token = (root / 'state' / 'control-token').read_text().strip()

class Handler(BaseHTTPRequestHandler):
    def authorized(self):
        return hmac.compare_digest(self.headers.get('Authorization', ''), 'Bearer ' + token)

    def send_json(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if not self.authorized():
            self.send_json(403, {'error': 'Authorization required'})
            return
        path = unquote(urlsplit(self.path).path)
        if path == '/job':
            job = root / 'tools' / 'job.json'
            self.send_json(200, json.loads(job.read_text()) if job.exists() else {'idle': True})
            return
        if not path.startswith(('/payload/', '/sdk/')):
            self.send_json(404, {'error': 'Unknown path'})
            return
        base = root / 'tools' / ('payload' if path.startswith('/payload/') else 'sdk')
        target = (base / path.split('/', 2)[2]).resolve()
        if not target.is_relative_to(base.resolve()) or not target.is_file():
            self.send_json(404, {'error': 'File unavailable'})
            return
        self.send_response(200)
        kind = 'application/wasm' if target.suffix == '.wasm' else mimetypes.guess_type(target)[0] or 'application/octet-stream'
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(target.stat().st_size))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        with target.open('rb') as stream:
            shutil.copyfileobj(stream, self.wfile)

    def do_POST(self):
        if not self.authorized():
            self.send_json(403, {'error': 'Authorization required'})
            return
        path = urlsplit(self.path).path
        if path != '/event':
            self.send_json(404, {'error': 'Unknown path'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            self.send_json(400, {'error': 'Invalid report length'})
            return
        if not 0 < length <= 4 * 1024 * 1024:
            self.send_json(413, {'error': 'Invalid report size'})
            return
        try:
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError('Expected an object')
        except (ValueError, UnicodeError):
            self.send_json(400, {'error': 'Invalid JSON'})
            return
        data['hostReceivedAt'] = time.time()
        if data.get('stage') in ['bootstrap', 'bootstrap-complete', 'agent-ready']:
            (root / 'state' / 'installed').touch()
        with (root / 'logs' / 'guest-events.jsonl').open('a') as stream:
            stream.write(json.dumps(data) + '\n')
        name = data.get('jobId')
        if data.get('stage') == 'complete' and isinstance(name, str) and re.fullmatch(r'[A-Za-z0-9_-]{1,100}', name):
            output = root / 'results' / (name + '.json')
            temporary = output.with_suffix('.tmp')
            temporary.write_text(json.dumps(data, indent=2) + '\n')
            os.replace(temporary, output)
        self.send_json(200, {'ok': True})

    def log_message(self, fmt, *values):
        # URL query strings or authentication headers are never logged.
        print('%s %s' % (self.command, self.path.split('?', 1)[0]), flush=True)

ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
