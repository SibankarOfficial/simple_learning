import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { parse } from '@babel/parser';
import { transformSync } from 'esbuild';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Ajv2020 from 'ajv/dist/2020.js';

const root = fileURLToPath(new URL('../content/react/', import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const catalog = read('curriculum.json');
const coverage = read('coverage.json');
const sources = read('sources.json');
const lesson = read('lessons/use-state.json');
const lessonSchema = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../schema/topic-lesson.schema.json', import.meta.url)), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false, formats: { date: /^\d{4}-\d{2}-\d{2}$/, uri: /^https?:\/\// } });
const validateLesson = ajv.compile(lessonSchema);
const lessonFiles = fs.readdirSync(path.join(root, 'lessons')).filter(name => name.endsWith('.json'));
for (const name of lessonFiles) {
  const candidate = read(`lessons/${name}`);
  assert(validateLesson(candidate), `${name} does not match the topic lesson schema:\n${ajv.errorsText(validateLesson.errors, { separator: '\n' })}`);
  if (candidate.status === 'published') {
    const pending = Object.entries(candidate.publicationChecklist)
      .filter(([key, value]) => key !== 'note' && value !== true)
      .map(([key]) => key);
    assert.equal(pending.length, 0, `${name} is published with pending checks: ${pending.join(', ')}`);
  }
}
const app = read('mini-apps/quantity-picker.json');
const ideas = read('ideas.json');
const unique = (items, label) => {
  assert.equal(new Set(items.map(x => x.id)).size, items.length, `Duplicate ${label} IDs`);
  return new Map(items.map(x => [x.id, x]));
};
const chapters = unique(catalog.chapters, 'chapter');
const topics = unique(catalog.topics, 'topic');
const sourceMap = unique(sources, 'source');
const examples = unique(lesson.examples, 'example');
unique(coverage.items, 'coverage');
unique(lesson.practice, 'practice');
unique(lesson.interviewQuestions, 'interview');
unique(ideas, 'idea');
const exists = (map, id, label) => assert(map.has(id), `${label}: ${id}`);
function ordered(items, label) {
  items.forEach((item, i) => assert.equal(item.order, i + 1, `${label} order`));
}
ordered(catalog.chapters, 'Chapter');
ordered(catalog.topics, 'Topic');
function dag(map, field) {
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    assert(!visiting.has(id), `Prerequisite cycle at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of map.get(id)[field] || []) {
      exists(map, dep, 'Missing prerequisite');
      assert(map.get(dep).order < map.get(id).order, `Prerequisite must come first: ${id} -> ${dep}`);
      visit(dep);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of map.keys()) visit(id);
}
dag(chapters, 'prerequisiteChapterIds');
dag(topics, 'prerequisiteTopicIds');
for (const chapter of chapters.values()) {
  assert.equal(chapter.subjectId, catalog.subject.id);
  for (const id of chapter.topicIds) {
    exists(topics, id, 'Missing chapter topic');
    assert.equal(topics.get(id).chapterId, chapter.id);
  }
}
for (const topic of topics.values()) {
  exists(chapters, topic.chapterId, 'Missing chapter');
  assert(chapters.get(topic.chapterId).topicIds.includes(topic.id));
  assert.equal(topic.subjectId, catalog.subject.id);
  if (topic.lessonPath) {
    const resolved = path.resolve(root, topic.lessonPath);
    assert(resolved.startsWith(root), 'Lesson path leaves content directory');
    assert(fs.existsSync(resolved), `Missing lesson: ${topic.lessonPath}`);
    const topicLesson = read(topic.lessonPath);
    assert.equal(topicLesson.id, topic.id);
    assert.equal(topicLesson.subjectId, topic.subjectId);
    assert.equal(topicLesson.chapterId, topic.chapterId);
    assert.equal(topicLesson.status, topic.contentStatus);
  } else assert.equal(topic.contentStatus, 'planned');
}
for (const item of coverage.items) {
  exists(sourceMap, item.sourceId, 'Unknown coverage source');
  assert(item.topicIds.length > 0);
  item.topicIds.forEach(id => exists(topics, id, 'Unknown coverage topic'));
}
let snippetCount = 0;
let renderedModules = 0;
const require = createRequire(import.meta.url);
function renderModule(code) {
  const transformed = transformSync(code, { loader: 'jsx', jsx: 'automatic', format: 'cjs' }).code;
  const module = { exports: {} };
  vm.runInNewContext(transformed, { module, exports: module.exports, require, console, setTimeout }, { timeout: 1000 });
  assert.equal(typeof module.exports.default, 'function', 'Example must export an App component');
  const html = renderToStaticMarkup(React.createElement(module.exports.default));
  assert(html.length > 0, 'Example must render content');
  renderedModules++;
  return html;
}
function walk(value) {
  if (!value || typeof value !== 'object') return;
  if (value.sourceIds) value.sourceIds.forEach(id => exists(sourceMap, id, 'Unknown source'));
  if (value.prerequisiteTopicIds) value.prerequisiteTopicIds.forEach(id => exists(topics, id, 'Unknown prerequisite'));
  if (value.exampleIds) value.exampleIds.forEach(id => exists(examples, id, 'Unknown example'));
  if (value.exampleId) exists(examples, value.exampleId, 'Missing solution example');
  if (typeof value.code === 'string') {
    parse(value.code, { sourceType: 'module', plugins: ['jsx'] });
    snippetCount++;
    if (value.kind === 'module') renderModule(value.code);
  }
  for (const child of Object.values(value)) walk(child);
}
walk(catalog); walk(lesson); walk(app);
parse(app.finalCode, { sourceType: 'module', plugins: ['jsx'] });
snippetCount++;
const appHtml = renderModule(app.finalCode);
assert(appHtml.includes('Quantity: 1. Total: ₹120'));
assert(appHtml.includes('aria-label="Decrease quantity" disabled=""'));
assert(!appHtml.includes('aria-label="Increase quantity" disabled=""'));
assert.equal(lesson.id, 'use-state');
assert.equal(lesson.chapterId, topics.get(lesson.id).chapterId);
assert(lesson.sections.length >= 10);
assert(lesson.practice.length >= 5 && lesson.practice.length <= 10);
const objectives = unique(lesson.objectives, 'objective');
for (const exercise of lesson.practice) {
  assert(exercise.prompt && exercise.hints.length && exercise.acceptanceCriteria.length);
  assert(exercise.solution.explanation);
  if (exercise.type !== 'predict') assert(exercise.solution.code || exercise.solution.exampleId);
  exercise.objectiveIds.forEach(id => exists(objectives, id, 'Unknown objective'));
}
for (const question of lesson.interviewQuestions) {
  assert(question.question && question.answer && question.followUp);
  if (question.provenance.kind === 'original') {
    assert.equal(question.provenance.recordedInterview, false);
    assert.equal(question.provenance.company, null);
    assert.equal(question.provenance.interviewSourceUrl, null);
  } else {
    assert.equal(question.type, 'recorded-interview');
    assert.equal(question.provenance.recordedInterview, true);
    assert(question.provenance.interviewSourceUrl, 'A recorded interview question needs a public source URL');
    assert(/^\d{4}-\d{2}-\d{2}$/.test(question.provenance.interviewSourceDate || ''), 'A recorded interview question needs its public source date');
  }
}
for (const id of app.conceptTopicIds) {
  exists(topics, id, 'Unknown app concept');
  assert(topics.get(id).miniAppIds.includes(app.id), `Missing topic backlink: ${id}`);
  assert(chapters.get(topics.get(id).chapterId).miniAppIds.includes(app.id));
}
app.relatedIdeaIds.forEach(id => assert(ideas.some(idea => idea.id === id)));
for (const idea of ideas) idea.conceptTopicIds.forEach(id => exists(topics, id, 'Unknown idea topic'));
assert.equal(app.finalCode, examples.get('quantity-picker').code);
assert.equal(typeof lesson.publicationChecklist.browserBehaviorChecked, 'boolean');
console.log(`PASS: ${chapters.size} chapters, ${topics.size} topics, ${coverage.items.length} coverage mappings.`);
console.log(`PASS: ${lesson.practice.length} exercises, ${lesson.interviewQuestions.length} interview questions, ${snippetCount} JSX/JS snippets parsed.`);
console.log(`PASS: ${lessonFiles.length} authored lesson JSON file(s) match the shared topic schema.`);
console.log(`PASS: ${renderedModules} complete modules rendered with React on the server; initial quantity and boundary controls checked.`);
console.log('Browser behavior, independent editorial review, and learner trial remain pending.');
