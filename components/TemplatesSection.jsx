import { useRef } from "react";
export default function TemplatesSection({ library, ready, selectedTemplate, setSelectedTemplate, language, setLanguage, genre, setGenre, saveStatus, editSubject, editVariant, newTemplate, restore, onBackup, onReset }) {
  const backupInput = useRef(null);
  return (
        <section className="panel templates-panel" aria-labelledby="templates-title">
          <div className="panel-header">
            <div>
              <div className="panel-title"><span className="step-number">02</span><h2 id="templates-title">Message template</h2></div>
              <p className="desc">Choose a starting point, then make it your own.</p>
            </div>
          </div>
          <div className="library-tools"><button className="text-btn" id="newTemplate" disabled={!ready} onClick={newTemplate}>+ New template</button><button className="text-btn" id="backupTemplates" disabled={!ready} onClick={onBackup}>Back up templates</button><button className="text-btn" id="restoreTemplates" disabled={!ready} onClick={() => backupInput.current.click()}>Restore backup</button><input hidden type="file" id="backupInput" ref={backupInput} onChange={restore} accept=".json,application/json"/></div><div className="choice-grid" role="group" aria-label="Select template">{Object.keys(library.templates).map(id => <button key={id} type="button" className={"choice" + (id === selectedTemplate ? " selected" : "")} aria-pressed={id === selectedTemplate} onClick={() => setSelectedTemplate(id)}>{library.labels[id]}</button>)}</div>
          <div className="field-label">Edit variant <span>Language &amp; form</span></div>
          <div className="variant-row">
            <select id="langSelect" value={language} onChange={e => setLanguage(e.target.value)} className="select" aria-label="Template language"><option value="en">English</option><option value="es">Español</option><option value="ca">Català</option></select>
            <select id="genreSelect" value={genre} onChange={e => setGenre(e.target.value)} className="select" aria-label="Singular or plural form"><option value="singular">Singular</option><option value="plural">Plural</option></select>
          </div>
          <label className="field-label" htmlFor="subjectEditor">Subject <span>Supports the same variables as the message</span></label>
          <textarea className="subject-input" id="subjectEditor" rows={2} value={library.subjects?.[selectedTemplate]?.[language]?.[genre] ?? ""} onChange={e => editSubject(e.target.value)} disabled={!ready} placeholder="An update for {{customer_name}}" />
          <div className="field-label">Message text <span><span id="saveStatus" role="status">{saveStatus}</span></span></div>
          <textarea id="templateEditor" value={library.templates[selectedTemplate][language][genre]} onChange={e => editVariant(e.target.value)} disabled={!ready} spellCheck="true" aria-label="Template message text"></textarea>
          <p className="format-help">Formatting: <code>**bold text**</code> · <code>[link text](https://example.com)</code></p>
          <div className="editor-foot">
            <span>Variables: <code>{'{{customer_name}}'}</code> <code>{'{{customer_email}}'}</code> <code>{'{{location}}'}</code></span>
            <button type="button" className="text-btn" id="resetTemplate" disabled={!ready} onClick={onReset}>Reset variant</button>
          </div>
        </section>
  );
}
