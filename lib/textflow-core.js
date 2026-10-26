const DEMO = [
    { customer_name: 'María García', customer_email: 'maria@example.com', language: 'es', genre: 'singular' },
    { customer_name: 'Equip Atlas', customer_email: 'hola@atlas.example', language: 'ca', genre: 'plural' },
    { customer_name: 'James Wilson', customer_email: 'james@example.com', language: 'en', genre: 'singular' },
    { customer_name: 'The Palmer Group', customer_email: 'team@palmer.example', language: 'en', genre: 'plural' },
];
const original = {
    update: {
        en: { singular: 'Hello {{customer_name}},\n\nWe wanted to share a quick update with you. We have been working on some improvements and look forward to sharing more details soon.\n\nIf you have any questions, please feel free to reply.\n\nBest regards,\nThe Team', plural: 'Hello {{customer_name}},\n\nWe wanted to share a quick update with your team. We have been working on some improvements and look forward to sharing more details soon.\n\nIf you have any questions, please feel free to reply.\n\nBest regards,\nThe Team' },
        es: { singular: 'Hola {{customer_name}},\n\nQueríamos compartir contigo una pequeña actualización. Estamos trabajando en algunas mejoras y pronto tendremos más novedades.\n\nSi tienes cualquier pregunta, no dudes en responder a este mensaje.\n\nUn saludo,\nEl equipo', plural: 'Hola {{customer_name}},\n\nQueríamos compartir con vosotros una pequeña actualización. Estamos trabajando en algunas mejoras y pronto tendremos más novedades.\n\nSi tenéis cualquier pregunta, no dudéis en responder a este mensaje.\n\nUn saludo,\nEl equipo' },
        ca: { singular: 'Hola {{customer_name}},\n\nVolíem compartir amb tu una petita actualització. Estem treballant en algunes millores i aviat tindrem més novetats.\n\nSi tens cap pregunta, no dubtis a respondre aquest missatge.\n\nSalutacions,\nL’equip', plural: 'Hola {{customer_name}},\n\nVolíem compartir amb vosaltres una petita actualització. Estem treballant en algunes millores i aviat tindrem més novetats.\n\nSi teniu cap pregunta, no dubteu a respondre aquest missatge.\n\nSalutacions,\nL’equip' }
    },
    invitation: {
        en: { singular: 'Hello {{customer_name}},\n\nYou are invited to our upcoming event! We would love to see you there.\n\nWe will share the schedule and further details shortly.\n\nHope to see you soon,\nThe Team', plural: 'Hello {{customer_name}},\n\nYour team is invited to our upcoming event! We would love to see you all there.\n\nWe will share the schedule and further details shortly.\n\nHope to see you soon,\nThe Team' },
        es: { singular: 'Hola {{customer_name}},\n\n¡Nos gustaría invitarte a nuestro próximo evento! Será un placer contar contigo.\n\nPronto compartiremos el programa y todos los detalles.\n\n¡Esperamos verte!\nEl equipo', plural: 'Hola {{customer_name}},\n\n¡Nos gustaría invitaros a nuestro próximo evento! Será un placer contar con vosotros.\n\nPronto compartiremos el programa y todos los detalles.\n\n¡Esperamos veros!\nEl equipo' },
        ca: { singular: 'Hola {{customer_name}},\n\nEns agradaria convidar-te al nostre proper esdeveniment! Ens farà molta il·lusió comptar amb tu.\n\nAviat compartirem el programa i tots els detalls.\n\nFins aviat,\nL’equip', plural: 'Hola {{customer_name}},\n\nEns agradaria convidar-vos al nostre proper esdeveniment! Ens farà molta il·lusió comptar amb vosaltres.\n\nAviat compartirem el programa i tots els detalls.\n\nFins aviat,\nL’equip' }
    },
    thankyou: {
        en: { singular: 'Hello {{customer_name}},\n\nThank you for your trust and continued support. It means a lot to us, and we are grateful to have you with us.\n\nWe look forward to staying in touch.\n\nWarm regards,\nThe Team', plural: 'Hello {{customer_name}},\n\nThank you all for your trust and continued support. It means a lot to us, and we are grateful to have your team with us.\n\nWe look forward to staying in touch.\n\nWarm regards,\nThe Team' },
        es: { singular: 'Hola {{customer_name}},\n\nGracias por tu confianza y apoyo. Para nosotros significa mucho contar contigo.\n\nEsperamos seguir en contacto.\n\nUn cordial saludo,\nEl equipo', plural: 'Hola {{customer_name}},\n\nGracias por vuestra confianza y apoyo. Para nosotros significa mucho contar con vosotros.\n\nEsperamos seguir en contacto.\n\nUn cordial saludo,\nEl equipo' },
        ca: { singular: 'Hola {{customer_name}},\n\nMoltes gràcies per la teva confiança i el teu suport. Per a nosaltres és molt important comptar amb tu.\n\nEsperem continuar en contacte.\n\nUna salutació cordial,\nL’equip', plural: 'Hola {{customer_name}},\n\nMoltes gràcies per la vostra confiança i el vostre suport. Per a nosaltres és molt important comptar amb vosaltres.\n\nEsperem continuar en contacte.\n\nUna salutació cordial,\nL’equip' }
    }
};
const STORAGE_KEY = 'textflow.templates.v1';
const labels = { update: 'General update', invitation: 'Invitation', thankyou: 'Thank you' };
function validateLibrary(data) {
    if (data?.version !== 1 || !Array.isArray(data.templates) || !data.templates.length || data.templates.length > 100)
        throw new Error('Invalid template backup.');
    const result = Object.create(null), names = Object.create(null);
    for (const entry of data.templates) {
        if (!/^[a-z0-9_-]{1,80}$/.test(entry.id) || ['__proto__', 'constructor', 'prototype'].includes(entry.id) || Object.hasOwn(result, entry.id) || typeof entry.name !== 'string' || !entry.name.trim())
            throw new Error('Invalid template name or identifier.');
        const variants = {};
        for (const lang of ['en', 'es', 'ca']) {
            variants[lang] = {};
            for (const form of ['singular', 'plural']) {
                const value = entry.variants?.[lang]?.[form];
                if (typeof value !== 'string' || value.length > 100000)
                    throw new Error('Backup must contain all six text variants.');
                variants[lang][form] = value;
            }
        }
        result[entry.id] = variants;
        names[entry.id] = entry.name.slice(0, 100);
    }
    return { templates: result, labels: names };
}
const validLanguages = new Set(['en', 'es', 'ca']);
const validGenres = new Set(['singular', 'plural']);
const safeText = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const normalized = r => ({ customer_name: String(r.customer_name ?? '').trim(), customer_email: String(r.customer_email ?? '').trim(), language: String(r.language ?? '').trim().toLowerCase(), genre: String(r.genre ?? '').trim().toLowerCase() });
const isValid = p => p.customer_name.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.customer_email) && validLanguages.has(p.language) && validGenres.has(p.genre);
function formattedMessage(text) {
    return safeText(text).replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => `<a href="${url}" style="color:#1155cc;text-decoration:underline" target="_blank" rel="noopener noreferrer">${label}</a>`).replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>').replace(/\r\n|\r|\n/g, '<br>');
}
const gmailHtml = text => `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#202124">${formattedMessage(text)}</div>`;
function csvDelimiter(text) {
    let sample = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"' && text[i + 1] === '"' && quoted) {
            i++;
            continue;
        }
        if (c === '"')
            quoted = !quoted;
        if (!quoted && (c === '\n' || c === '\r'))
            break;
        sample += c;
    }
    const count = delimiter => { let q = false, n = 0; for (let i = 0; i < sample.length; i++) {
        const c = sample[i];
        if (c === '"' && sample[i + 1] === '"' && q) {
            i++;
            continue;
        }
        if (c === '"')
            q = !q;
        else if (c === delimiter && !q)
            n++;
    } return n; };
    return [';', ',', '\t'].sort((a, b) => count(b) - count(a))[0];
}
function parseCsv(source) {
    let text = source.replace(/^\uFEFF/, '');
    const delimiter = csvDelimiter(text);
    let rows = [], row = [], value = '', quoted = false, afterQuote = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quoted) {
            if (c === '"') {
                if (text[i + 1] === '"') {
                    value += '"';
                    i++;
                }
                else {
                    quoted = false;
                    afterQuote = true;
                }
            }
            else
                value += c;
            continue;
        }
        if (c === '"' && !afterQuote && value.trim() === '') {
            quoted = true;
            continue;
        }
        if (c === delimiter) {
            row.push(value.trim());
            value = '';
            afterQuote = false;
            continue;
        }
        if (c === '\n' || c === '\r') {
            if (c === '\r' && text[i + 1] === '\n')
                i++;
            row.push(value.trim());
            if (row.some(s => s !== ''))
                rows.push(row);
            row = [];
            value = '';
            afterQuote = false;
            continue;
        }
        if (afterQuote && c === ' ')
            continue;
        value += c;
    }
    if (quoted)
        throw new Error('This CSV contains an unclosed quoted field.');
    row.push(value.trim());
    if (row.some(s => s !== ''))
        rows.push(row);
    if (!rows.length)
        throw new Error('This CSV appears to be empty.');
    const header = rows.shift().map(v => v.trim().replace(/^\uFEFF/, '').toLowerCase());
    const needed = ['customer_email', 'customer_name', 'language', 'genre'];
    const missing = needed.filter(h => !header.includes(h));
    if (missing.length)
        throw new Error('Missing required CSV columns: ' + missing.join(', '));
    if (new Set(header).size !== header.length)
        throw new Error('CSV headers must be unique.');
    if (rows.some(row => row.length !== header.length))
        throw new Error('A CSV row has a different number of columns than its header.');
    return rows.map(row => normalized(Object.fromEntries(needed.map(key => [key, row[header.indexOf(key)] || '']))));
}
const safeSegment = value => value.normalize('NFC').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[. ]+$/g, '').slice(0, 120) || 'customer';
const crcTable = (() => { let a = []; for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++)
        c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    a[n] = c >>> 0;
} return a; })();
function crc32(data) { let c = 0xffffffff; for (const byte of data)
    c = crcTable[(c ^ byte) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function zipFiles(files) {
    const enc = new TextEncoder(), blocks = [], central = [];
    let offset = 0;
    const now = new Date(), dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1), dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    function header(length) { const buf = new Uint8Array(length); return { buf, view: new DataView(buf.buffer) }; }
    for (const f of files) {
        const name = enc.encode(f.name), data = enc.encode(f.content), crc = crc32(data);
        const l = header(30 + name.length), v = l.view;
        v.setUint32(0, 0x04034b50, true);
        v.setUint16(4, 20, true);
        v.setUint16(6, 0x0800, true);
        v.setUint16(8, 0, true);
        v.setUint16(10, dosTime, true);
        v.setUint16(12, dosDate, true);
        v.setUint32(14, crc, true);
        v.setUint32(18, data.length, true);
        v.setUint32(22, data.length, true);
        v.setUint16(26, name.length, true);
        l.buf.set(name, 30);
        blocks.push(l.buf, data);
        const c = header(46 + name.length), w = c.view;
        w.setUint32(0, 0x02014b50, true);
        w.setUint16(4, 20, true);
        w.setUint16(6, 20, true);
        w.setUint16(8, 0x0800, true);
        w.setUint16(10, 0, true);
        w.setUint16(12, dosTime, true);
        w.setUint16(14, dosDate, true);
        w.setUint32(16, crc, true);
        w.setUint32(20, data.length, true);
        w.setUint32(24, data.length, true);
        w.setUint16(28, name.length, true);
        w.setUint32(38, f.name.endsWith("/") ? 0x10 : 0, true);
        w.setUint32(42, offset, true);
        c.buf.set(name, 46);
        central.push(c.buf);
        offset += l.buf.length + data.length;
    }
    let centralSize = central.reduce((n, b) => n + b.length, 0), end = header(22), v = end.view;
    v.setUint32(0, 0x06054b50, true);
    v.setUint16(8, files.length, true);
    v.setUint16(10, files.length, true);
    v.setUint32(12, centralSize, true);
    v.setUint32(16, offset, true);
    return new Blob([...blocks, ...central, end.buf], { type: 'application/zip' });
}
export { DEMO, original, STORAGE_KEY, labels, validateLibrary, isValid, formattedMessage, gmailHtml, parseCsv, safeSegment, zipFiles };
