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
    const interviewLibrary = read(`content/${subject.id}/${subject.interviewQuestionsPath}`);
    assert.ok(interviewLibrary.questions.length > 0);
    assert.ok(interviewLibrary.questions.every(question => question.sourceId && (question.sourcePages.length || question.references?.length)));
    for (const miniPath of subject.miniAppPaths) {
      const app = read(`content/${subject.id}/${miniPath}`);
      assert.equal(app.subjectId, subject.id);
      app.conceptTopicIds.forEach(id => assert.ok(catalog.topics.some(t => t.id === id)));
    }
  }
});
test('authored and planned lessons remain distinct', () => {
  const catalog = read('content/react/curriculum.json');
  assert.equal(catalog.topics.filter(t => t.lessonPath).length, 35);
  assert.equal(catalog.topics.filter(t => t.contentStatus === 'sample-draft').length, 35);
  assert.equal(catalog.topics.filter(t => t.contentStatus === 'planned').length, 289);
  assert.equal(catalog.topics.filter(t => t.contentStatus === 'published').length, 0);
  assert.ok(catalog.topics.filter(t => !t.lessonPath).every(t => t.contentStatus === 'planned'));
  const webChapter = catalog.chapters.find(chapter => chapter.id === 'web-basics');
  assert.ok(webChapter.topicIds.every(id => catalog.topics.find(topic => topic.id === id)?.lessonPath));
  const javascriptChapter = catalog.chapters.find(chapter => chapter.id === 'javascript-basics');
  assert.ok(javascriptChapter.topicIds.every(id => catalog.topics.find(topic => topic.id === id)?.lessonPath));
  const setupChapter = catalog.chapters.find(chapter => chapter.id === 'setup');
  assert.ok(setupChapter.topicIds.every(id => catalog.topics.find(topic => topic.id === id)?.lessonPath));
});
test('nested lesson links survive a refresh and malformed route escapes are handled', () => {
  const parts = ['react', 'topic', 'use-state', 'examples', 'queue-demo'];
  assert.deepEqual(readRoute(href(...parts)), parts);
  assert.deepEqual(readRoute('#/%GG'), ['missing']);
  assert.throws(() => validateCatalog({ subject: {}, topics: [], chapters: [] }), /incomplete/);
});
test('the DSA sprint has an intro and twenty complete problem pages', () => {
  const practice = read('content/dsa/practice.json');
  assert.equal(practice.problems.length, 20);
  assert.equal(practice.concepts.length, 18);
  assert.equal(practice.intro.estimatedMinutes + practice.problems.reduce((total, problem) => total + problem.estimatedMinutes, 0), 120);
  assert.deepEqual(practice.problems.map(problem => problem.order), Array.from({ length: 20 }, (_, index) => index + 1));
  assert.ok(practice.problems.every(problem => problem.basic.code && problem.advanced.code && problem.reference.url.startsWith('https://leetcode.com/problems/')));
  assert.ok(practice.problems.every(problem => problem.conceptIds.length >= 2 && problem.conceptIds.every(id => practice.concepts.some(concept => concept.id === id))));
  assert.deepEqual(readRoute(href('dsa', 'problem', 'two-sum')), ['dsa', 'problem', 'two-sum']);
  assert.deepEqual(readRoute(href('dsa', 'concepts', 'hash-map')), ['dsa', 'concepts', 'hash-map']);
  assert.deepEqual(readRoute(href('dsa', 'chapter', 'dsa-chapter-1')), ['dsa', 'chapter', 'dsa-chapter-1']);
});
test('DSA Chapter 1 preserves the supplied notes with factual corrections', () => {
  const chapter = read('content/dsa/chapters/dsa-chapter-1.json');
  assert.equal(chapter.title, 'DSA Chapter 1');
  assert.equal(chapter.noteTitle, 'Introduction to DSA and How Programs Work');
  assert.ok(chapter.content.length > 12000);
  assert.match(chapter.content, /Compiler and Linker/);
  assert.match(chapter.content, /automatic storage duration/);
  assert.match(chapter.content, /vector<int> copy\(n\)/);
  assert.doesNotMatch(chapter.content, /int arr\[n\]/);
});
