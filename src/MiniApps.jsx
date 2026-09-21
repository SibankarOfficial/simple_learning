import { useState } from 'react';
import { href } from './content.js';
import useContent from './useContent.js';
import { Badge, Code, LoadState, Missing, Sources, TopicLinks } from './components.jsx';
import { useProgress } from './ProgressContext.jsx';
import { exerciseKey, updateExercise } from './progress.js';

// A built-in preview of the authored quantity-picker module. Learner code is
// never evaluated. Content validation keeps this demo's rules aligned with JSON.
function QuantityPicker() {
  const [quantity, setQuantity] = useState(1);
  return <section className="quantity-demo" aria-label="Quantity picker"><p className="eyebrow">TRY THE FINISHED FEATURE</p><h3>Notebook order</h3><p aria-live="polite">Quantity: {quantity}. Total: ₹{quantity * 120}</p><div className="actions"><button aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button><button aria-label="Increase quantity" disabled={quantity === 5} onClick={() => setQuantity(q => Math.min(5, q + 1))}>+</button><button onClick={() => setQuantity(1)}>Reset</button></div></section>;
}
function MiniCard({ path, subject, catalog, chapterId }) {
  const resource = useContent(`content/${subject.id}/${path}`);
  if (!resource.data) return <LoadState resource={resource} />;
  const app = resource.data;
  const chapter = catalog.chapters.find(c => c.id === chapterId);
  if (chapterId && !chapter?.miniAppIds.includes(app.id)) return null;
  return <section className="featured"><div><Badge status={app.status} /><h2>{app.title}</h2><p>{app.goal}</p><p className="muted">{app.steps.length} steps · {app.conceptTopicIds.length} linked concepts</p></div><a className="button primary" href={href(subject.id, 'mini-app', app.id)}>Build this app</a></section>;
}
export function MiniAppList({ subject, catalog, chapterId }) {
  return <><header className="page-heading"><p className="eyebrow">APPLY WHAT YOU LEARN</p><h1>Mini apps</h1><p>Build a small feature step by step. Then try a related idea without a tutorial.</p></header>{chapterId && <p>Showing apps linked to {catalog.chapters.find(c => c.id === chapterId)?.title}.</p>}{subject.miniAppPaths.map(path => <MiniCard key={path} path={path} subject={subject} catalog={catalog} chapterId={chapterId} />)}</>;
}
function MiniReader({ app, catalog, ideas, sources }) {
  const { change } = useProgress();
  const [showCode, setShowCode] = useState(false);
  const related = ideas.filter(idea => app.relatedIdeaIds.includes(idea.id));
  const completeFile = app.finalFile || (app.languageCode === 'html' ? 'index.html' : app.languageCode === 'js' ? 'index.js' : 'App.jsx');
  const reveal = () => {
    // The final module also solves these useState exercises. Record the same
    // assistance even when learners find the solution through the mini app.
    if (app.id === 'quantity-picker' && catalog.subject.id === 'react') change(p => ['p07', 'p10'].reduce((next, id) => updateExercise(next, exerciseKey('react', 'use-state', id), { solutionViewed: true }), p));
    setShowCode(true);
  };
  return <><a className="back-link" href={href(catalog.subject.id, 'mini-apps')}>← All mini apps</a><header className="page-heading"><Badge status={app.status} /><h1>{app.title}</h1><p>{app.goal}</p></header>
    {app.id === 'quantity-picker' && <QuantityPicker />}
    <section><h2>Concepts used</h2><TopicLinks ids={app.conceptTopicIds} catalog={catalog} /><details className="content-details"><summary>Prerequisites</summary><TopicLinks ids={app.prerequisiteTopicIds} catalog={catalog} /></details></section>
    <section><h2>What it needs to do</h2><ul>{app.requirements.map(r => <li key={r}>{r}</li>)}</ul></section>
    <div className="notice"><strong>Want an independent attempt?</strong><p>Try the requirements in a blank project before opening the steps. Following these steps is guided practice.</p></div>
    {app.steps.map(step => <details key={step.order} className="build-step"><summary><span className="step-number">{step.order}</span>{step.title}</summary><p>{step.task}</p>{step.code && <><Code>{step.code}</Code><p className="muted">This is a {step.kind} fragment for the file described in this step.</p></>}<p><strong>Why:</strong> {step.reason}</p><div className="hint"><strong>Check:</strong> {step.check}</div></details>)}
    <section className="final-code"><h2>Compare the complete app</h2><p>Try the steps first. Opening the finished code is guided help; rebuild it later without looking.</p><button onClick={reveal} disabled={showCode}>Show complete {completeFile}</button>{showCode && <Code>{app.finalCode}</Code>}</section>
    <section><h2>Check behavior</h2><div className="table-scroll"><table><thead><tr><th>Starting point</th><th>Action</th><th>Expected result</th></tr></thead><tbody>{app.acceptanceScenarios.map((scenario, i) => <tr key={i}><td>{scenario.given}</td><td>{scenario.when}</td><td>{scenario.then}</td></tr>)}</tbody></table></div></section>
    <section><h2>Build a related idea on your own</h2><p>Use the concepts you learned. These ideas intentionally have no supplied solution.</p>{related.map(idea => <article className="independent-idea" key={idea.id} id={`idea-${idea.id}`}><h3>{idea.title}</h3><p>{idea.brief}</p><ul>{idea.acceptanceCriteria.map(c => <li key={c}>{c}</li>)}</ul><TopicLinks ids={idea.conceptTopicIds} catalog={catalog} /></article>)}</section>
    <section><h2>Extend it when the base works</h2><ul>{app.extensions.map(e => <li key={e}>{e}</li>)}</ul></section><Sources ids={app.sourceIds} sources={sources} />
  </>;
}
export function MiniApp({ subject, catalog, id, sources }) {
  const path = subject.miniAppPaths.find(path => path.endsWith(`/${id}.json`));
  return path ? <MiniLoader path={path} subject={subject} catalog={catalog} sources={sources} /> : <Missing />;
}
function MiniLoader({ path, subject, catalog, sources }) {
  const resource = useContent(`content/${subject.id}/${path}`, app => {
    if (!app?.id || !['steps', 'conceptTopicIds', 'requirements', 'acceptanceScenarios', 'relatedIdeaIds'].every(k => Array.isArray(app[k])) || typeof app.finalCode !== 'string') throw new Error('This mini app has incomplete content.');
    return app;
  });
  const ideas = useContent(`content/${subject.id}/ideas.json`, data => { if (!Array.isArray(data)) throw new Error('The idea list is incomplete.'); return data; });
  if (!resource.data || !ideas.data) return <LoadState resource={!resource.data ? resource : ideas} />;
  return <MiniReader app={resource.data} catalog={catalog} ideas={ideas.data} sources={sources} />;
}
