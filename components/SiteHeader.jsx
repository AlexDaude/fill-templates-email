
export default function SiteHeader({  }) {

  return (
  <header className="site-header">
    <div className="site-header-inner">
      <div className="brand">
        <div className="brandmark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14M5 12h10M5 17h7"/><path d="m16 16 2 2 3-4"/></svg>
        </div>
        <span>textflow.</span>
      </div>
      <div className="local-note"><span className="local-dot" aria-hidden="true"></span>Private, local processing</div>
    </div>
  </header>
  );
}
