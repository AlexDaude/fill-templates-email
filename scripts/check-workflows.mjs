import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load the same dependency-free module Next.js bundles, without changing package type.
const source = await readFile(new URL('../lib/textflow-core.js', import.meta.url), 'utf8');
const { fillVariables, parseCsv, validateLibrary, original, labels, formattedMessage, zipFiles, safeSegment, isValid } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const rows = parseCsv('\ufeffcustomer_email;customer_name;language;genre\r\na@example.com;"Doe; Ana";ES;singular');
assert.equal(rows[0].customer_name, 'Doe; Ana');
assert.equal(rows[0].location, '');
assert.equal(parseCsv('customer_email,customer_name,language,genre,location\na@example.com,Ana,en,singular, Madrid ')[0].location, 'Madrid');
assert.equal(rows[0].language, 'es');
assert.ok(isValid(rows[0]));
assert.ok(!isValid({ ...rows[0], language: 'xx' }));
assert.equal(parseCsv('customer_email,customer_name,language,genre\na@example.com,"Ana\nDoe",en,plural')[0].customer_name, 'Ana\nDoe');
assert.throws(() => parseCsv('customer_name,customer_email,language,genre\n"unclosed'));
assert.throws(() => parseCsv('customer_name,customer_email,language,genre\nAna,a@example.com,en'));
assert.throws(() => parseCsv('customer_name,customer_email,language,language\nAna,a@example.com,en,en'));
const backup = { version: 1, templates: Object.keys(original).map(id => ({ id, name: labels[id], variants: original[id] })) };
assert.deepEqual(JSON.parse(JSON.stringify(validateLibrary(backup).templates)), original);
assert.throws(() => validateLibrary({version:1,templates:[{id:'__proto__',name:'bad'}]}));
assert.throws(() => validateLibrary({...backup,templates:[{...backup.templates[0],variants:{}}]}));
assert.match(formattedMessage('**Hello**\n[Visit](https://example.com)'), /<strong>Hello<\/strong><br><a href="https:\/\/example.com"/);
assert.ok(!formattedMessage('<img src=x onerror=alert(1)> [bad](javascript:alert)').includes('<img'));
assert.ok(!formattedMessage('[bad](javascript:alert)').includes('<a'));
assert.equal(safeSegment('../a/b'), '.._a_b');
const zip = zipFiles([{name:'ana@example.com/update.txt',content:'Hello Ana'}]);
const bytes = Buffer.from(await zip.arrayBuffer());
assert.equal(bytes.readUInt32LE(0), 0x04034b50);
assert.ok(bytes.includes(Buffer.from('ana@example.com/update.txt')));
assert.ok(bytes.includes(Buffer.from('Hello Ana')));
assert.equal(bytes.readUInt32LE(bytes.length-22), 0x06054b50);
console.log('Passed: CSV parsing and validation, backup compatibility, safe formatting, filenames, ZIP structure and content.');

const groupedZip = Buffer.from(await zipFiles([
    { name: 'sent/', content: '' },
    { name: 'no sent/', content: '' },
    { name: 'sent/ana@example.com/update.txt', content: 'Sent message' },
    { name: 'no sent/bob@example.com/update.txt', content: 'Pending message' },
]).arrayBuffer());
assert.equal(groupedZip.readUInt16LE(groupedZip.length - 12), 4);
for (const path of ['sent/', 'no sent/', 'sent/ana@example.com/update.txt', 'no sent/bob@example.com/update.txt']) {
    assert.ok(groupedZip.includes(Buffer.from(path)));
}
const firstDirectory = groupedZip.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
assert.equal(groupedZip.readUInt32LE(firstDirectory + 38), 0x10);
console.log('Passed: sent and no sent ZIP folders, grouped messages, directory attributes.');

const restoredLegacy = validateLibrary(backup);
assert.equal(restoredLegacy.subjects.update.en.singular, '');
const withSubject = structuredClone(backup);
withSubject.templates[0].subjects = { en: { singular: 'Hello {{customer_name}} in {{location}}' } };
const restoredSubject = validateLibrary(withSubject);
assert.equal(fillVariables(restoredSubject.subjects.update.en.singular, { customer_name: 'Ana', location: 'Madrid' }), 'Hello Ana in Madrid');
assert.equal(restoredSubject.subjects.update.es.plural, '');
const roundTrip = validateLibrary({ version: 1, templates: Object.keys(restoredSubject.templates).map(id => ({ id, name: restoredSubject.labels[id], variants: restoredSubject.templates[id], subjects: restoredSubject.subjects[id] })) });
assert.deepEqual(roundTrip, restoredSubject);
withSubject.templates[0].subjects.en.singular = 42;
assert.throws(() => validateLibrary(withSubject), /subject/);
console.log('Passed: legacy backups, subject variables, subject backup round trip, invalid subjects.');
