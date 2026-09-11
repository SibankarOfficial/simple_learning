import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { emptyProgress, updateExercise, submitAttempt, assessAttempt, independentExercises, isIndependent, loadProgress, reviewDate, STORAGE_KEY } from '../src/progress.js';

const lesson = JSON.parse(readFileSync(new URL('../content/react/lessons/use-state.json', import.meta.url), 'utf8'));

const key = 'react/use-state/p03';
const now = '2026-09-11T12:00:00.000Z';
const draft = () => updateExercise(emptyProgress(), key, { answer: '4', explanation: '7, 14, 3, 4. Each updater reads the pending value.', selfReportedIndependent: true });

test('a submitted answer is evidence, never an automatic pass', () => {
  const p = submitAttempt(draft(), key, { now, id: 'first' });
  assert.equal(p.exercises[key].attempts[0].outcome, 'not-reviewed');
  assert.equal(p.exercises[key].draftOpen, false);
  assert.deepEqual(independentExercises(p, 'react', 'use-state'), []);
  assert.equal(p.reviews['react/use-state'].startedAt, now);
  assert.equal('mastered' in p, false);
});

test('blank answers or explanations cannot create an attempt or start reviews', () => {
  let p = emptyProgress();
  assert.equal(submitAttempt(p, key, { now, id: 'empty' }), p);
  p = updateExercise(p, key, { answer: '4', explanation: '  ' });
  assert.equal(submitAttempt(p, key, { now, id: 'no-reason' }), p);
});

test('no recorded reveal alone cannot establish independence without learner confirmation', () => {
  let p = updateExercise(draft(), key, { selfReportedIndependent: false });
  p = submitAttempt(p, key, { now, id: 'unconfirmed' });
  p = assessAttempt(p, key, 'unconfirmed', 'meets-criteria');
  assert.deepEqual(independentExercises(p, 'react', 'use-state'), []);
});

test('viewing a solution before a submission prevents independent credit across retries', () => {
  let p = updateExercise(draft(), key, { solutionViewed: true });
  p = submitAttempt(p, key, { now, id: 'one' });
  p = assessAttempt(p, key, 'one', 'meets-criteria', now);
  assert.deepEqual(independentExercises(p, 'react', 'use-state'), []);
  p = updateExercise(p, key, { answer: '4 again', draftOpen: true });
  p = submitAttempt(p, key, { now, id: 'two' });
  assert.equal(p.exercises[key].attempts[1].solutionViewed, true);
  assert.equal(isIndependent(p.exercises[key].attempts[1]), false);
});

test('hints also record assistance and survive storage reload', () => {
  const p = updateExercise(draft(), key, { hintsUsed: 1 });
  const loaded = loadProgress({ getItem: name => { assert.equal(name, STORAGE_KEY); return JSON.stringify(p); } });
  assert.equal(loaded.warning, '');
  const submitted = submitAttempt(loaded.data, key, { now, id: 'hint' });
  assert.equal(isIndependent(submitted.exercises[key].attempts[0]), false);
});

test('a saved pre-reveal attempt stays immutable when later assistance is opened', () => {
  const original = submitAttempt(draft(), key, { now, id: 'before' });
  let p = updateExercise(original, key, { solutionViewed: true, answer: 'Changed after feedback' });
  p = assessAttempt(p, key, 'before', 'meets-criteria', now);
  assert.equal(p.exercises[key].attempts[0].answer, '4');
  assert.equal(p.exercises[key].attempts[0].solutionViewed, false);
  assert.equal(original.exercises[key].attempts[0].outcome, 'not-reviewed');
  assert.deepEqual(independentExercises(p, 'react', 'use-state'), ['p03']);
});

test('multiple successful attempts count one exercise and do not affect another subject', () => {
  let p = submitAttempt(draft(), key, { now, id: 'one' });
  p = submitAttempt(p, key, { now, id: 'two' });
  p = assessAttempt(assessAttempt(p, key, 'one', 'meets-criteria'), key, 'two', 'meets-criteria');
  assert.deepEqual(independentExercises(p, 'react', 'use-state'), ['p03']);
  assert.deepEqual(independentExercises(p, 'javascript', 'use-state'), []);
  assert.equal(p.reviews['react/use-state'].startedAt, now);
});

test('fresh retry drafts remain editable after leaving and reopening the lesson', () => {
  let p = submitAttempt(draft(), key, { now, id: 'one' });
  p = updateExercise(p, key, { answer: '', explanation: '', draftOpen: true });
  const { data } = loadProgress({ getItem: () => JSON.stringify(p) });
  assert.equal(data.exercises[key].draftOpen, true);
  assert.equal(data.exercises[key].attempts.length, 1);
});

test('corrupt, incompatible, and inaccessible storage recover without overwriting old work', () => {
  for (const raw of ['{broken', '{"schemaVersion":9}', JSON.stringify({ ...emptyProgress(), exercises: { bad: {} } })]) {
    const result = loadProgress({ getItem: () => raw });
    assert.deepEqual(result.data, emptyProgress());
    assert.equal(result.readOnly, true);
    assert.ok(result.warning);
  }
  assert.ok(loadProgress({ getItem: () => { throw new Error('denied'); } }).warning);
});

test('review dates preserve the requested gap and each session has fresh problems', () => {
  const sessions = lesson.mastery.reviewSchedule.sessions;
  const prompts = sessions.flatMap(session => session.problems.map(problem => problem.prompt));
  assert.equal(new Set(prompts).size, 8);
  assert.deepEqual(sessions.map(session => session.dayOffset), [1, 3, 7, 14]);
  assert.equal(reviewDate(now, 1).getTime() - Date.parse(now), 24 * 60 * 60 * 1000);
  assert.match(sessions[0].problems[0].solution, /log is 3/);
  assert.match(sessions[0].problems[0].solution, /shows 5/);
  assert.match(sessions[0].problems[1].solution, /5, then 10, then 9/);
});
