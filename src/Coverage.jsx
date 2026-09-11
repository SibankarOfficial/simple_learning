import useContent from './useContent.js';
import { Badge, LoadState } from './components.jsx';
import { href } from './content.js';

export default function Coverage({ catalog, sources }) {
  const resource = useContent(`content/${catalog.subject.id}/coverage.json`, data => {
    if (!Array.isArray(data?.items) || !Array.isArray(data?.openAudits) || !Array.isArray(data?.excludedScope)) throw new Error('The coverage record is incomplete.');
    return data;
  });
  if (!resource.data) return <LoadState resource={resource} />;
  const coverage = resource.data;
  const available = catalog.topics.filter(t => t.lessonPath).length;
  const published = catalog.topics.filter(t => t.contentStatus === 'published').length;
  const categories = [...new Set(coverage.items.map(i => i.category))];
  return <><header className="page-heading"><p className="eyebrow">WHAT IS HERE, AND WHAT IS MISSING</p><h1>Content coverage</h1><p>A source mapping shows where an idea belongs in the syllabus. It does not mean its lesson is finished.</p></header><div className="stats"><span><strong>{coverage.items.length}</strong> source mappings</span><span><strong>{available}</strong> available sample</span><span><strong>{catalog.topics.length - available}</strong> lessons planned</span><span><strong>{published}</strong> published lessons</span></div>
    <p className="muted">Inventory reviewed {coverage.reviewedAt}. Source dates describe the recorded review, not a live check.</p><details className="content-details"><summary>How coverage is tracked</summary><p>{coverage.method}</p><p>{coverage.updatePolicy}</p></details>
    <section><h2>Reviews still needed</h2>{coverage.openAudits.map(a => <article className="audit" key={a.id}><h3>{a.id.split('-').join(' ')}</h3><span className="badge">{a.status}</span><p>{a.detail}</p></article>)}</section>
    <section><h2>Official sources → syllabus topics</h2>{categories.map(category => <details className="content-details" key={category}><summary>{category} · {coverage.items.filter(i => i.category === category).length} mappings</summary><div className="table-scroll"><table><thead><tr><th>Source item</th><th>Topic destination</th><th>Content</th></tr></thead><tbody>{coverage.items.filter(i => i.category === category).map(item => {
      const source = sources.find(s => s.id === item.sourceId);
      return <tr key={item.id}><td>{source ? <a href={source.url} target="_blank" rel="noreferrer">{item.name}</a> : item.name}</td><td>{item.topicIds.map(id => <div key={id}><a href={href(catalog.subject.id, 'topic', id)}>{catalog.topics.find(t => t.id === id)?.title}</a></div>)}</td><td><Badge status={item.contentStatus} /></td></tr>;
    })}</tbody></table></div></details>)}</section>
    <section><h2>Outside this scope</h2><ul>{coverage.excludedScope.map(scope => <li key={scope}>{scope}</li>)}</ul></section>
    <details className="content-details"><summary>Source registry and review dates</summary><ul className="link-list">{sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><span className="muted"> · reviewed {source.accessedAt}</span></li>)}</ul></details>
  </>;
}
