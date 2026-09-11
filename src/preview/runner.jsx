import * as Babel from '@babel/standalone';
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as jsxRuntime from 'react/jsx-runtime';

const CHANNEL = 'simple-learning-preview';
const mount = document.getElementById('preview-root');
const root = createRoot(mount);

function send(type, detail = '') {
  parent.postMessage({ channel: CHANNEL, type, detail }, '*');
}

function message(error) {
  const text = error instanceof Error ? error.message : String(error);
  return text.replace(/^unknown:\s*/, '').slice(0, 800);
}

class PreviewBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { send('error', message(error)); }
  render() {
    return this.state.error
      ? <main className="preview-error"><strong>Preview error</strong><p>{message(this.state.error)}</p></main>
      : this.props.children;
  }
}

window.addEventListener('error', event => send('error', message(event.error || event.message)));
window.addEventListener('unhandledrejection', event => send('error', message(event.reason)));
window.addEventListener('message', event => {
  const payload = event.data;
  if (event.source !== parent || payload?.channel !== CHANNEL || payload.type !== 'run') return;
  if (typeof payload.code !== 'string' || payload.code.length > 50000) {
    send('error', 'The example is too large to run here.');
    return;
  }
  try {
    const output = Babel.transform(payload.code, {
      filename: 'App.jsx',
      presets: [['react', { runtime: 'automatic' }]],
      plugins: ['transform-modules-commonjs'],
      sourceType: 'module',
    }).code;
    const module = { exports: {} };
    const localRequire = id => {
      if (id === 'react') return React;
      if (id === 'react/jsx-runtime') return jsxRuntime;
      throw new Error(`This preview does not include the package “${id}”.`);
    };
    Function('require', 'module', 'exports', output)(localRequire, module, module.exports);
    const App = module.exports.default;
    if (typeof App !== 'function') throw new Error('Export a default React component to show a preview.');
    root.render(<PreviewBoundary key={payload.runId}><App /></PreviewBoundary>);
    send('rendered');
  } catch (error) {
    root.render(<main className="preview-error"><strong>Preview error</strong><p>{message(error)}</p></main>);
    send('error', message(error));
  }
});

send('ready');
