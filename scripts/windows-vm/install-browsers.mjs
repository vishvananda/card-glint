import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
const [, , browser = 'firefox'] = process.argv.slice(2);
if (!['msedge', 'chromium', 'firefox'].includes(browser)) throw Error('Invalid browser selection');
if (browser === 'msedge')
  console.log(JSON.stringify({ stage: 'browser-install', browser, includedWithWindows: true }));
else {
  const require = createRequire(import.meta.url),
    cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
  const child = spawn(process.execPath, [cli, 'install', browser], {
    stdio: 'inherit',
    env: process.env,
  });
  const code = await new Promise((resolve, reject) => {
    child.once('exit', resolve);
    child.once('error', reject);
  });
  if (code !== 0) throw Error('Browser installation failed: ' + browser);
  console.log(JSON.stringify({ stage: 'browser-install', browser, complete: true }));
}
