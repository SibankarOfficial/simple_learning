export async function fetchJson(path, signal) {
  if (!/^content\/[a-z0-9/._-]+\.json$/.test(path) || path.includes('..')) {
    throw new Error('This content address is not valid.');
  }
  const response = await fetch(`${import.meta.env.BASE_URL}${path}`, { signal });
  if (!response.ok) throw new Error(response.status === 404
    ? 'This content file is missing.' : 'The content could not be loaded.');
  try { return await response.json(); }
  catch { throw new Error('This content file could not be read.'); }
}

export function validateCatalog(catalog) {
  if (!catalog?.subject?.id || !Array.isArray(catalog.chapters) || !Array.isArray(catalog.topics)
    || !catalog.chapters.every(c => c.id && c.title && Array.isArray(c.topicIds))
    || !catalog.topics.every(t => t.id && t.title && t.chapterId && t.contentStatus)) {
    throw new Error('The subject has incomplete content.');
  }
  return catalog;
}

export function readRoute(hash) {
  try { return hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent); }
  catch { return ['missing']; }
}

export const href = (...parts) => `#/${parts.map(encodeURIComponent).join('/')}`;
export const statusLabel = status => ({ planned: 'Planned', 'sample-draft': 'Sample draft', published: 'Published' })[status] || 'Under review';
