const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('public/textflow.js', 'utf8').replace('  if(storageWarning)', '  globalThis.testApi={parseCsv,exportFiles,zipFiles,validateLibrary,libraryData,formattedMessage};\n  if(storageWarning)');
function boot(storage = new Map()) {
  const nodes = new Map();
  function node(id) { if (!nodes.has(id)) nodes.set(id, {value:id==='langSelect'?'en':id==='genreSelect'?'singular':'',dataset:{},listeners:{},classList:{add(){},remove(){},toggle(){}},addEventListener(event,fn){this.listeners[event]=fn;},setAttribute(){},replaceChildren(){},append(){}});return nodes.get(id); }
  const context = {structuredClone,TextEncoder,Uint8Array,DataView,Blob,Date,Map,Set,URL,crypto:require('node:crypto').webcrypto,console,setTimeout(){},clearTimeout(){},localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],createElement:()=>node('created')},window:{},navigator:{}};
  vm.runInNewContext(source,context);
  return {api:context.testApi,node,storage};
}
(async()=>{
  const app=boot();
  const rows=app.api.parseCsv('\ufeffcustomer_email;customer_name;language;genre\r\na@example.com;"Doe; Ana";ES;singular');
  assert.equal(rows[0].customer_name,'Doe; Ana');assert.equal(rows[0].language,'es');
  assert.throws(()=>app.api.parseCsv('customer_name,customer_email,language,genre\n"unclosed'));
  assert.throws(()=>app.api.parseCsv('customer_name,customer_email,language,genre\nAna,a@example.com,en'));
  app.node('templateEditor').listeners.input({target:{value:'Hi {{customer_name}} — {{customer_email}}'}});
  assert.equal(boot(app.storage).node('templateEditor').value,'Hi {{customer_name}} — {{customer_email}}');
  const files=app.api.exportFiles();assert.equal(files[0].name,'maria@example.com/update.txt');
  assert.match(files[2].content,/Hi James Wilson/);
  assert.match(app.api.formattedMessage('**Hello**\n[Visit](https://example.com)'), /<strong>Hello<\/strong><br><a href="https:\/\/example.com"/);
  assert.ok(!app.api.formattedMessage('<img src=x onerror=alert(1)> [bad](javascript:alert)').includes('<img'));
  assert.ok(!app.api.formattedMessage('[bad](javascript:alert)').includes('<a'));
  app.node('exportHtml').checked=true;
  assert.equal(app.api.exportFiles()[0].name,'maria@example.com/update.html');
  assert.match(app.api.exportFiles()[0].content, /<!doctype html>/);
  app.node('exportHtml').checked=false;
  const zip=app.api.zipFiles(files);const bytes=Buffer.from(await zip.arrayBuffer());
  assert.equal(bytes.readUInt32LE(0),0x04034b50);assert.ok(bytes.includes(Buffer.from('maria@example.com/update.txt')));
  assert.throws(()=>app.api.validateLibrary({version:1,templates:[{id:'__proto__',name:'bad'}]}));
  assert.equal(app.api.validateLibrary(app.api.libraryData()).templates.update.en.singular,'Hi {{customer_name}} — {{customer_email}}');
  console.log('Passed: startup, CSV parsing and validation, template persistence across reload, interpolation, email folder paths, ZIP encoding, backup validation.');
})();
