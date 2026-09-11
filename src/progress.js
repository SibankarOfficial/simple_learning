export const STORAGE_KEY = 'simple-learning.progress.v1';
export const emptyProgress = () => ({ schemaVersion: 1, exercises: {}, reviews: {}, evidence: {} });
export const topicKey = (subject, topic) => `${subject}/${topic}`;
export const exerciseKey = (subject, topic, exercise) => `${topicKey(subject, topic)}/${exercise}`;
export const emptyExercise = () => ({ answer: '', explanation: '', draftOpen: true, selfReportedIndependent: false, hintsUsed: 0, solutionViewed: false, attempts: [] });

export function loadProgress(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { data: emptyProgress(), warning: '' };
    const data = JSON.parse(raw);
    const record = value => value && typeof value === 'object' && !Array.isArray(value);
    if (data.schemaVersion !== 1 || ![data.exercises, data.reviews, data.evidence].every(record)
      || !Object.values(data.exercises).every(e => record(e) && Array.isArray(e.attempts)
        && typeof e.answer === 'string' && typeof e.explanation === 'string'
        && Number.isInteger(e.hintsUsed) && typeof e.solutionViewed === 'boolean'
        && e.attempts.every(a => record(a) && typeof a.answer === 'string' && typeof a.explanation === 'string' && typeof a.id === 'string'))
      || !Object.values(data.reviews).every(r => record(r) && Number.isFinite(Date.parse(r.startedAt)) && record(r.sessions))
      || !Object.values(data.evidence).every(e => record(e) && typeof e.explain === 'string' && typeof e.transfer === 'string')) {
      throw new Error('Invalid progress');
    }
    return { data, warning: '' };
  } catch {
    return { data: emptyProgress(), warning: 'Saved practice could not be read. New work will stay in this session so the existing data is not overwritten.', readOnly: true };
  }
}

export function updateExercise(progress, key, change) {
  const current = progress.exercises[key] || emptyExercise();
  return { ...progress, exercises: { ...progress.exercises, [key]: { ...current, ...change } } };
}
export function submitAttempt(progress, key, { now = new Date().toISOString(), id = crypto.randomUUID() } = {}) {
  const entry = progress.exercises[key] || emptyExercise();
  if (!entry.answer.trim() || !entry.explanation.trim()) return progress;
  const attempt = {
    id, learnerId: 'local', topicId: key.split('/')[1], exerciseId: key.split('/')[2],
    submittedAt: now, answer: entry.answer.trim(), explanation: entry.explanation.trim(),
    hintsUsed: entry.hintsUsed, solutionViewed: entry.solutionViewed,
    selfReportedIndependent: entry.selfReportedIndependent === true,
    outcome: 'not-reviewed', reviewedAt: null,
  };
  const [subject, topic] = key.split('/');
  const tk = topicKey(subject, topic);
  return {
    ...updateExercise(progress, key, { attempts: [...entry.attempts, attempt], draftOpen: false }),
    reviews: { ...progress.reviews, [tk]: progress.reviews[tk] || { startedAt: now, sessions: {} } },
  };
}
export function assessAttempt(progress, key, id, outcome, now = new Date().toISOString()) {
  if (!['meets-criteria', 'needs-practice'].includes(outcome)) return progress;
  const entry = progress.exercises[key];
  if (!entry) return progress;
  return updateExercise(progress, key, { attempts: entry.attempts.map(a => a.id === id ? { ...a, outcome, reviewedAt: now } : a) });
}
export function isIndependent(attempt) {
  return attempt.hintsUsed === 0 && attempt.solutionViewed === false && attempt.selfReportedIndependent === true;
}
export function independentExercises(progress, subject, topic) {
  const prefix = `${topicKey(subject, topic)}/`;
  return Object.entries(progress.exercises).filter(([key, e]) => key.startsWith(prefix)
    && e.attempts.some(a => isIndependent(a) && a.outcome === 'meets-criteria')).map(([key]) => key.slice(prefix.length));
}
export function reviewDate(startedAt, offset) {
  const date = new Date(startedAt);
  date.setDate(date.getDate() + offset);
  return date;
}
