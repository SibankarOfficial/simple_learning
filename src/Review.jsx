import { useState } from 'react';
import { href } from './content.js';
import { useProgress } from './ProgressContext.jsx';
import { independentExercises, reviewDate, topicKey } from './progress.js';
import { Modal } from './components.jsx';
import useContent from './useContent.js';
import { LoadState } from './components.jsx';

export function Mastery({ lesson, catalog }) {
  const { progress, change } = useProgress();
  const key = topicKey(catalog.subject.id, lesson.id);
  const saved = progress.evidence[key] || { explain: '', transfer: '' };
  const [evidence, setEvidence] = useState(saved);
  const [message, setMessage] = useState('');
  const independent = independentExercises(progress, catalog.subject.id, lesson.id);
  return <><h2>Build evidence of understanding</h2><p>{lesson.mastery.policy}</p><div className="notice"><strong>{independent.length} of {lesson.practice.length} exercises self-reviewed as meeting the criteria without prior help</strong><p>This is a practice record, not a verified mastery score.</p></div>
    {lesson.mastery.checks.map(check => <section key={check.id} className="mastery-check"><h3>{check.evidence}</h3><p>{check.pass}</p></section>)}
    <form className="evidence-form" onSubmit={e => { e.preventDefault(); change(p => ({ ...p, evidence: { ...p.evidence, [key]: { ...evidence, savedAt: new Date().toISOString() } } })); setMessage('Evidence saved for your own review. It has not been independently checked.'); }}>
      <h3>Your evidence</h3><label htmlFor="explain-evidence">Explain the concepts without notes</label><textarea id="explain-evidence" rows={5} value={evidence.explain} onChange={e => setEvidence({ ...evidence, explain: e.target.value })} placeholder="Explain memory, snapshots, updaters, and immutable updates. Include examples." />
      <label htmlFor="transfer-evidence">Independent build: what did you make and check?</label><textarea id="transfer-evidence" rows={4} value={evidence.transfer} onChange={e => setEvidence({ ...evidence, transfer: e.target.value })} placeholder="Describe your seat picker, your decisions, and the checks you ran." />
      <button className="primary" disabled={!evidence.explain.trim() && !evidence.transfer.trim()}>Save evidence</button><p role="status">{message}</p>
    </form><a href={href(catalog.subject.id, 'review')}>Open spaced review</a></>;
}

function ReviewSession({ subject, topic, sessionDefinition, startedAt }) {
  const { dayOffset: offset, problems } = sessionDefinition;
  const { progress, change } = useProgress();
  const tk = topicKey(subject, topic);
  const session = progress.reviews[tk]?.sessions[offset] || { answers: {}, submittedAt: null, revealed: false, outcome: 'not-reviewed' };
  const [modal, setModal] = useState(false);
  const due = reviewDate(startedAt, offset);
  const isDue = due.getTime() <= Date.now();
  const update = patch => change(p => ({ ...p, reviews: { ...p.reviews, [tk]: { ...p.reviews[tk], sessions: { ...p.reviews[tk].sessions, [offset]: { ...session, ...patch } } } } }));
  return <details className="review-session"><summary><span>Day {offset}</span><span>{due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {session.submittedAt ? 'Attempt saved' : isDue ? 'Ready for review' : 'Upcoming'}</span></summary>
    {!isDue ? <p>This review opens after the gap. You can keep practicing the lesson now.</p> : <><p>Answer both fresh predictions without looking at your notes. Include the reasoning in each answer.</p>
      <form onSubmit={e => { e.preventDefault(); update({ submittedAt: new Date().toISOString() }); }}>{problems.map(problem => <div key={problem.id}><label htmlFor={`review-${offset}-${problem.id}`}>{problem.prompt}</label><textarea id={`review-${offset}-${problem.id}`} rows={4} required readOnly={Boolean(session.submittedAt)} value={session.answers[problem.id] || ''} onChange={e => update({ answers: { ...session.answers, [problem.id]: e.target.value } })} /></div>)}<button className="primary" disabled={Boolean(session.submittedAt) || !problems.every(p => session.answers[p.id]?.trim())}>Save review answers</button></form>
      {session.submittedAt && <div className="feedback"><p>Answers saved before feedback. Compare the reasoning, then record your own assessment.</p><button onClick={() => { update({ revealed: true }); setModal(true); }}>Compare explanations</button>{session.revealed && <div className="actions"><button aria-pressed={session.outcome === 'meets-criteria'} onClick={() => update({ outcome: 'meets-criteria', reviewedAt: new Date().toISOString() })}>Both answers and reasons match</button><button aria-pressed={session.outcome === 'needs-practice'} onClick={() => update({ outcome: 'needs-practice', reviewedAt: new Date().toISOString() })}>I need more practice</button></div>}<p className="muted">Self-review: {session.outcome.replaceAll('-', ' ')}. No automatic mastery is awarded.</p></div>}
    </>}{modal && <Modal title={`Day ${offset}: review explanations`} onClose={() => setModal(false)}>{problems.map(p => <section key={p.id}><h3>{p.prompt}</h3><p>{p.solution}</p></section>)}</Modal>}
  </details>;
}
function TopicReview({ topic, catalog }) {
  const { progress } = useProgress();
  const resource = useContent(`content/${catalog.subject.id}/${topic.lessonPath}`);
  if (!resource.data) return <LoadState resource={resource} />;
  const lesson = resource.data;
  const review = progress.reviews[topicKey(catalog.subject.id, topic.id)];
  const attempts = Object.entries(progress.exercises).filter(([key]) => key.startsWith(`${catalog.subject.id}/${topic.id}/`)).flatMap(([, e]) => e.attempts);
  return <section className="topic-review"><h2>{topic.title}</h2><p>{attempts.length} saved attempts · {independentExercises(progress, catalog.subject.id, topic.id).length} exercises self-reviewed without prior help</p>
    {!review ? <div className="notice"><p>Your review schedule starts when you save your first practice attempt.</p><a className="button primary" href={href(catalog.subject.id, 'topic', topic.id, 'practice')}>Start practice</a></div> : <><p className="muted">{lesson.mastery.reviewSchedule.note} Review dates use this device's clock.</p>{lesson.mastery.reviewSchedule.sessions.map(sessionDefinition => <ReviewSession key={sessionDefinition.dayOffset} subject={catalog.subject.id} topic={topic.id} sessionDefinition={sessionDefinition} startedAt={review.startedAt} />)}</>}
    <div className="actions"><a href={href(catalog.subject.id, 'topic', topic.id, 'practice')}>Continue practice</a><a href={href(catalog.subject.id, 'topic', topic.id, 'mastery')}>Review mastery evidence</a></div></section>;
}
export default function Review({ catalog }) {
  return <><header className="page-heading"><p className="eyebrow">RETURN TO WHAT YOU LEARNED</p><h1>Practice & review</h1><p>Try without notes after a gap. Explain your answer, compare feedback, and revisit what needs work.</p></header><p className="draft-note">Practice is saved on this browser only. Self-reviews and written evidence are not independent assessments of mastery.</p>{catalog.topics.filter(t => t.lessonPath).map(topic => <TopicReview key={topic.id} topic={topic} catalog={catalog} />)}</>;
}
