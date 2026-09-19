import { useEffect, useMemo, useState } from 'react';
import { Code, LoadState } from './components.jsx';
import useContent from './useContent.js';

const PAGE_SIZE = 30;
const DIFFICULTY_ORDER = {
  basic: 0,
  foundation: 0,
  beginner: 0,
  easy: 0,
  intermediate: 1,
  medium: 1,
  advanced: 2,
  hard: 2,
  tricky: 3,
};

function difficultyRank(item) {
  const difficulty = item.difficulty?.trim().toLocaleLowerCase();
  return difficulty ? (DIFFICULTY_ORDER[difficulty] ?? 1) : 0;
}

function validateLibrary(data) {
  if (!data || !Array.isArray(data.questions) || !Array.isArray(data.sources) || !Array.isArray(data.categories)
    || !data.questions.every(item => item.id && item.question && item.answer && item.category && item.sourceId)) {
    throw new Error('The interview question library is incomplete.');
  }
  return data;
}

export default function InterviewQuestions({ subject }) {
  const resource = useContent(`content/${subject.id}/${subject.interviewQuestionsPath}`, validateLibrary);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sourceId, setSourceId] = useState('all');
  const [reviewStatus, setReviewStatus] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const library = resource.data;

  const filtered = useMemo(() => {
    if (!library) return [];
    const search = query.trim().toLocaleLowerCase();
    return [...library.questions].sort((a, b) => difficultyRank(a) - difficultyRank(b)).filter(item => (category === 'all' || item.category === category)
      && (sourceId === 'all' || item.sourceId === sourceId)
      && (reviewStatus === 'all' || item.reviewStatus === reviewStatus)
      && (!search || `${item.question} ${item.answer} ${item.tip || ''} ${item.difficulty || ''}`.toLocaleLowerCase().includes(search)));
  }, [library, query, category, sourceId, reviewStatus]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [query, category, sourceId, reviewStatus]);
  if (!library) return <LoadState resource={resource} />;

  const sourceMap = new Map(library.sources.map(source => [source.id, source]));
  const visible = filtered.slice(0, visibleCount);
  const reviewedCount = library.questions.filter(item => item.reviewStatus === 'curated-reviewed').length;
  const importedCount = library.questions.filter(item => item.reviewStatus === 'imported-unverified').length;
  return <><header className="page-heading"><p className="eyebrow">INTERVIEW PREPARATION</p><h1>Interview questions</h1><p>Practice foundations, tricky output questions, React behavior, browser internals, accessibility, security, and performance. Explain each answer again without looking.</p></header>
    <div className="stats"><span><strong>{library.questions.length}</strong> total entries</span><span><strong>{reviewedCount}</strong> reviewed advanced</span><span><strong>{importedCount}</strong> imported for review</span></div>
    <div className="notice interview-source-note"><h2>Know which set you are reading</h2><p>The reviewed advanced set links to public interview patterns and authoritative technical references. The {importedCount} PDF entries preserve their supplied wording and remain marked unverified. A public list still does not prove that a named company asked every question.</p></div>
    <section className="interview-filters" aria-label="Filter interview questions">
      <label htmlFor="interview-search">Search questions and answers</label>
      <input id="interview-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try hooks, closure, accessibility, or TypeScript" />
      <div className="filter-grid three"><div><label htmlFor="interview-category">Category</label><select id="interview-category" value={category} onChange={event => setCategory(event.target.value)}>{library.categories.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
        <div><label htmlFor="interview-review">Question set</label><select id="interview-review" value={reviewStatus} onChange={event => setReviewStatus(event.target.value)}><option value="all">All questions</option><option value="curated-reviewed">Reviewed advanced</option><option value="imported-unverified">Imported unverified</option></select></div>
        <div><label htmlFor="interview-source">Source set</label><select id="interview-source" value={sourceId} onChange={event => setSourceId(event.target.value)}><option value="all">All sources</option>{library.sources.map(source => <option key={source.id} value={source.id}>{source.title}</option>)}</select></div></div>
    </section>
    <div className="section-heading"><h2>{filtered.length} matching entries</h2><span className="muted">Showing {Math.min(visible.length, filtered.length)} now</span></div>
    {visible.length ? <div className="interview-library">{visible.map((item, index) => {
      const source = sourceMap.get(item.sourceId);
      const pages = item.sourcePages?.length === 1 ? `page ${item.sourcePages[0]}` : item.sourcePages?.length ? `pages ${item.sourcePages[0]}–${item.sourcePages.at(-1)}` : null;
      const reviewed = item.reviewStatus === 'curated-reviewed';
      return <details className="interview-card" key={item.id}><summary><span className="question-number">{index + 1}</span><span>{item.question}</span><span className="interview-tags"><span className="badge">{item.categoryLabel}</span>{item.difficulty && <span className="badge reviewed">{item.difficulty}</span>}</span></summary>
        <div className="interview-answer"><p className="answer-text">{item.answer}</p>{item.example && <><h3>Example</h3><Code language={item.example.language.toUpperCase()}>{item.example.code}</Code></>}{item.tip && <div className="hint"><strong>Interview focus</strong><p>{item.tip}</p></div>}{reviewed && item.references?.length > 0 && <p className="sources">Checked with: {item.references.map((url, refIndex) => <span key={url}>{refIndex ? ' · ' : ''}<a href={url} target="_blank" rel="noreferrer">reference {refIndex + 1}</a></span>)}</p>}<p className="sources">Source set: {source?.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : source?.title || item.sourceId}{pages ? ` · ${pages}` : ''} · {reviewed ? 'curated and reviewed' : 'imported text, not independently verified'}</p></div>
      </details>;
    })}</div> : <div className="notice"><h2>No matching questions</h2><p>Try a shorter search or choose another category.</p></div>}
    {visible.length < filtered.length && <button className="load-more" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>Show 30 more</button>}
  </>;
}
