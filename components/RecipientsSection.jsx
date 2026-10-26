import { useRef, useState } from "react";
export default function RecipientsSection({ people, invalid, fileLabel, demo, loadFile }) {
  const csvInput = useRef(null);
  const [dragging, setDragging] = useState(false);
  return (
        <section className="panel recipients-panel" aria-labelledby="upload-title">
          <div className="panel-header">
            <div>
              <div className="panel-title"><span className="step-number">01</span><h2 id="upload-title">Recipients</h2></div>
              <p className="desc">Add your customer list to get started.</p>
            </div>
          </div>
          <div className={"dropzone" + (dragging ? " dragging" : "")} id="dropzone" onClick={() => csvInput.current.click()} onKeyDown={e => { if (e.target === e.currentTarget && ["Enter", " "].includes(e.key)) {
        e.preventDefault();
        csvInput.current.click();
    } }} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }} role="button" tabIndex="0" aria-label="Choose or drop a CSV file">
            <div className="upload-copy">
              <span className="upload-icon" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m-5 5 5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg></span>
              <div><strong>Drop a CSV file here</strong><span>CSV format · UTF-8 · comma or semicolon</span></div>
            </div>
            <button className="browse-btn" type="button" id="browseBtn" onClick={e => { e.stopPropagation(); csvInput.current.click(); }}>Choose CSV</button>
          </div>
          <input type="file" accept=".csv,text/csv,text/plain" id="csvInput" ref={csvInput} onChange={e => { loadFile(e.target.files[0]); e.target.value = ""; }} hidden/>
          <div className={"upload-result" + (people.length ? " show" : "")} id="uploadResult">
            <div className="file-details">
              <svg className="file-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
              <div><span className="filename" id="fileName">{fileLabel}</span><small id="fileMeta">{`${people.length} customer rows ? ${demo ? "demo data" : "imported CSV"}`}</small></div>
            </div>
            <svg className="checkmark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m4 12 5 5L20 6"/></svg>
          </div>
          <details className="format-details">
            <summary>CSV format &amp; required columns</summary>
            <p><a href="/sample-customers.csv" download>Download an example CSV</a></p>
            <p>Headers: <code>customer_email</code>, <code>customer_name</code>, <code>language</code>, <code>genre</code>. Languages: <strong>en / es / ca</strong>. Genre: <strong>singular / plural</strong>. Comma and semicolon delimiters are supported.</p>
          </details>
          <div className="subsection">
            <div className="subsection-head"><strong>Customer list</strong><span className="count" id="rowCount">{`${people.length} ${demo ? "demo " : ""}rows`}</span></div>
            <div className="table-wrap">
              <table><thead><tr><th>Name</th><th>Email</th><th>Lang.</th><th>Genre</th></tr></thead><tbody id="customerRows">{people.map((p, i) => <tr key={i}><td className="row-name">{p.customer_name || "?"}</td><td>{p.customer_email || "?"}</td><td><span className="tag">{p.language.toUpperCase()}</span></td><td>{p.genre}</td></tr>)}</tbody></table>
            </div>
            <div className={"warning" + (invalid ? " show" : "")} id="csvWarning" role="alert">{invalid ? `${invalid} invalid rows will be skipped. Check required fields, email, language (en/es/ca), and genre (singular/plural).` : ""}</div>
          </div>
        </section>
  );
}
