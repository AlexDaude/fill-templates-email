

(() => {
  'use strict';
  const DEMO = [
    {customer_name:'María García',customer_email:'maria@example.com',language:'es',genre:'singular'},
    {customer_name:'Equip Atlas',customer_email:'hola@atlas.example',language:'ca',genre:'plural'},
    {customer_name:'James Wilson',customer_email:'james@example.com',language:'en',genre:'singular'},
    {customer_name:'The Palmer Group',customer_email:'team@palmer.example',language:'en',genre:'plural'},
  ];
  const original = {
    update: {
      en: { singular:'Hello {{customer_name}},\n\nWe wanted to share a quick update with you. We have been working on some improvements and look forward to sharing more details soon.\n\nIf you have any questions, please feel free to reply.\n\nBest regards,\nThe Team', plural:'Hello {{customer_name}},\n\nWe wanted to share a quick update with your team. We have been working on some improvements and look forward to sharing more details soon.\n\nIf you have any questions, please feel free to reply.\n\nBest regards,\nThe Team' },
      es: { singular:'Hola {{customer_name}},\n\nQueríamos compartir contigo una pequeña actualización. Estamos trabajando en algunas mejoras y pronto tendremos más novedades.\n\nSi tienes cualquier pregunta, no dudes en responder a este mensaje.\n\nUn saludo,\nEl equipo', plural:'Hola {{customer_name}},\n\nQueríamos compartir con vosotros una pequeña actualización. Estamos trabajando en algunas mejoras y pronto tendremos más novedades.\n\nSi tenéis cualquier pregunta, no dudéis en responder a este mensaje.\n\nUn saludo,\nEl equipo' },
      ca: { singular:'Hola {{customer_name}},\n\nVolíem compartir amb tu una petita actualització. Estem treballant en algunes millores i aviat tindrem més novetats.\n\nSi tens cap pregunta, no dubtis a respondre aquest missatge.\n\nSalutacions,\nL’equip', plural:'Hola {{customer_name}},\n\nVolíem compartir amb vosaltres una petita actualització. Estem treballant en algunes millores i aviat tindrem més novetats.\n\nSi teniu cap pregunta, no dubteu a respondre aquest missatge.\n\nSalutacions,\nL’equip' }
    },
    invitation: {
      en: {singular:'Hello {{customer_name}},\n\nYou are invited to our upcoming event! We would love to see you there.\n\nWe will share the schedule and further details shortly.\n\nHope to see you soon,\nThe Team',plural:'Hello {{customer_name}},\n\nYour team is invited to our upcoming event! We would love to see you all there.\n\nWe will share the schedule and further details shortly.\n\nHope to see you soon,\nThe Team'},
      es: {singular:'Hola {{customer_name}},\n\n¡Nos gustaría invitarte a nuestro próximo evento! Será un placer contar contigo.\n\nPronto compartiremos el programa y todos los detalles.\n\n¡Esperamos verte!\nEl equipo',plural:'Hola {{customer_name}},\n\n¡Nos gustaría invitaros a nuestro próximo evento! Será un placer contar con vosotros.\n\nPronto compartiremos el programa y todos los detalles.\n\n¡Esperamos veros!\nEl equipo'},
      ca: {singular:'Hola {{customer_name}},\n\nEns agradaria convidar-te al nostre proper esdeveniment! Ens farà molta il·lusió comptar amb tu.\n\nAviat compartirem el programa i tots els detalls.\n\nFins aviat,\nL’equip',plural:'Hola {{customer_name}},\n\nEns agradaria convidar-vos al nostre proper esdeveniment! Ens farà molta il·lusió comptar amb vosaltres.\n\nAviat compartirem el programa i tots els detalls.\n\nFins aviat,\nL’equip'}
    },
    thankyou: {
      en: {singular:'Hello {{customer_name}},\n\nThank you for your trust and continued support. It means a lot to us, and we are grateful to have you with us.\n\nWe look forward to staying in touch.\n\nWarm regards,\nThe Team',plural:'Hello {{customer_name}},\n\nThank you all for your trust and continued support. It means a lot to us, and we are grateful to have your team with us.\n\nWe look forward to staying in touch.\n\nWarm regards,\nThe Team'},
      es: {singular:'Hola {{customer_name}},\n\nGracias por tu confianza y apoyo. Para nosotros significa mucho contar contigo.\n\nEsperamos seguir en contacto.\n\nUn cordial saludo,\nEl equipo',plural:'Hola {{customer_name}},\n\nGracias por vuestra confianza y apoyo. Para nosotros significa mucho contar con vosotros.\n\nEsperamos seguir en contacto.\n\nUn cordial saludo,\nEl equipo'},
      ca: {singular:'Hola {{customer_name}},\n\nMoltes gràcies per la teva confiança i el teu suport. Per a nosaltres és molt important comptar amb tu.\n\nEsperem continuar en contacte.\n\nUna salutació cordial,\nL’equip',plural:'Hola {{customer_name}},\n\nMoltes gràcies per la vostra confiança i el vostre suport. Per a nosaltres és molt important comptar amb vosaltres.\n\nEsperem continuar en contacte.\n\nUna salutació cordial,\nL’equip'}
    }
  };
  let templates = structuredClone(original);
  const STORAGE_KEY = 'textflow.templates.v1';
  const labels = {update:'General update',invitation:'Invitation',thankyou:'Thank you'};
  let storageWarning = '';
  function validateLibrary(data){
    if(data?.version!==1 || !Array.isArray(data.templates) || !data.templates.length || data.templates.length>100)throw new Error('Invalid template backup.');
    const result=Object.create(null), names=Object.create(null);
    for(const entry of data.templates){
      if(!/^[a-z0-9_-]{1,80}$/.test(entry.id) || ['__proto__','constructor','prototype'].includes(entry.id) || Object.hasOwn(result,entry.id) || typeof entry.name!=='string' || !entry.name.trim())throw new Error('Invalid template name or identifier.');
      const variants={};
      for(const lang of ['en','es','ca']){variants[lang]={};for(const form of ['singular','plural']){const value=entry.variants?.[lang]?.[form];if(typeof value!=='string' || value.length>100000)throw new Error('Backup must contain all six text variants.');variants[lang][form]=value;}}
      result[entry.id]=variants;names[entry.id]=entry.name.slice(0,100);
    }
    return {templates:result,labels:names};
  }
  function libraryData(){return {version:1,templates:Object.keys(templates).map(id=>({id,name:labels[id],variants:templates[id]}))};}
  function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(libraryData()));$('saveStatus').textContent='Saved in this browser';}catch{$('saveStatus').textContent='Not saved — download a backup';showToast('Browser storage unavailable or full. Back up your templates before closing.');}}
  try{const saved=localStorage.getItem(STORAGE_KEY);if(saved){const data=validateLibrary(JSON.parse(saved));templates=data.templates;Object.assign(labels,data.labels);}}catch{storageWarning='Saved templates could not be loaded. Stored data has not been changed. Restore a backup or edit to save a new library.';}
  function renderChoices(){const grid=document.querySelector('.choice-grid');grid.replaceChildren();for(const id of Object.keys(templates)){const button=document.createElement('button');button.type='button';button.className='choice'+(id===selectedTemplate?' selected':'');button.dataset.template=id;button.setAttribute('aria-pressed',String(id===selectedTemplate));button.textContent=labels[id];button.addEventListener('click',()=>setTemplate(id));grid.append(button);}}
  let people = DEMO.map(x => ({...x})), selectedTemplate=Object.keys(templates)[0], currentIndex=0, demo=true, fileLabel='sample_customers.csv';
  const $ = id => document.getElementById(id);
  const validLanguages = new Set(['en','es','ca']);
  const validGenres = new Set(['singular','plural']);
  const safeText = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const langLabel = language => ({en:'EN',es:'ES',ca:'CA'}[language] || language.toUpperCase());
  const normalized = r => ({customer_name:String(r.customer_name ?? '').trim(),customer_email:String(r.customer_email ?? '').trim(),language:String(r.language ?? '').trim().toLowerCase(),genre:String(r.genre ?? '').trim().toLowerCase()});
  const isValid = p => p.customer_name.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.customer_email) && validLanguages.has(p.language) && validGenres.has(p.genre);
  const validPeople = () => people.filter(isValid);
  const getVariant = () => templates[selectedTemplate][$('langSelect').value][$('genreSelect').value];
  const interpolate = (p) => (templates[selectedTemplate][p.language][p.genre] || '').replace(/{{\s*(customer_name|customer_email|language|genre)\s*}}/g,(_,key)=>p[key]);
  function showToast(message){$('toastText').textContent=message;$('toast').classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>$('toast').classList.remove('show'),4200);}
  function renderRows(){
    const sample = people;
    $('customerRows').innerHTML=sample.length ? sample.map(p => `<tr><td class="row-name" title="${safeText(p.customer_name)}">${safeText(p.customer_name || '—')}</td><td title="${safeText(p.customer_email)}">${safeText(p.customer_email || '—')}</td><td><span class="tag">${safeText(langLabel(p.language))}</span></td><td>${safeText(p.genre || '—')}</td></tr>`).join('') : '<tr><td colspan="4">No customer data</td></tr>';
    $('rowCount').textContent=`${people.length} ${demo?'demo ':''}row${people.length===1?'':'s'}`;
    $('fileName').textContent=fileLabel;
    $('fileMeta').textContent=`${people.length} customer row${people.length===1?'':'s'} · ${demo?'demo data':'imported CSV'}`;
    $('uploadResult').classList.toggle('show',people.length>0);
    const good=validPeople().length, bad=people.length-good;
    $('exportCount').innerHTML=`${good} <span style="font-size:12px;font-weight:600;color:#8390a4;letter-spacing:0">file${good===1?'':'s'}</span>`;
    $('exportDescription').textContent=bad ? `${good} valid · ${bad} invalid, skipped` : 'Ready for generation';
    $('saveFolder').disabled=!good;$('downloadZip').disabled=!good;
    $('csvWarning').classList.toggle('show',bad>0);
    $('csvWarning').textContent=bad ? `${bad} row${bad===1?' is':'s are'} invalid and will be skipped. Check that all four fields are filled, email addresses are valid, language is en/es/ca, and genre is singular/plural.` : '';
    if(currentIndex>=good)currentIndex=Math.max(0,good-1);
    renderPreview();
  }
  function renderPreview(){
    const valid=validPeople(), p=valid[currentIndex];
    $('prevPerson').disabled=currentIndex===0;$('nextPerson').disabled=currentIndex>=valid.length-1;
    if(!p){$('messagePreview').textContent='Upload a CSV with valid customers to preview the personalized message.';$('messagePreview').classList.add('empty');$('recipientName').textContent='No recipient selected';$('recipientEmail').textContent='';$('recipientAvatar').textContent='—';$('recipientLanguage').textContent='—';$('recipientGenre').textContent='—';$('previewPosition').textContent='No recipients';$('copyMessage').disabled=true;return;}
    $('messagePreview').textContent=interpolate(p);$('messagePreview').classList.remove('empty');
    $('recipientName').textContent=p.customer_name;$('recipientEmail').textContent=p.customer_email;$('recipientAvatar').textContent=p.customer_name.split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase();$('recipientLanguage').textContent=langLabel(p.language);$('recipientGenre').textContent=p.genre;$('previewPosition').textContent=`Recipient ${currentIndex+1} of ${valid.length}`;$('copyMessage').disabled=false;
    
  }
  function setTemplate(template){selectedTemplate=template;document.querySelectorAll('[data-template]').forEach(el=>{let active=el.dataset.template===template;el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active));});renderPreview();changeVariant();}
  function changeVariant(){ $('templateEditor').value=getVariant(); }
  function csvDelimiter(text){
    let sample='', quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'&&text[i+1]==='"'&&quoted){i++;continue;}if(c==='"')quoted=!quoted;if(!quoted&&(c==='\n'||c==='\r'))break;sample+=c;}
    const count=delimiter=>{let q=false,n=0;for(let i=0;i<sample.length;i++){const c=sample[i];if(c==='"'&&sample[i+1]==='"'&&q){i++;continue;}if(c==='"')q=!q;else if(c===delimiter&&!q)n++;}return n;};
    return [';',',','\t'].sort((a,b)=>count(b)-count(a))[0];
  }
  function parseCsv(source){
    let text=source.replace(/^\uFEFF/,'');const delimiter=csvDelimiter(text);let rows=[],row=[],value='',quoted=false,afterQuote=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){if(c==='"'){if(text[i+1]==='"'){value+='"';i++;}else{quoted=false;afterQuote=true;}}else value+=c;continue;}
      if(c==='"' && !afterQuote && value.trim()===''){quoted=true;continue;}
      if(c===delimiter){row.push(value.trim());value='';afterQuote=false;continue;}
      if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value.trim());if(row.some(s=>s!==''))rows.push(row);row=[];value='';afterQuote=false;continue;}
      if(afterQuote && c===' ')continue;
      value+=c;
    }
    if(quoted)throw new Error('This CSV contains an unclosed quoted field.');
    row.push(value.trim());if(row.some(s=>s!==''))rows.push(row);
    if(!rows.length)throw new Error('This CSV appears to be empty.');
    const header=rows.shift().map(v=>v.trim().replace(/^\uFEFF/,'').toLowerCase());
    const needed=['customer_email','customer_name','language','genre'];
    const missing=needed.filter(h=>!header.includes(h));
    if(missing.length)throw new Error('Missing required CSV columns: '+missing.join(', '));
    if(new Set(header).size!==header.length)throw new Error('CSV headers must be unique.');
    if(rows.some(row=>row.length!==header.length))throw new Error('A CSV row has a different number of columns than its header.');
    return rows.map(row=>normalized(Object.fromEntries(needed.map(key=>[key,row[header.indexOf(key)]||'']))));
  }
  async function loadFile(file){
    if(!file)return;
    if(!/\.csv$/i.test(file.name) && file.type!=='text/csv' && file.type!=='text/plain'){showToast('Please choose a CSV file.');return;}
    try{const text=await file.text();const newRows=parseCsv(text);people=newRows;demo=false;fileLabel=file.name;currentIndex=0;renderRows();showToast(`Imported ${people.length} customer row${people.length===1?'':'s'}.`);}catch(e){showToast('Import failed: '+(e.message||String(e)));}
    $('csvInput').value='';
  }
  const safeSegment = value => value.normalize('NFC').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').replace(/[. ]+$/g,'').slice(0,120) || 'customer';
  function exportFiles(){
    const used=new Map();
    return validPeople().map(p=>{const folder=safeSegment(p.customer_email), key=folder.toLowerCase();const count=(used.get(key)||0)+1;used.set(key,count);return {name:folder+'/'+selectedTemplate+(count>1?'_'+count:'')+'.txt',content:interpolate(p)};});
  }
  async function saveToFolder(){
    if(!window.showDirectoryPicker){showToast('Folder saving is not supported here. Please use Download ZIP.');return;}
    if(exportFiles().some(f=>!f.content.trim())){showToast('Fill in each required template variant before exporting.');return;}
    let handle;
    try {handle=await window.showDirectoryPicker({mode:'readwrite'});}catch(e){if(e.name!=='AbortError')showToast('Could not open folder: '+e.message);return;}
    const files=exportFiles();
    try{
      const batch='textflow-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomUUID().slice(0,8);
      handle=await handle.getDirectoryHandle(batch,{create:true});
      for(const file of files){const [folder,filename]=file.name.split('/');const customer=await handle.getDirectoryHandle(folder,{create:true});const item=await customer.getFileHandle(filename,{create:true});const stream=await item.createWritable();await stream.write(file.content);await stream.close();}
      showToast(`Saved ${files.length} text file${files.length===1?'':'s'} to the selected folder.`);
    }catch(e){showToast('Could not save all files: '+e.message);}
  }
  // A small, dependency-free ZIP writer, using ZIP's uncompressed "store" method.
  // This makes the prototype fully functional without internet access.
  const crcTable=(()=>{let a=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;a[n]=c>>>0;}return a;})();
  function crc32(data){let c=0xffffffff;for(const byte of data)c=crcTable[(c^byte)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
  function zipFiles(files){
    const enc=new TextEncoder(), blocks=[], central=[];let offset=0;
    const now=new Date(), dosTime=(now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1),dosDate=((Math.max(1980,now.getFullYear())-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate();
    function header(length){const buf=new Uint8Array(length);return {buf,view:new DataView(buf.buffer)};}
    for(const f of files){
      const name=enc.encode(f.name), data=enc.encode(f.content),crc=crc32(data);
      const l=header(30+name.length),v=l.view;v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x0800,true);v.setUint16(8,0,true);v.setUint16(10,dosTime,true);v.setUint16(12,dosDate,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);l.buf.set(name,30);blocks.push(l.buf,data);
      const c=header(46+name.length),w=c.view;w.setUint32(0,0x02014b50,true);w.setUint16(4,20,true);w.setUint16(6,20,true);w.setUint16(8,0x0800,true);w.setUint16(10,0,true);w.setUint16(12,dosTime,true);w.setUint16(14,dosDate,true);w.setUint32(16,crc,true);w.setUint32(20,data.length,true);w.setUint32(24,data.length,true);w.setUint16(28,name.length,true);w.setUint32(42,offset,true);c.buf.set(name,46);central.push(c.buf);offset+=l.buf.length+data.length;
    }
    let centralSize=central.reduce((n,b)=>n+b.length,0),end=header(22),v=end.view;v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);
    return new Blob([...blocks,...central,end.buf],{type:'application/zip'});
  }
  function downloadZip(){
    const files=exportFiles();if(!files.length)return;if(files.some(f=>!f.content.trim())){showToast('Fill in each required template variant before exporting.');return;}
    if(files.length>65535){showToast('Too many files for a standard ZIP archive.');return;}
    const blob=zipFiles(files),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='customer_messages.zip';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);showToast(`Generated ZIP containing ${files.length} personalized text files.`);
  }
  $('browseBtn').addEventListener('click',e=>{e.stopPropagation();$('csvInput').click()});
  $('dropzone').addEventListener('click',()=> $('csvInput').click());
  $('dropzone').addEventListener('keydown',e=>{if(e.target!==$('dropzone'))return;if(e.key==='Enter'||e.key===' '){e.preventDefault();$('csvInput').click();}});
  $('csvInput').addEventListener('change',e=>loadFile(e.target.files[0]));
  for(const evt of ['dragenter','dragover'])$('dropzone').addEventListener(evt,e=>{e.preventDefault();$('dropzone').classList.add('dragging')});
  for(const evt of ['dragleave','drop'])$('dropzone').addEventListener(evt,e=>{e.preventDefault();$('dropzone').classList.remove('dragging')});
  $('dropzone').addEventListener('drop',e=>loadFile(e.dataTransfer.files[0]));
  document.querySelectorAll('[data-template]').forEach(b=>b.addEventListener('click',()=>setTemplate(b.dataset.template)));
  $('langSelect').addEventListener('change',changeVariant);$('genreSelect').addEventListener('change',changeVariant);
  $('templateEditor').addEventListener('input',e=>{templates[selectedTemplate][$('langSelect').value][$('genreSelect').value]=e.target.value;persist();const p=validPeople()[currentIndex];if(p && p.language===$('langSelect').value && p.genre===$('genreSelect').value)$('messagePreview').textContent=interpolate(p);});
  $('resetTemplate').addEventListener('click',()=>{templates[selectedTemplate][$('langSelect').value][$('genreSelect').value]=original[selectedTemplate]?.[$('langSelect').value]?.[$('genreSelect').value] ?? 'Hello {{customer_name}},\n\n';persist();changeVariant();renderPreview();showToast('Template variant restored.');});
  $('prevPerson').addEventListener('click',()=>{if(currentIndex>0){currentIndex--;renderPreview();}});
  $('nextPerson').addEventListener('click',()=>{if(currentIndex<validPeople().length-1){currentIndex++;renderPreview();}});
  $('copyMessage').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('messagePreview').textContent);showToast('Message copied to clipboard.');}catch(e){showToast('Clipboard unavailable. Select and copy the preview manually.');}});
  $('saveFolder').addEventListener('click',saveToFolder);$('downloadZip').addEventListener('click',downloadZip);
  $('newTemplate').addEventListener('click',()=>{const name=prompt('Template name');if(!name?.trim())return;if(Object.keys(templates).length>=100){showToast('Maximum of 100 templates reached.');return;}const id='custom-'+crypto.randomUUID();templates[id]=structuredClone(original.update);labels[id]=name.trim().slice(0,100);selectedTemplate=id;persist();renderChoices();changeVariant();renderPreview();});
  $('backupTemplates').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(libraryData(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='textflow-templates.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);});
  $('restoreTemplates').addEventListener('click',()=>$('backupInput').click());
  $('backupInput').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>10000000)throw new Error('Backup is too large.');const data=validateLibrary(JSON.parse(await file.text()));if(!confirm('Replace the current template library with this backup?'))return;templates=data.templates;Object.assign(labels,data.labels);selectedTemplate=Object.keys(templates)[0];persist();renderChoices();changeVariant();renderPreview();showToast('Template backup restored.');}catch(error){showToast('Restore failed: '+error.message);}finally{e.target.value='';}});
  renderChoices();changeVariant();renderRows();
  if(storageWarning){$('saveStatus').textContent='Saved library unavailable';showToast(storageWarning);}
})();

  
