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
const subjectRegistry = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../content/subjects.json', import.meta.url)), 'utf8'));
const reactSubject = subjectRegistry.find(subject => subject.id === 'react');
const miniApps = reactSubject.miniAppPaths.map(miniPath => read(miniPath));
const lesson = read('lessons/use-state.json');
const lessonSchema = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../schema/topic-lesson.schema.json', import.meta.url)), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false, formats: { date: /^\d{4}-\d{2}-\d{2}$/, uri: /^https?:\/\// } });
const validateLesson = ajv.compile(lessonSchema);
const lessonFiles = fs.readdirSync(path.join(root, 'lessons')).filter(name => name.endsWith('.json'));
const authoredLessons = [];
for (const name of lessonFiles) {
  const candidate = read(`lessons/${name}`);
  authoredLessons.push(candidate);
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
const interviewLibrary = read('interview-questions.json');
const dsaPractice = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../content/dsa/practice.json', import.meta.url)), 'utf8'));
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
unique(miniApps, 'mini app');
unique(interviewLibrary.questions, 'imported interview question');
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
function walk(value, lessonExamples = examples) {
  if (!value || typeof value !== 'object') return;
  if (value.sourceIds) value.sourceIds.forEach(id => exists(sourceMap, id, 'Unknown source'));
  if (value.prerequisiteTopicIds) value.prerequisiteTopicIds.forEach(id => exists(topics, id, 'Unknown prerequisite'));
  if (value.exampleIds) value.exampleIds.forEach(id => exists(lessonExamples, id, 'Unknown example'));
  if (value.exampleId) exists(lessonExamples, value.exampleId, 'Missing solution example');
  if (typeof value.code === 'string') {
    const codeLanguage = value.language || value.kind;
    if (codeLanguage === 'css') transformSync(value.code, { loader: 'css' });
    else if (codeLanguage === 'shell') assert(value.code.trim() && !value.code.includes('\u0000'), 'Shell example must contain readable commands');
    else if (codeLanguage === 'html') assert(value.code.includes('<') && value.code.includes('>'), 'HTML example must contain markup');
    else parse(value.code, { sourceType: 'module', plugins: ['jsx'] });
    snippetCount++;
    if (value.kind === 'module') renderModule(value.code);
  }
  for (const child of Object.values(value)) walk(child, lessonExamples);
}
walk(catalog);
for (const candidate of authoredLessons) {
  const candidateExamples = unique(candidate.examples, `${candidate.id} example`);
  const candidateObjectives = unique(candidate.objectives, `${candidate.id} objective`);
  const coveredObjectives = new Set();
  for (const section of candidate.sections) {
    section.objectiveIds.forEach(id => {
      exists(candidateObjectives, id, `Unknown section objective in ${candidate.id}`);
      coveredObjectives.add(id);
    });
  }
  for (const objective of candidate.objectives) {
    assert(coveredObjectives.has(objective.id), `${candidate.id} objective has no explaining section: ${objective.id}`);
  }
  unique(candidate.practice, `${candidate.id} practice`);
  unique(candidate.interviewQuestions, `${candidate.id} interview`);
  for (const exercise of candidate.practice) {
    assert(exercise.prompt && exercise.hints.length && exercise.acceptanceCriteria.length);
    assert(exercise.solution.explanation);
    exercise.objectiveIds.forEach(id => exists(candidateObjectives, id, 'Unknown objective'));
  }
  for (const question of candidate.interviewQuestions) {
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
  walk(candidate, candidateExamples);
}
for (const miniApp of miniApps) walk(miniApp);
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
for (const miniApp of miniApps) {
  miniApp.sourceIds.forEach(id => exists(sourceMap, id, 'Unknown mini-app source'));
  miniApp.conceptTopicIds.forEach(id => {
    exists(topics, id, 'Unknown app concept');
    assert(topics.get(id).miniAppIds.includes(miniApp.id), `Missing topic backlink: ${id}`);
    assert(chapters.get(topics.get(id).chapterId).miniAppIds.includes(miniApp.id));
  });
  miniApp.prerequisiteTopicIds.forEach(id => exists(topics, id, 'Unknown mini-app prerequisite'));
  miniApp.relatedIdeaIds.forEach(id => assert(ideas.some(idea => idea.id === id), `Missing related idea: ${id}`));
  ordered(miniApp.steps, `${miniApp.id} step`);
  if (miniApp.languageCode === 'jsx') parse(miniApp.finalCode, { sourceType: 'module', plugins: ['jsx'] });
  else if (miniApp.languageCode === 'js') parse(miniApp.finalCode, { sourceType: 'module' });
  else {
    assert.equal(miniApp.languageCode, 'html', `Unsupported mini-app language: ${miniApp.id}`);
    assert(/<!doctype html>/i.test(miniApp.finalCode) && /<main[\s>]/i.test(miniApp.finalCode) && /<form[\s>]/i.test(miniApp.finalCode), `Incomplete HTML mini app: ${miniApp.id}`);
  }
  snippetCount++;
}
for (const idea of ideas) idea.conceptTopicIds.forEach(id => exists(topics, id, 'Unknown idea topic'));
assert.equal(interviewLibrary.status, 'source-import');
assert.equal(interviewLibrary.questions.length, 253, 'Expected 223 imported and 30 reviewed advanced interview entries');
const importedSources = unique(interviewLibrary.sources, 'interview PDF source');
const categoryIds = new Set(interviewLibrary.categories.map(category => category.id));
for (const question of interviewLibrary.questions) {
  exists(importedSources, question.sourceId, 'Unknown interview PDF source');
  assert(categoryIds.has(question.category), `Unknown interview category: ${question.category}`);
  assert(question.question && question.answer, `Imported interview entry is incomplete: ${question.id}`);
  const questionSource = importedSources.get(question.sourceId);
  if (questionSource.kind === 'pdf-import') {
    assert.equal(question.reviewStatus, 'imported-unverified');
    assert(question.sourcePages.length > 0 && question.sourcePages.every(page => Number.isInteger(page) && page > 0));
  } else {
    assert.equal(question.reviewStatus, 'curated-reviewed');
    assert(['Advanced', 'Tricky'].includes(question.difficulty));
    assert(question.references.length > 0 && question.references.every(url => /^https:\/\//.test(url)));
  }
}
assert.deepEqual(interviewLibrary.questions.filter(question => question.sourceId === 'frontend-pdf').map(question => question.sourceQuestionNumber), Array.from({ length: 200 }, (_, index) => index + 1));
assert.deepEqual(interviewLibrary.questions.filter(question => question.sourceId === 'react-pdf').map(question => question.sourceQuestionNumber), Array.from({ length: 23 }, (_, index) => index + 1));
for (const source of interviewLibrary.sources) {
  const count = interviewLibrary.questions.filter(question => question.sourceId === source.id).length;
  if (source.kind === 'pdf-import') {
    assert.equal(count, source.importedEntryCount);
    assert(/^[a-f0-9]{64}$/.test(source.sha256), `Invalid PDF hash: ${source.id}`);
  } else {
    assert.equal(count, source.entryCount);
    assert(/^https:\/\//.test(source.url));
  }
}
assert.equal(dsaPractice.problems.length, 20, 'Expected 20 DSA sprint problems');
assert.equal(dsaPractice.intro.estimatedMinutes + dsaPractice.problems.reduce((total, problem) => total + problem.estimatedMinutes, 0), 120, 'DSA sprint must total 120 minutes');
unique(dsaPractice.problems, 'DSA problem');
ordered(dsaPractice.problems, 'DSA problem');
assert(dsaPractice.intro.terms.length >= 10 && dsaPractice.intro.patternSignals.length >= 8, 'DSA intro is incomplete');
const dsaConcepts = unique(dsaPractice.concepts, 'DSA concept');
assert(dsaConcepts.size >= 15, 'DSA concept reference is incomplete');
for (const problem of dsaPractice.problems) {
  assert(['Easy', 'Medium'].includes(problem.difficulty), `Unsupported DSA difficulty: ${problem.id}`);
  assert(problem.prompt && problem.examples.length && problem.beforeCoding.length >= 3, `Incomplete DSA prompt: ${problem.id}`);
  assert(/^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/description\/$/.test(problem.reference.url), `Invalid LeetCode URL: ${problem.id}`);
  for (const approach of [problem.basic, problem.advanced]) {
    assert(approach.idea && approach.steps.length >= 3 && approach.time && approach.space, `Incomplete DSA approach: ${problem.id}`);
    parse(approach.code, { sourceType: 'module' });
    snippetCount++;
  }
  assert(problem.dryRun.length >= 2 && problem.mistakes.length >= 2 && problem.finishCheck.length >= 3, `Incomplete DSA practice support: ${problem.id}`);
  assert(problem.conceptIds.length >= 2, `Missing DSA concept links: ${problem.id}`);
  problem.conceptIds.forEach(id => exists(dsaConcepts, id, 'Unknown DSA concept'));
}
assert.equal(app.finalCode, examples.get('quantity-picker').code);
assert.equal(typeof lesson.publicationChecklist.browserBehaviorChecked, 'boolean');
console.log(`PASS: ${chapters.size} chapters, ${topics.size} topics, ${coverage.items.length} coverage mappings.`);
const exerciseCount = authoredLessons.reduce((total, candidate) => total + candidate.practice.length, 0);
const lessonInterviewCount = authoredLessons.reduce((total, candidate) => total + candidate.interviewQuestions.length, 0);
console.log(`PASS: ${exerciseCount} lesson exercises, ${lessonInterviewCount} lesson interview questions, ${snippetCount} code snippets checked.`);
console.log(`PASS: ${lessonFiles.length} authored lesson JSON file(s) match the shared topic schema.`);
console.log(`PASS: ${miniApps.length} mini app(s) have valid sources, concept backlinks, steps, ideas, and complete code.`);
console.log(`PASS: ${interviewLibrary.questions.length} interview entries: 223 PDF imports and 30 reviewed advanced questions.`);
console.log(`PASS: ${dsaPractice.problems.length} DSA problems plus ${dsaConcepts.size} linked concept references form a ${dsaPractice.sprintMinutes}-minute sprint.`);
console.log(`PASS: ${renderedModules} complete modules rendered with React on the server; initial quantity and boundary controls checked.`);
console.log('Browser behavior, independent editorial review, and learner trial remain pending.');
