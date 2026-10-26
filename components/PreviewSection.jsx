import { formattedMessage } from "@/lib/textflow-core";
export default function PreviewSection({ person, currentIndex, setCurrentIndex, count, message, previewRef, copy, sent, toggleSent, children }) {

  return (
      <section className="panel right-panel" aria-labelledby="preview-title">
        <div className="panel-header">
          <div><div className="panel-title"><span className="step-number">03</span><h2 id="preview-title">Message preview</h2></div><p className="desc">Your text, as each recipient will see it.</p></div>
          <div className="preview-controls">
            <button className="icon-btn" id="prevPerson" disabled={!person || currentIndex === 0} onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} type="button" title="Previous customer" aria-label="Previous customer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg></button>
            <button className="icon-btn" id="nextPerson" disabled={!person || currentIndex >= count - 1} onClick={() => setCurrentIndex(Math.min(count - 1, currentIndex + 1))} type="button" title="Next customer" aria-label="Next customer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>
        </div>
        <div className={"recipient" + (sent ? " is-sent" : "")}>
          <div className="recipient-avatar" id="recipientAvatar">{person ? person.customer_name.split(/\s+/).slice(0, 2).map(s => s[0]).join("").toUpperCase() : "?"}</div>
          <div className="recipient-details"><strong id="recipientName">{person?.customer_name ?? "No recipient selected"}</strong><span id="recipientEmail">{person?.customer_email}</span></div>
          <div className="recipient-meta"><span className="tag" id="recipientLanguage">{person?.language.toUpperCase()}</span><span className="tag" id="recipientGenre">{person?.genre}</span></div>
        </div>
        <div className={"paper" + (sent ? " is-sent" : "")}><div className="paper-content" id="messagePreview" ref={previewRef} dangerouslySetInnerHTML={{ __html: person ? formattedMessage(message) : "Upload a CSV with valid customers to preview the personalized message." }}/></div>
        <div className="sent-controls">
          <span className={sent ? "sent-label" : ""} role="status">{person ? (sent ? "Sent" : "Not sent") : "No recipient selected"}</span>
          <button className="browse-btn" type="button" disabled={!person} aria-pressed={sent} onClick={toggleSent}>{sent ? "Mark as not sent" : "Mark as sent"}</button>
        </div>
        <p className="desc">Flags apply to this template and list until you reload or import a CSV.</p>
        <div className="preview-bottom"><span id="previewPosition">{person ? `Recipient ${currentIndex + 1} of ${count}` : "No recipients"}</span><div className="copy-actions"><button className="text-btn" type="button" id="copyMessage" disabled={!person} onClick={() => copy(false)}>Copy text</button><button className="browse-btn" type="button" id="copyGmail" disabled={!person} onClick={() => copy(true)}>Copy for Gmail</button></div></div>
        {children}
      </section>
  );
}
