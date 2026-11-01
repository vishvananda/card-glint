#!/usr/bin/env python3
"""Bounded management requests for this VM's private QMP socket."""
import argparse
import json
import socket
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('root', type=Path)
parser.add_argument('command', choices=['query-status', 'system_powerdown', 'screendump'])
args = parser.parse_args()
root = args.root.resolve()
with socket.socket(socket.AF_UNIX) as connection:
    connection.settimeout(15)
    try:
        connection.connect(str(root / 'state/qmp.sock'))
    except (FileNotFoundError, ConnectionRefusedError):
        if args.command != 'system_powerdown':
            raise
        print(json.dumps({'status': 'already-stopped'}))
        raise SystemExit(0)
    stream = connection.makefile('rwb', buffering=0)
    stream.readline()
    def request(command, arguments=None):
        stream.write((json.dumps({'execute': command, **({'arguments': arguments} if arguments else {})}) + '\n').encode())
        while line := stream.readline():
            response = json.loads(line)
            if 'event' not in response:
                if 'error' in response:
                    raise RuntimeError(response['error'])
                return response['return']
        raise RuntimeError('QMP closed without a response')
    request('qmp_capabilities')
    arguments = {'filename': str(root / 'results/console.png'), 'format': 'png'} if args.command == 'screendump' else None
    print(json.dumps(request(args.command, arguments)))
