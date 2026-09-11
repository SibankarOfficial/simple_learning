import { useEffect, useMemo, useRef, useState } from 'react';

const CHANNEL = 'simple-learning-preview';
const previewPages = new Map();

function previewPage(runtimeUrl) {
  if (!previewPages.has(runtimeUrl)) {
    previewPages.set(runtimeUrl, fetch(runtimeUrl).then(async response => {
      if (!response.ok) throw new Error('The preview runtime could not load.');
      const runtime = await response.text();
      const before = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data:; connect-src 'none';"><style>body{margin:0;padding:18px;font:16px/1.5 system-ui,sans-serif;color:#172b47;background:#fff}button,input,textarea{font:inherit}button{padding:.5rem .75rem;margin:.2rem;border:1px solid #aebed1;border-radius:5px;background:#fff;color:#172b47}button:disabled{opacity:.5}input,textarea{max-width:100%;padding:.45rem;border:1px solid #aebed1;border-radius:4px}label{display:block;margin:.5rem 0}section{max-width:100%}.preview-error{padding:12px;border-left:3px solid #bb3f3f;background:#fff2f2;color:#762828}.preview-error p{white-space:pre-wrap;overflow-wrap:anywhere}</style></head><body><div id="preview-root"></div><script>`;
      return `${before}${runtime}</script></body></html>`;
    }));
  }
  return previewPages.get(runtimeUrl);
}

export default function CodePlayground({ initialCode, title }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [prediction, setPrediction] = useState('');
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState('Open the preview when you are ready to experiment.');
  const [previewSrc, setPreviewSrc] = useState('');
  const iframe = useRef(null);
  const snapshot = useRef(initialCode);
  const runtimeUrl = useMemo(() => new URL(`${import.meta.env.BASE_URL}preview-runtime.js`, window.location.href).href, []);

  useEffect(() => {
    let active = true;
    previewPage(runtimeUrl).then(url => { if (active) setPreviewSrc(url); }).catch(error => {
      if (active) setStatus(`Could not run: ${error.message}`);
    });
    return () => { active = false; };
  }, [runtimeUrl]);

  useEffect(() => {
    const receive = event => {
      if (event.source !== iframe.current?.contentWindow || event.data?.channel !== CHANNEL) return;
      if (event.data.type === 'ready') {
        iframe.current.contentWindow.postMessage({ channel: CHANNEL, type: 'run', code: snapshot.current, runId: run }, '*');
      } else if (event.data.type === 'rendered') setStatus('Preview updated. Compare it with your prediction.');
      else if (event.data.type === 'error') setStatus(`Could not run: ${event.data.detail}`);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [run]);

  function runCode(nextCode = code) {
    snapshot.current = nextCode;
    setStatus('Running your code…');
    setRun(value => value + 1);
  }

  function sendCurrentCode() {
    iframe.current?.contentWindow?.postMessage({ channel: CHANNEL, type: 'run', code: snapshot.current, runId: run }, '*');
  }

  if (!open) return <div className="playground-launch"><button onClick={() => { setOpen(true); runCode(); }}>Open live preview</button><p>Change this example and see the result. It runs in an isolated frame with no network or app data access.</p></div>;
  return <section className="playground" aria-label={`Live preview: ${title}`}>
    <div className="playground-heading"><div><strong>Try this example</strong><span>React + JSX</span></div><div className="actions"><button className="primary" onClick={() => runCode()}>Run</button><button onClick={() => { setCode(initialCode); setPrediction(''); runCode(initialCode); }}>Reset</button><button onClick={() => setOpen(false)}>Close preview</button></div></div>
    <label htmlFor={`prediction-${title}`}>Before you run a change, predict what you will see</label>
    <input id={`prediction-${title}`} value={prediction} onChange={event => setPrediction(event.target.value)} placeholder="Write a short prediction for yourself" />
    <div className="playground-grid"><div><label htmlFor={`editor-${title}`}>Editable App.jsx</label><textarea className="code-editor" id={`editor-${title}`} spellCheck="false" value={code} onChange={event => setCode(event.target.value)} /></div><div><span className="frame-label">Preview</span>{previewSrc ? <iframe key={run} ref={iframe} title={`${title} preview`} sandbox="allow-scripts" srcDoc={previewSrc} onLoad={sendCurrentCode} /> : <p className="preview-loading">Loading the preview tools…</p>}</div></div>
    <p className="playground-status" role="status">{status}</p><p className="muted">This preview supports React imports used by the lesson. It does not install extra packages, run backend code, grade your work, or save editor changes.</p>
  </section>;
}
