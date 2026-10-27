"use client";
import { useEffect, useRef, useState } from "react";
import { fillVariables, formattedMessage, DEMO, original, STORAGE_KEY, labels, validateLibrary, isValid, gmailHtml, parseCsv, safeSegment, zipFiles } from "@/lib/textflow-core";
import SiteHeader from "./SiteHeader";
import PageIntro from "./PageIntro";
import SiteFooter from "./SiteFooter";
import Toast from "./Toast";
import RecipientsSection from "./RecipientsSection";
import TemplatesSection from "./TemplatesSection";
import PreviewSection from "./PreviewSection";
import ExportSection from "./ExportSection";

export default function Textflow() {
    const [library, setLibrary] = useState({ templates: original, labels });
    const [ready, setReady] = useState(false);
    const [saveStatus, setSaveStatus] = useState("Loading saved templates...");
    const [people, setPeople] = useState(DEMO);
    const [selectedTemplate, setSelectedTemplate] = useState("update");
    const [language, setLanguage] = useState("en"), [genre, setGenre] = useState("singular");
    const [currentIndex, setCurrentIndex] = useState(0), [demo, setDemo] = useState(true);
    const [fileLabel, setFileLabel] = useState("sample_customers.csv"), [exportHtml, setExportHtml] = useState(true);
    const [sentMessages, setSentMessages] = useState({});
    const [toast, setToast] = useState("");
    const preview = useRef(null), toastTimer = useRef(null);
    function showToast(message) { setToast(message); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(""), 4200); }
    useEffect(() => {
        const hydrationTimer = setTimeout(() => {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const data = validateLibrary(JSON.parse(saved));
                    setLibrary(data);
                    setSelectedTemplate(Object.keys(data.templates)[0]);
                }
                setSaveStatus("Saved in this browser");
            }
            catch {
                setSaveStatus("Saved library unavailable");
            }
            setReady(true);
        }, 0);
        return () => { clearTimeout(hydrationTimer); clearTimeout(toastTimer.current); };
    }, []);
    function libraryData(data = library) { return { version: 1, templates: Object.keys(data.templates).map(id => ({ id, name: data.labels[id], variants: data.templates[id], subjects: data.subjects?.[id] })) }; }
    function persist(data) {
        setLibrary(data);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(libraryData(data)));
            setSaveStatus("Saved in this browser");
        }
        catch {
            setSaveStatus("Not saved ? download a backup");
            showToast("Browser storage unavailable or full. Back up your templates before closing.");
        }
    }
    function editVariant(value) { const next = structuredClone(library); next.templates[selectedTemplate][language][genre] = value; persist(next); }
    function editSubject(value) {
        const next = structuredClone(library);
        next.subjects ??= {};
        next.subjects[selectedTemplate] ??= {};
        next.subjects[selectedTemplate][language] ??= {};
        next.subjects[selectedTemplate][language][genre] = value;
        persist(next);
    }
    const valid = people.filter(isValid), invalid = people.length - valid.length, person = valid[currentIndex];
    const interpolate = p => fillVariables(library.templates[selectedTemplate][p.language][p.genre] || "", p);
    const subjectFor = p => fillVariables(library.subjects?.[selectedTemplate]?.[p.language]?.[p.genre] || "", p).replace(/[\r\n]+/g, " ");
    const isSent = p => Boolean(sentMessages[selectedTemplate]?.includes(people.indexOf(p)));
    function toggleSent() {
        if (!person) return;
        const index = people.indexOf(person);
        setSentMessages(previous => {
            const sent = previous[selectedTemplate] || [];
            return { ...previous, [selectedTemplate]: sent.includes(index) ? sent.filter(i => i !== index) : [...sent, index] };
        });
    }
    const message = person ? interpolate(person) : "";
    async function loadFile(file) {
        if (!file)
            return;
        if (!/\.csv$/i.test(file.name) && !["text/csv", "text/plain"].includes(file.type)) {
            showToast("Please choose a CSV file.");
            return;
        }
        try {
            const rows = parseCsv(await file.text());
            setPeople(rows);
            setSentMessages({});
            setDemo(false);
            setFileLabel(file.name);
            setCurrentIndex(0);
            showToast(`Imported ${rows.length} customer rows.`);
        }
        catch (error) {
            showToast("Import failed: " + error.message);
        }
    }
    function newTemplate() { const name = window.prompt("Template name"); if (!name?.trim())
        return; if (Object.keys(library.templates).length >= 100) {
        showToast("Maximum of 100 templates reached.");
        return;
    } const id = "custom-" + crypto.randomUUID(); persist({ ...library, templates: { ...library.templates, [id]: structuredClone(original.update) }, labels: { ...library.labels, [id]: name.trim().slice(0, 100) } }); setSelectedTemplate(id); }
    async function restore(event) {
        const file = event.target.files[0];
        event.target.value = "";
        if (!file)
            return;
        try {
            if (file.size > 10000000)
                throw new Error("Backup is too large.");
            const data = validateLibrary(JSON.parse(await file.text()));
            if (!window.confirm("Replace the current template library with this backup?"))
                return;
            persist(data);
            setSelectedTemplate(Object.keys(data.templates)[0]);
            showToast("Template backup restored.");
        }
        catch (error) {
            showToast("Restore failed: " + error.message);
        }
    }
    function exportFiles() { const used = new Map(); return valid.map(p => { const folder = safeSegment(p.customer_email), key = folder.toLowerCase(), count = (used.get(key) || 0) + 1; used.set(key, count); const text = interpolate(p), subject = subjectFor(p); return { name: (isSent(p) ? "sent/" : "no sent/") + folder + "/" + selectedTemplate + (count > 1 ? "_" + count : "") + (exportHtml ? ".html" : ".txt"), content: exportHtml ? '<!doctype html><html><head><meta charset="utf-8"><title>Customer message</title></head><body>' + (subject ? "<p><strong>Subject:</strong> " + formattedMessage(subject) + "</p>" : "") + gmailHtml(text) + "</body></html>" : (subject ? "Subject: " + subject + "\n\n" : "") + text }; }); }
    function download(blob, name) { const url = URL.createObjectURL(blob), a = document.createElement("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000); }
    function canExport() { if (!valid.length)
        return false; if (valid.some(p => !interpolate(p).trim())) {
        showToast("Fill in each required template variant before exporting.");
        return false;
    } return true; }
    function downloadZip() { if (!canExport())
        return; const files = exportFiles(); if (files.length + 2 > 65535) {
        showToast("Too many files for a standard ZIP archive.");
        return;
    } download(zipFiles([{ name: "sent/", content: "" }, { name: "no sent/", content: "" }, ...files]), "customer_messages.zip"); showToast(`Generated ZIP containing ${files.length} personalized messages.`); }
    async function saveToFolder() {
        if (!window.showDirectoryPicker) {
            showToast("Folder saving is not supported here. Please use Download ZIP.");
            return;
        }
        if (!canExport())
            return;
        try {
            let handle = await window.showDirectoryPicker({ mode: "readwrite" });
            const files = exportFiles();
            handle = await handle.getDirectoryHandle("textflow-" + new Date().toISOString().replace(/[:.]/g, "-") + "-" + crypto.randomUUID().slice(0, 8), { create: true });
            await handle.getDirectoryHandle("sent", { create: true });
            await handle.getDirectoryHandle("no sent", { create: true });
            for (const file of files) {
                const [status, folder, name] = file.name.split("/"), group = await handle.getDirectoryHandle(status, { create: true }), customer = await group.getDirectoryHandle(folder, { create: true }), item = await customer.getFileHandle(name, { create: true }), stream = await item.createWritable();
                await stream.write(file.content);
                await stream.close();
            }
            showToast(`Saved ${files.length} messages to the selected folder.`);
        }
        catch (error) {
            if (error.name !== "AbortError")
                showToast("Could not save all files: " + error.message);
        }
    }
    async function copyField(value, label) {
        try {
            await navigator.clipboard.writeText(value);
            showToast(label + " copied to clipboard.");
        } catch {
            showToast("Clipboard unavailable. Select and copy the " + label.toLowerCase() + " manually.");
        }
    }
    async function copy(formatted) {
        if (!person)
            return;
        try {
            const plain = preview.current.innerText;
            if (formatted) {
                await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([gmailHtml(message)], { type: "text/html" }), "text/plain": new Blob([plain], { type: "text/plain" }) })]);
            }
            else
                await navigator.clipboard.writeText(plain);
            showToast(formatted ? "Copied with formatting. Paste into Gmail with plain text mode turned off." : "Message copied to clipboard.");
        }
        catch {
            showToast("Clipboard unavailable. Select and copy the preview manually.");
        }
    }
    return (
      <>
        <SiteHeader />
        <main>
          <PageIntro />
          <div className="columns">
            <div className="left-stack">
              <RecipientsSection isSent={isSent} people={people} invalid={invalid} fileLabel={fileLabel} demo={demo} loadFile={loadFile} />
              <TemplatesSection
                library={library} ready={ready} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
                language={language} setLanguage={setLanguage} genre={genre} setGenre={setGenre}
                saveStatus={saveStatus} editSubject={editSubject} editVariant={editVariant} newTemplate={newTemplate} restore={restore}
                onBackup={() => download(new Blob([JSON.stringify(libraryData(), null, 2)], { type: "application/json" }), "textflow-templates.json")}
                onReset={() => editVariant(original[selectedTemplate]?.[language]?.[genre] ?? "Hello {{customer_name}},\n\n")}
              />
            </div>
            <PreviewSection subject={person ? subjectFor(person) : ""} copyField={copyField} sent={person ? isSent(person) : false} toggleSent={toggleSent} person={person} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} count={valid.length} message={message} previewRef={preview} copy={copy}>
              <ExportSection count={valid.length} invalid={invalid} exportHtml={exportHtml} setExportHtml={setExportHtml} saveToFolder={saveToFolder} downloadZip={downloadZip} />
            </PreviewSection>
          </div>
          <SiteFooter />
        </main>
        <Toast toast={toast} />
      </>
    );
}
