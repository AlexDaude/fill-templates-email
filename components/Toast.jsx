
export default function Toast({ toast }) {

  return (
  <div className={"toast" + (toast ? " show" : "")} id="toast" role="status" aria-live="polite"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6"/></svg><span id="toastText">{toast}</span></div>
  );
}
