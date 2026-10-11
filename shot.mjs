import { chromium } from 'playwright';
import { resolve } from 'node:path'; import { pathToFileURL } from 'node:url';
const [,,file,out,w=1600,h=1000]=process.argv;
const b=await chromium.launch({args:['--allow-file-access-from-files']}); const p=await b.newPage({viewport:{width:+w,height:+h}});
p.on('console',m=>console.log('console:',m.text())); p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(pathToFileURL(resolve(file)).href); await p.waitForFunction(()=>document.title==='done',null,{timeout:20000});
await p.locator('canvas').first().screenshot({path:out}); await b.close();
