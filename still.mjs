// node still.mjs t1 t2 ... -> tmp/still_<t>.png ; plus out/sheet.png grid
import { chromium } from 'playwright';
import { resolve } from 'node:path'; import { pathToFileURL } from 'node:url';
const ts = process.argv.slice(2).map(Number);
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(pathToFileURL(resolve(process.env.PAGE || 'index.html')).href);
await p.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
for (const t of ts) { const t0 = Date.now(); await p.evaluate(t => window.seek(t), t);
  await p.locator('#c').screenshot({ path: `tmp/still_${t.toFixed(2)}.png` }); console.log('t', t, Date.now() - t0, 'ms'); }
await b.close();
