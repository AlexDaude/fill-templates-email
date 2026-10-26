
export default function ExportSection({ count, invalid, exportHtml, setExportHtml, saveToFolder, downloadZip }) {

  return (
        <div className="export" aria-labelledby="export-title">
          <div className="export-head"><div><h3 id="export-title">Export messages</h3><p>sent/ or no sent/ - one folder per customer</p></div><div className="export-count" id="exportCount">{`${count} files`}</div></div>
          <div className="export-status" id="exportDescription">{invalid ? `${count} valid ? ${invalid} invalid, skipped` : "Ready for generation"}</div>
          <label className="html-export"><input type="checkbox" id="exportHtml" checked={exportHtml} onChange={e => setExportHtml(e.target.checked)}/> Export formatted HTML instead of TXT</label>
          <div className="actions">
            <button className="btn primary" id="saveFolder" disabled={!count} onClick={saveToFolder} type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M12 11v7m-3-3 3 3 3-3"/></svg>Save to folder</button>
            <button className="btn secondary" id="downloadZip" disabled={!count} onClick={downloadZip} type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13m-5-5 5 5 5-5M4 17v3h16v-3"/></svg>Download ZIP</button>
          </div>
          <p className="export-foot">Folder saving works in supported Chrome/Edge contexts. ZIP works across modern browsers. Files are generated locally.</p>
        </div>
  );
}
