import { useEffect } from 'react';
import { Code, LoadState, Missing } from './components.jsx';
import { href } from './content.js';
import useContent from './useContent.js';

function validatePractice(data) {
  if (!data?.intro || !Array.isArray(data.concepts) || !Array.isArray(data.problems) || data.problems.length !== 20
    || !data.problems.every(problem => problem.id && problem.prompt && problem.basic?.code && problem.advanced?.code && problem.conceptIds?.length)) {
    throw new Error('The DSA practice set is incomplete.');
  }
  return data;
}

function DsaSidebar({ view }) {
  return <aside className="sidebar dsa-sidebar">
    <a className="subject-name" href={href('dsa')}>DSA Practice<span>120-minute interview sprint</span></a>
    <nav aria-label="DSA practice">
      <a aria-current={view === 'overview' ? 'page' : undefined} href={href('dsa')}>All problems</a>
      <a aria-current={view === 'intro' ? 'page' : undefined} href={href('dsa', 'intro')}>Intro</a>
      <a aria-current={view === 'concepts' ? 'page' : undefined} href={href('dsa', 'concepts')}>Concept reference</a>
    </nav>
    <div className="sidebar-note"><strong>Try before you reveal.</strong><p>Reading a solution does not mean you can solve the problem.</p></div>
  </aside>;
}

function Overview({ data }) {
  const easy = data.problems.filter(problem => problem.difficulty === 'Easy').length;
  return <>
    <header className="page-heading"><p className="eyebrow">MONDAY INTERVIEW SPRINT</p><h1>{data.title}</h1><p>{data.description}</p></header>
    <div className="stats"><span><strong>{data.sprintMinutes}</strong> minutes</span><span><strong>{data.problems.length}</strong> problems</span><span><strong>{easy}</strong> easy · <strong>{data.problems.length - easy}</strong> medium</span></div>
    <section className="featured"><div><p className="eyebrow">START HERE · 10 MINUTES</p><h2>{data.intro.title}</h2><p>Learn the few terms, patterns, and interview steps used in this practice set.</p></div><a className="button primary" href={href('dsa', 'intro')}>Open intro</a></section>
    <div className="notice sprint-note"><h2>Use the sprint honestly</h2><p>Read the prompt, explain a simple approach, and try code before opening either solution. Stop after the suggested time and return later to problems you could not solve.</p></div>
    <div className="notice sprint-note"><h2>Need a concept?</h2><p>Every problem links to one shared explanation for its Maps, Sets, loops, pointers, windows, stacks, queues, and tree traversals.</p><a href={href('dsa', 'concepts')}>Open the concept reference</a></div>
    <div className="section-heading"><h2>20 practice problems</h2><span className="muted">Follow the order for a quick pattern review</span></div>
    <ol className="dsa-problem-list">{data.problems.map(problem => <li key={problem.id}><a href={href('dsa', 'problem', problem.id)}><span className="question-number">{String(problem.order).padStart(2, '0')}</span><span><strong>{problem.title}</strong><small>{problem.category} · {problem.pattern}</small></span><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><span className="problem-time">{problem.estimatedMinutes} min</span></a></li>)}</ol>
    <p className="sources">Method reference: <a href={data.methodReference.url} target="_blank" rel="noreferrer">{data.methodReference.title}</a>. {data.methodReference.usedFor}</p>
  </>;
}

function ConceptLibrary({ data, selectedId }) {
  useEffect(() => {
    if (!selectedId) return;
    document.getElementById(`concept-${selectedId}`)?.scrollIntoView({ block: 'start' });
  }, [selectedId]);
  if (selectedId && !data.concepts.some(concept => concept.id === selectedId)) return <Missing />;
  return <>
    <a className="back-link" href={href('dsa')}>← All DSA problems</a>
    <header className="page-heading"><p className="eyebrow">SHARED DSA REFERENCE</p><h1>Concepts used</h1><p>All core explanations live here. Problem pages link to the exact concept they use.</p></header>
    <nav className="concept-index" aria-label="Concept index">{data.concepts.map(concept => <a key={concept.id} href={href('dsa', 'concepts', concept.id)}>{concept.title}</a>)}</nav>
    <div className="lesson-body concept-library">{data.concepts.map(concept => {
      const usedBy = data.problems.filter(problem => problem.conceptIds.includes(concept.id));
      return <section id={`concept-${concept.id}`} className={`concept-reference ${selectedId === concept.id ? 'selected' : ''}`} key={concept.id}><p className="eyebrow">USED BY {usedBy.length} PROBLEM{usedBy.length === 1 ? '' : 'S'}</p><h2>{concept.title}</h2><p>{concept.summary}</p><h3>How it works</h3><ol>{concept.howItWorks.map(step => <li key={step}>{step}</li>)}</ol><div className="complexity-note"><strong>Typical cost</strong><p>{concept.complexity}</p></div><Code language="JavaScript">{concept.example}</Code><h3>Common mistakes</h3><ul>{concept.pitfalls.map(item => <li key={item}>{item}</li>)}</ul><p className="concept-problems"><strong>Practice it in:</strong> {usedBy.map((problem, index) => <span key={problem.id}>{index ? ' · ' : ' '}<a href={href('dsa', 'problem', problem.id)}>{problem.title}</a></span>)}</p></section>;
    })}</div>
  </>;
}

function Intro({ data }) {
  const intro = data.intro;
  return <>
    <a className="back-link" href={href('dsa')}>← All DSA problems</a>
    <header className="page-heading"><p className="eyebrow">{intro.estimatedMinutes}-MINUTE FOUNDATION</p><h1>{intro.title}</h1><p>{intro.purpose}</p></header>
    <section className="lesson-body"><h2>The learning loop</h2><ol>{intro.learningLoop.map(step => <li key={step}>{step}</li>)}</ol>
      <h2>Terms you need</h2>{intro.terms.map(term => <article className="dsa-term" key={term.name}><h3>{term.name}</h3><p>{term.meaning}</p></article>)}
      <h2>Pattern signals</h2><div className="table-scroll"><table><thead><tr><th>When the prompt says or implies</th><th>Try this pattern</th></tr></thead><tbody>{intro.patternSignals.map(item => <tr key={item.signal}><td>{item.signal}</td><td>{item.try}</td></tr>)}</tbody></table></div>
      <h2>What to say in the interview</h2><ol>{intro.interviewScript.map(step => <li key={step}>{step}</li>)}</ol>
      <h2>Your two-hour plan</h2><ol>{intro.sprintPlan.map(step => <li key={step}>{step}</li>)}</ol>
      <a className="button primary" href={href('dsa', 'problem', data.problems[0].id)}>Start problem 1</a>
    </section>
  </>;
}

function Approach({ label, approach }) {
  return <details className="dsa-solution"><summary>{label}: {approach.name} <span>{approach.time} time · {approach.space} space</span></summary><div><p>{approach.idea}</p><ol>{approach.steps.map(step => <li key={step}>{step}</li>)}</ol><div className="complexity-grid"><div><span>Time complexity</span><strong>{approach.time}</strong></div><div><span>Space complexity</span><strong>{approach.space}</strong></div></div><Code language="JavaScript">{approach.code}</Code></div></details>;
}

function Problem({ data, id }) {
  const problem = data.problems.find(item => item.id === id);
  if (!problem) return <Missing />;
  const previous = data.problems[problem.order - 2];
  const next = data.problems[problem.order];
  return <>
    <a className="back-link" href={href('dsa')}>← All DSA problems</a>
    <header className="page-heading dsa-heading"><p className="eyebrow">PROBLEM {problem.order} OF {data.problems.length} · {problem.estimatedMinutes} MINUTES</p><h1>{problem.title}</h1><div className="problem-meta"><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><span>{problem.category}</span><span>{problem.pattern}</span></div></header>
    <section className="lesson-body dsa-problem">
      <div className="notice problem-prompt"><h2>What the question asks</h2><p>{problem.prompt}</p><h3>Examples</h3><ul>{problem.examples.map(example => <li key={example}><code>{example}</code></li>)}</ul><a href={problem.reference.url} target="_blank" rel="noreferrer">Open LeetCode problem {problem.reference.problemNumber}</a></div>
      <section className="concept-section"><h2>Concepts used</h2><div className="concept-links">{problem.conceptIds.map(id => { const concept = data.concepts.find(item => item.id === id); return <a className="button" key={id} href={href('dsa', 'concepts', id)}>{concept?.title || id}</a>; })}</div><p className="muted">Each link opens the shared reference at the exact explanation.</p></section>
      <section className="concept-section"><h2>How to think about it</h2><ol>{problem.beforeCoding.map(step => <li key={step}>{step}</li>)}</ol><div className="hint"><strong>Pause here</strong><p>Explain your approach and try to code it before opening a solution.</p></div></section>
      <section className="concept-section"><h2>Solutions</h2><Approach label="Basic method" approach={problem.basic} /><Approach label="Better method" approach={problem.advanced} /></section>
      <section className="concept-section"><h2>Dry run</h2><ol>{problem.dryRun.map(step => <li key={step}>{step}</li>)}</ol></section>
      <section className="concept-section"><h2>Common mistakes</h2><ul>{problem.mistakes.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="mastery-check"><h2>Practice check</h2>{problem.finishCheck.map(item => <label className="checkbox-label" key={item}><input type="checkbox" /> <span>{item}</span></label>)}<p className="muted">These checks are for your practice only. Opening or copying a solution does not prove mastery.</p></section>
      <nav className="problem-pagination" aria-label="Problem navigation">{previous ? <a className="button" href={href('dsa', 'problem', previous.id)}>← {previous.title}</a> : <a className="button" href={href('dsa', 'intro')}>← Intro</a>}{next ? <a className="button primary" href={href('dsa', 'problem', next.id)}>{next.title} →</a> : <a className="button primary" href={href('dsa')}>Finish sprint</a>}</nav>
    </section>
  </>;
}

export default function DsaPractice({ route }) {
  const resource = useContent('content/dsa/practice.json', validatePractice);
  if (!resource.data) return <LoadState resource={resource} />;
  const view = route[1] || 'overview';
  return <div className="workspace"><DsaSidebar view={view} /><main id="main" tabIndex="-1" className="main-content">{view === 'overview' ? <Overview data={resource.data} /> : view === 'intro' ? <Intro data={resource.data} /> : view === 'concepts' ? <ConceptLibrary data={resource.data} selectedId={route[2]} /> : view === 'problem' ? <Problem data={resource.data} id={route[2]} /> : <Missing />}</main></div>;
}
