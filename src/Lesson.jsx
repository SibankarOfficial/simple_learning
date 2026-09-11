import { useEffect, useState } from 'react';
import useContent from './useContent.js';
import { Badge, Code, LoadState, Modal, Sources, TopicLinks } from './components.jsx';
import { href } from './content.js';
import { useProgress } from './ProgressContext.jsx';
import { assessAttempt, emptyExercise, exerciseKey, isIndependent, submitAttempt, updateExercise } from './progress.js';
import { Mastery } from './Review.jsx';
import CodePlayground from './CodePlayground.jsx';

function Exercise({ exercise, lesson, catalog, sources }) {
  const { progress, change } = useProgress();
  const key = exerciseKey(catalog.subject.id, lesson.id, exercise.id);
  const entry = progress.exercises[key] || emptyExercise();
  const [modal, setModal] = useState(false);
  const latest = entry.attempts.at(-1);
  const submitted = Boolean(latest) && entry.draftOpen !== true;
  const solution = exercise.solution;
  const example = lesson.examples.find(e => e.id === solution.exampleId);
  const update = patch => change(p => updateExercise(p, key, patch));
  return <section className="exercise" id={`exercise-${exercise.id}`}>
    <div className="exercise-heading"><h3>Exercise {Number(exercise.id.slice(1))}</h3><span className="muted">{exercise.type.replaceAll('-', ' ')} · {exercise.difficulty}</span></div>
    <p>{exercise.prompt}</p>
    <form onSubmit={e => { e.preventDefault(); change(p => submitAttempt(p, key)); }}>
      <label htmlFor={`${exercise.id}-answer`}>{exercise.type === 'predict' ? 'Your prediction' : 'Your code or approach'}</label>
      <textarea id={`${exercise.id}-answer`} value={entry.answer} readOnly={submitted} required rows={exercise.type === 'predict' ? 3 : 6} placeholder="Try without copying. If you are stuck, explain what you tried." onChange={e => update({ answer: e.target.value })} />
      <label htmlFor={`${exercise.id}-reason`}>Why should this work?</label>
      <textarea id={`${exercise.id}-reason`} value={entry.explanation} readOnly={submitted} required rows={2} placeholder="Explain your reasoning in your own words." onChange={e => update({ explanation: e.target.value })} />
      <label className="checkbox-label"><input type="checkbox" disabled={submitted || entry.hintsUsed > 0 || entry.solutionViewed} checked={entry.selfReportedIndependent === true && entry.hintsUsed === 0 && !entry.solutionViewed} onChange={e => update({ selfReportedIndependent: e.target.checked })} />I wrote this without notes, copied code, or outside help.</label>
      <div className="actions">{!submitted ? <button className="primary" disabled={!entry.answer.trim() || !entry.explanation.trim()}>Save attempt</button>
        : <button type="button" onClick={() => update({ answer: '', explanation: '', selfReportedIndependent: false, draftOpen: true })}>Try again in a blank answer</button>}
        <button type="button" disabled={entry.hintsUsed >= exercise.hints.length} onClick={() => update({ hintsUsed: entry.hintsUsed + 1 })}>Show hint {Math.min(entry.hintsUsed + 1, exercise.hints.length)} of {exercise.hints.length}</button>
        <button type="button" disabled={!submitted} onClick={() => { update({ solutionViewed: true }); setModal(true); }}>View solution</button>
      </div>
    </form>
    {!submitted && <p className="muted">Save your attempt before opening the solution. Code is not run or graded here.</p>}
    {entry.hintsUsed > 0 && <div className="hint"><strong>Hints used</strong><ol>{exercise.hints.slice(0, entry.hintsUsed).map(h => <li key={h}>{h}</li>)}</ol></div>}
    {(entry.solutionViewed || entry.hintsUsed > 0) && <p className="assistance">Help has been viewed for this exercise. Future attempts here are recorded as assisted.</p>}
    {submitted && <div className="feedback" role="status"><strong>Attempt saved · {isIndependent(latest) ? 'Independent, as reported by you' : 'Assisted or independence not confirmed'}</strong><p>Check your work against these criteria. This is your own review, not an automatic grade.</p>
      <ul>{exercise.acceptanceCriteria.map(c => <li key={c}>{c}</li>)}</ul>
      <div className="actions"><button aria-pressed={latest.outcome === 'meets-criteria'} onClick={() => change(p => assessAttempt(p, key, latest.id, 'meets-criteria'))}>My work meets the criteria</button><button aria-pressed={latest.outcome === 'needs-practice'} onClick={() => change(p => assessAttempt(p, key, latest.id, 'needs-practice'))}>I need more practice</button></div>
      {latest.outcome !== 'not-reviewed' && <p>{latest.outcome === 'meets-criteria' ? 'Self-review saved. This alone does not establish mastery.' : 'Try a smaller example, use a hint, or compare the explained solution. Then rebuild the idea.'}</p>}
    </div>}
    {entry.attempts.length > 0 && <details className="attempt-history"><summary>{entry.attempts.length} saved attempt{entry.attempts.length === 1 ? '' : 's'}</summary>{[...entry.attempts].reverse().map(a => <article key={a.id}><p className="muted">{new Date(a.submittedAt).toLocaleString()} · {isIndependent(a) ? 'Independent, self-reported' : 'Assisted or not confirmed'} · {a.outcome.replaceAll('-', ' ')}</p><pre className="answer-text">{a.answer}</pre><p>{a.explanation}</p></article>)}</details>}
    {modal && <Modal title={`Exercise ${Number(exercise.id.slice(1))}: explained solution`} onClose={() => setModal(false)}><p className="assistance">This reveal is recorded as help. It does not award mastery.</p><p>{solution.explanation}</p>{(solution.code || example?.code) && <Code>{solution.code || example.code}</Code>}<Sources ids={exercise.sourceIds} sources={sources} /><p>Close this solution and try the idea again. Use a different problem later to check independent recall.</p></Modal>}
  </section>;
}

function Diagnostic({ item, index, catalog }) {
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  return <article className="diagnostic"><h3>{item.question}</h3><label htmlFor={`diagnostic-${index}`}>Your answer</label><input id={`diagnostic-${index}`} value={answer} onChange={e => setAnswer(e.target.value)} /><button className="small-button" disabled={!answer.trim()} onClick={() => setRevealed(true)}>Check explanation</button>{revealed && <div className="feedback"><p>{item.answer}</p><p className="muted">If you need help, review this concept:</p><TopicLinks ids={[item.ifMissed]} catalog={catalog} /></div>}</article>;
}

const views = [['learn', 'Learn'], ['examples', 'Examples'], ['practice', 'Practice'], ['mastery', 'Mastery check'], ['interview', 'Interview']];
function LessonReader({ lesson, catalog, sources, section }) {
  const selected = views.some(([id]) => id === section) ? section : 'learn';
  return <><header className="page-heading lesson-heading"><div className="eyebrow">TOPIC LESSON <Badge status={lesson.status} /></div><h1>{lesson.title}</h1><p>Understand the idea, try it yourself, and explain what happened.</p><p className="muted">Content reviewed {lesson.reviewedAt} · {lesson.estimatedMinutes.firstPass} min first pass · {lesson.estimatedMinutes.practice} min practice</p></header>
    <p className="draft-note">This sample is available for learning and review. Browser checks, independent content review, and a learner trial are still pending.</p>
    <nav className="lesson-nav" aria-label="Lesson sections">{views.map(([id, label]) => <a key={id} href={href(catalog.subject.id, 'topic', lesson.id, id)} aria-current={selected === id ? 'page' : undefined}>{label}{id === 'practice' ? ` (${lesson.practice.length})` : id === 'examples' ? ` (${lesson.examples.length})` : ''}</a>)}</nav>
    {selected === 'learn' && <div className="lesson-body"><section><h2>Before you begin</h2><p>These concepts will help. Planned links show their place in the syllabus.</p><TopicLinks ids={lesson.prerequisiteTopicIds} catalog={catalog} /><details className="content-details"><summary>Check your prerequisites</summary>{lesson.diagnostic.map((item, i) => <Diagnostic key={item.question} item={item} index={i} catalog={catalog} />)}</details></section>
      <section><h2>What you will work toward</h2><ul>{lesson.objectives.map(o => <li key={o.id}>{o.text}</li>)}</ul></section>
      <div className="notice"><strong>Try a prediction before reading further</strong><p>{lesson.practice.find(p => p.type === 'predict')?.prompt}</p><a href={href(catalog.subject.id, 'topic', lesson.id, 'practice')}>Write your prediction in Practice</a></div>
      {['core', 'deeper', 'reference'].map(depth => {
        const sections = lesson.sections.filter(s => s.depth === depth);
        const body = sections.map(s => <section className="concept-section" key={s.id}><h2>{s.title}</h2><p>{s.body}</p>{s.exampleIds.length > 0 && <p className="example-links">Try the example: {s.exampleIds.map((id, i) => <span key={id}>{i > 0 ? ' · ' : ''}<a href={href(catalog.subject.id, 'topic', lesson.id, 'examples', id)}>{lesson.examples.find(e => e.id === id)?.title}</a></span>)}</p>}<Sources ids={s.sourceIds} sources={sources} /></section>);
        return depth === 'core' ? <div key={depth}>{body}</div> : <details className="content-details" key={depth}><summary>{depth === 'deeper' ? 'Go deeper' : 'Less common cases and reference notes'}</summary>{body}</details>;
      })}
      <section><h2>Common mistakes</h2>{lesson.commonMistakes.map(m => <article className="mistake" key={m.symptom}><h3>{m.symptom}</h3><p><strong>Why:</strong> {m.cause}</p><p><strong>Try:</strong> {m.fix}</p></article>)}</section>
      <a className="button primary" href={href(catalog.subject.id, 'topic', lesson.id, 'practice')}>Practice this topic</a>
    </div>}
    {selected === 'examples' && <><p>Read the example, predict a change, and open its live preview. The preview runs the complete module in an isolated frame.</p><p className="muted">{lesson.runtime}</p>{lesson.examples.map(example => <section className="example-section" key={example.id} id={`example-${example.id}`}><div className="section-heading"><h2>{example.title}</h2><span className="muted">{example.depth}</span></div><Code>{example.code}</Code>{example.kind === 'module' && <CodePlayground initialCode={example.code} title={example.title} />}<p>{example.explanation}</p><div className="hint"><strong>Try it yourself</strong><p>{example.tryThis}</p></div><Sources ids={example.sourceIds} sources={sources} /></section>)}</>}
    {selected === 'practice' && <><div className="notice"><strong>Work before you reveal</strong><p>Save your prediction or code and a reason. Hints are optional. Compare your work, correct mistakes, and try a fresh problem later.</p><p className="muted">Drafts and attempts are saved only in this browser. Clearing browser data removes them.</p></div>{lesson.practice.map(exercise => <Exercise key={exercise.id} exercise={exercise} lesson={lesson} catalog={catalog} sources={sources} />)}</>}
    {selected === 'mastery' && <Mastery lesson={lesson} catalog={catalog} />}
    {selected === 'interview' && <><h2>Interview practice</h2><p>These {lesson.interviewQuestions.length} questions are original interview-style exercises. They are not recorded questions from named companies. Say your answer aloud before opening the explanation.</p>{lesson.interviewQuestions.map((q, i) => <section key={q.id} className="interview"><h3>{i + 1}. {q.question}</h3><details className="content-details"><summary>Answer and follow-up</summary><p>{q.answer}</p><p><strong>Follow-up:</strong> {q.followUp}</p><Sources ids={q.sourceIds} sources={sources} /></details></section>)}</>}
    <section className="related"><h2>Put this topic to work</h2><p>Build a small app, then use the same concepts in an independent variation.</p>{lesson.miniAppIds.map(id => <a className="button" key={id} href={href(catalog.subject.id, 'mini-app', id)}>Build the notebook quantity picker</a>)}</section>
  </>;
}

export default function Lesson({ topic, catalog, section, sources, exampleId }) {
  const resource = useContent(`content/${catalog.subject.id}/${topic.lessonPath}`, value => {
    const arrays = ['sections', 'examples', 'practice', 'diagnostic', 'objectives', 'interviewQuestions', 'commonMistakes', 'prerequisiteTopicIds', 'miniAppIds'];
    if (value?.id !== topic.id || value.subjectId !== catalog.subject.id || !arrays.every(key => Array.isArray(value[key])) || !value.mastery?.checks || !value.estimatedMinutes) throw new Error('This lesson has incomplete content.');
    return value;
  });
  useEffect(() => {
    if (resource.data && section === 'examples' && exampleId) {
      document.getElementById(`example-${exampleId}`)?.scrollIntoView();
    }
  }, [resource.data, section, exampleId]);
  return resource.data ? <LessonReader lesson={resource.data} catalog={catalog} sources={sources} section={section} /> : <LoadState resource={resource} />;
}
