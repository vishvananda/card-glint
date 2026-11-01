#!/usr/bin/env python3
"""Generate private evaluation-VM media. Credentials are never printed."""
import argparse
import json
import os
import secrets
import shutil
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('root', type=Path)
args = parser.parse_args()
root = args.root.resolve()
state = root / 'state'
config = state / 'answer'
config.mkdir(parents=True, exist_ok=True)
(config / 'Glint').mkdir(exist_ok=True)
credentials = state / 'credentials.json'
if credentials.exists():
    password = json.loads(credentials.read_text())['password']
else:
    password = 'Glint-' + secrets.token_hex(20) + '!'
    credentials.write_text(json.dumps({'username': 'glinttest', 'password': password}))
    credentials.chmod(0o600)
token_file = state / 'control-token'
if not token_file.exists():
    token_file.write_text(secrets.token_hex(32))
    token_file.chmod(0o600)
node = json.loads((root / 'tools' / 'node-source.json').read_text())
settings = {'base': 'http://10.0.2.2:48765', 'token': token_file.read_text().strip(), 'nodeSha256': node['sha256']}
(config / 'Glint' / 'settings.json').write_text(json.dumps(settings))
shutil.copyfile(Path(__file__).with_name('guest-bootstrap.ps1'), config / 'Glint' / 'bootstrap.ps1')
ns = 'urn:schemas-microsoft-com:unattend'
wcm = 'http://schemas.microsoft.com/WMIConfig/2002/State'
ET.register_namespace('', ns)
ET.register_namespace('wcm', wcm)
def element(parent, name, text=None, action=None):
    e = ET.SubElement(parent, '{%s}%s' % (ns, name))
    if text is not None:
        e.text = str(text)
    if action:
        e.set('{%s}action' % wcm, action)
    return e

def component(parent, name):
    e = element(parent, 'component')
    e.attrib.update({'name': name, 'processorArchitecture': 'amd64', 'publicKeyToken': '31bf3856ad364e35', 'language': 'neutral', 'versionScope': 'nonSxS'})
    return e

def password_node(parent):
    e = element(parent, 'Password')
    element(e, 'Value', password)
    element(e, 'PlainText', 'true')

answer = ET.Element('{%s}unattend' % ns)
pe = element(answer, 'settings')
pe.set('pass', 'windowsPE')
i18n = component(pe, 'Microsoft-Windows-International-Core-WinPE')
setup_language = element(i18n, 'SetupUILanguage')
element(setup_language, 'UILanguage', 'en-US')
for name in ['InputLocale', 'SystemLocale', 'UILanguage', 'UserLocale']:
    element(i18n, name, 'en-US')
setup = component(pe, 'Microsoft-Windows-Setup')
disks = element(setup, 'DiskConfiguration')
disk = element(disks, 'Disk', action='add')
element(disk, 'DiskID', 0)
element(disk, 'WillWipeDisk', 'true')
partitions = element(disk, 'CreatePartitions')
for order, kind, size in [(1, 'EFI', 260), (2, 'MSR', 16), (3, 'Primary', None)]:
    part = element(partitions, 'CreatePartition', action='add')
    element(part, 'Order', order)
    element(part, 'Type', kind)
    element(part, 'Size' if size else 'Extend', size if size else 'true')
modifications = element(disk, 'ModifyPartitions')
for order, part_id, fmt, label, letter in [(1, 1, 'FAT32', 'System', None), (2, 3, 'NTFS', 'Windows', 'C')]:
    part = element(modifications, 'ModifyPartition', action='add')
    for name, value in [('Order', order), ('PartitionID', part_id), ('Format', fmt), ('Label', label)]:
        element(part, name, value)
    if letter:
        element(part, 'Letter', letter)
element(disks, 'WillShowUI', 'OnError')
image = element(element(setup, 'ImageInstall'), 'OSImage')
metadata = element(element(image, 'InstallFrom'), 'MetaData', action='add')
element(metadata, 'Key', '/IMAGE/INDEX')
element(metadata, 'Value', 1)
target = element(image, 'InstallTo')
element(target, 'DiskID', 0)
element(target, 'PartitionID', 3)
element(image, 'WillShowUI', 'OnError')
user_data = element(setup, 'UserData')
element(user_data, 'AcceptEula', 'true')
element(user_data, 'FullName', 'Renderer Test')
element(user_data, 'Organization', 'Development')
specialize = element(answer, 'settings')
specialize.set('pass', 'specialize')
shell = component(specialize, 'Microsoft-Windows-Shell-Setup')
element(shell, 'ComputerName', 'GLINT-WIN-TEST')
element(shell, 'TimeZone', 'UTC')
oobe = element(answer, 'settings')
oobe.set('pass', 'oobeSystem')
i18n = component(oobe, 'Microsoft-Windows-International-Core')
for name in ['InputLocale', 'SystemLocale', 'UILanguage', 'UserLocale']:
    element(i18n, name, 'en-US')
shell = component(oobe, 'Microsoft-Windows-Shell-Setup')
choices = element(shell, 'OOBE')
for name, value in [('HideEULAPage','true'),('HideOnlineAccountScreens','true'),('HideWirelessSetupInOOBE','true'),('ProtectYourPC',1)]:
    element(choices, name, value)
account = element(element(element(shell, 'UserAccounts'), 'LocalAccounts'), 'LocalAccount', action='add')
password_node(account)
element(account, 'Name', 'glinttest')
element(account, 'DisplayName', 'Renderer Test')
element(account, 'Group', 'Administrators')
auto = element(shell, 'AutoLogon')
password_node(auto)
element(auto, 'Username', 'glinttest')
element(auto, 'Enabled', 'true')
element(auto, 'LogonCount', 10)
commands = element(shell, 'FirstLogonCommands')
command = element(commands, 'SynchronousCommand', action='add')
element(command, 'Order', 1)
element(command, 'Description', 'Prepare renderer test tools')
script = "$s=Get-PSDrive -PSProvider FileSystem | ForEach-Object { Join-Path $_.Root 'Glint\\bootstrap.ps1' } | Where-Object { Test-Path $_ } | Select-Object -First 1; if (!$s) { throw 'Test bootstrap media missing' }; & $s"
element(command, 'CommandLine', 'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "' + script + '"')
element(command, 'RequiresUserInput', 'false')
ET.indent(answer)
ET.ElementTree(answer).write(config / 'Autounattend.xml', encoding='utf-8', xml_declaration=True)
subprocess.run(['genisoimage', '-quiet', '-J', '-R', '-V', 'GLINT_CONFIG', '-o', str(root / 'media' / 'answer.iso'), str(config)], check=True)
(root / 'media' / 'answer.iso').chmod(0o600)
if not (state / 'OVMF_VARS.fd').exists():
    shutil.copyfile('/usr/share/OVMF/OVMF_VARS_4M.ms.fd', state / 'OVMF_VARS.fd')
if not (state / 'windows.qcow2').exists():
    subprocess.run(['qemu-img', 'create', '-f', 'qcow2', str(state / 'windows.qcow2'), '96G'], check=True)
print('Private answer media, firmware variables and sparse VM disk are ready.')
