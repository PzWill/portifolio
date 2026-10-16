const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)])}
const files=walk(root);let checked=0;
for(const file of files){
 if(file.endsWith('.js')){const result=cp.spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr)}
 if(file.endsWith('.json'))JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
 if(!file.endsWith('.html'))continue;
 const html=fs.readFileSync(file,'utf8');
 if(!/<title>[^<]+<\/title>/.test(html)||!html.includes('name="viewport"'))throw Error('Missing document metadata: '+file);
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(match[1]);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=match[1];if(/^(?:https?:|data:|mailto:|#)/.test(value))continue;
  const target=path.resolve(path.dirname(file),value.split(/[?#]/)[0]);
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target))throw Error('Broken local reference: '+value+' in '+file);
 }
 checked++;
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const value of ['PzWill','Daily Dash','Tagesschrift','Audio-Reactive ASCII 3D'])if(!home.includes(value))throw Error('Missing static content: '+value);
console.log(`Validated ${checked} pages, JavaScript syntax, JSON data and local links.`);
