import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRoute, href, validateCatalog } from '../src/content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
test('the subject manifest reaches every registered catalog and mini app', () => {
  for (const subject of read('content/subjects.json')) {
    const catalog = validateCatalog(read(`content/${subject.id}/${subject.catalogPath}`));
    assert.equal(catalog.subject.id, subject.id);
    for (const miniPath of subject.miniAppPaths) {
      const app = read(`content/${subject.id}/${miniPath}`);
      assert.equal(app.subjectId, subject.id);
      app.conceptTopicIds.forEach(id => assert.ok(catalog.topics.some(t => t.id === id)));
    }
  }
});
test('authored and planned lessons remain distinct', () => {
  const catalog = read('content/react/curriculum.json');
  assert.equal(catalog.topics.filter(t => t.lessonPath).length, 1);
  assert.equal(catalog.topics.filter(t => t.contentStatus === 'planned').length, 323);
  assert.equal(catalog.topics.filter(t => t.contentStatus === 'published').length, 0);
  assert.ok(catalog.topics.filter(t => !t.lessonPath).every(t => t.contentStatus === 'planned'));
});
test('nested lesson links survive a refresh and malformed route escapes are handled', () => {
  const parts = ['react', 'topic', 'use-state', 'examples', 'queue-demo'];
  assert.deepEqual(readRoute(href(...parts)), parts);
  assert.deepEqual(readRoute('#/%GG'), ['missing']);
  assert.throws(() => validateCatalog({ subject: {}, topics: [], chapters: [] }), /incomplete/);
});
