import { useEffect, useRef, useState } from 'react';
import { href, statusLabel } from './content.js';

export function Badge({ status }) { return <span className={`badge ${status}`}>{statusLabel(status)}</span>; }
export function TopicLinks({ ids = [], catalog }) {
  return <ul className="link-list">{ids.map(id => {
    const topic = catalog.topics.find(t => t.id === id);
    return <li key={id}>{topic ? <><a href={href(catalog.subject.id, 'topic', id)}>{topic.title}</a> <Badge status={topic.contentStatus} /></> : id}</li>;
  })}</ul>;
}
export function Sources({ ids = [], sources = [] }) {
  return <p className="sources">Sources: {[...new Set(ids)].map((id, i) => {
    const source = sources.find(s => s.id === id);
    return source ? <span key={id}>{i > 0 ? ' · ' : ''}<a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></span> : null;
  })}</p>;
}
export function Code({ children, language = 'JavaScript / JSX' }) {
  const [copied, setCopied] = useState('');
  return <div className="code-block"><div className="code-label"><span>{language}</span><button onClick={async () => {
    try { await navigator.clipboard.writeText(children); setCopied('Copied'); }
    catch { setCopied('Select the code to copy it'); }
  }}>Copy code</button><span role="status">{copied}</span></div><pre tabIndex="0"><code>{children}</code></pre></div>;
}
export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; if (trigger?.isConnected) trigger.focus(); };
  }, []);
  return <dialog ref={ref} className="solution-modal" aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="modal-inner"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button autoFocus onClick={onClose} aria-label="Close solution">Close</button></div>{children}</div>
  </dialog>;
}
export function LoadState({ resource }) {
  return resource.error ? <div className="notice" role="alert"><h2>Could not open this content</h2><p>{resource.error}</p><button onClick={resource.retry}>Try again</button></div>
    : <p className="loading" role="status">Loading content…</p>;
}
export function Missing() { return <div className="notice"><h1>Page not found</h1><p>This page is not part of the current learning plan.</p><a href="#/subjects">Choose a subject</a></div>; }
