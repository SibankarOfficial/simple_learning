import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'content/react', name), 'utf8'));
const catalog = read('curriculum.json');
const coverage = read('coverage.json');
const lesson = read('lessons/use-state.json');
const app = read('mini-apps/quantity-picker.json');
const ideas = read('ideas.json');
const sources = new Map(read('sources.json').map(source => [source.id, source]));
const topics = new Map(catalog.topics.map(topic => [topic.id, topic]));
const examples = new Map(lesson.examples.map(example => [example.id, example]));
const cite = ids => [...new Set(ids)].map(id => {
  const source = sources.get(id);
  return `[${source.title}](${source.url})`;
}).join(', ');
const bullets = items => items.map(item => `- ${item}`).join('\n');
const code = value => `\n\`\`\`jsx\n${value}\n\`\`\`\n`;
const note = 'Generated from the JSON content. Edit JSON, then regenerate. Content review date: 2026-09-10.';
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
const save = (name, parts) => fs.writeFileSync(path.join(root, 'docs', name), parts.join('\n\n') + '\n');

const syllabus = [
  '# React syllabus — ordered coverage draft', note,
  `${catalog.chapters.length} chapters · ${catalog.topics.length} topics · 1 authored sample lesson. Listed topics are not completed lessons.`,
  'Your learning path: prerequisites → components/props/events → state → forms/reducers/refs/effects → reusable logic/data/routing → performance/actions → server/tooling → production/legacy. Start a mini app once you understand its required concepts. You can build the first mini app after useState; you do not need to wait until chapter 29.',
  'Core topics are broad coverage; ecosystem topics are a selected practical track. Reference and version-watch topics are later-depth material. A prerequisite means conceptually needed, not that its lesson is already written.',
  '## Chapter overview',
  '| Order | Chapter | Track | Topics |\n| --- | --- | --- | --- |\n' + catalog.chapters.map(ch => `| ${ch.order} | ${ch.title} | ${ch.track} | ${ch.topicIds.length} |`).join('\n')
];
for (const chapter of catalog.chapters) {
  syllabus.push(`## ${chapter.order}. ${chapter.title}`);
  syllabus.push(`Level: ${chapter.level}. Track: ${chapter.track}. Prerequisites: ${chapter.prerequisiteChapterIds.join(', ') || 'none'}.`);
  syllabus.push(chapter.topicIds.map(id => {
    const topic = topics.get(id);
    return `${topic.order}. ${topic.title}${id === 'use-state' ? ' — [sample lesson](USESTATE.md)' : ''} (${topic.contentStatus})`;
  }).join('\n'));
  const sourceIds = [...new Set(chapter.topicIds.flatMap(id => topics.get(id).sourceIds))];
  syllabus.push(sourceIds.length ? `Scope sources: ${cite(sourceIds)}.` : 'Specialist official sources: pending review before lesson authoring.');
  if (chapter.miniAppIds.length) syllabus.push('Linked mini app: [Notebook quantity picker](MINI-APP.md).');
}
syllabus.push('## Coverage policy', 'See [coverage mappings and open audits](COVERAGE.md). The reference inventory is a dated scope baseline, not a guarantee of all possible applications of React.');
save('SYLLABUS.md', syllabus);

const lessonDoc = [
  `# ${lesson.title}`, note,
  'React → Hooks: foundations and useState → useState',
  `Status: ${lesson.status}. ${lesson.runtime}`,
  'Read the core sections first. Return to the deeper and reference sections later. You do not need to memorize every variation at once.',
  '## Outcome', bullets(lesson.objectives.map(x => x.text)),
  '## Prerequisite check'
];
for (const item of lesson.diagnostic) lessonDoc.push(`**${item.question}**\n\n${item.answer}\n\nIf you need help, review: ${topics.get(item.ifMissed).title}.`);
lessonDoc.push('## Learning flow', lesson.learningFlow.map((x, i) => `${i + 1}. ${x}`).join('\n'));
for (const section of lesson.sections) {
  lessonDoc.push(`## ${section.title} · ${section.depth}`, section.body, `Reference: ${cite(section.sourceIds)}.`);
  for (const id of section.exampleIds) {
    const example = examples.get(id);
    lessonDoc.push(`### ${example.title}`, code(example.code), example.explanation, `Try: ${example.tryThis}`);
  }
}
lessonDoc.push('## Common mistakes', '| Symptom | Cause | Fix |\n| --- | --- | --- |\n' + lesson.commonMistakes.map(x => `| ${x.symptom} | ${x.cause} | ${x.fix} |`).join('\n'));
lessonDoc.push('## Practice — attempt before solution', 'Hints are optional. Write your prediction or plan first. After reading a solution, solve the problem again in a blank file. Expand a solution below to review it. In the future app, solutions will open in a modal.');
for (const exercise of lesson.practice) {
  lessonDoc.push(`### ${exercise.id}: ${exercise.type} · ${exercise.difficulty}`, exercise.prompt,
    '**Acceptance criteria**\n\n' + bullets(exercise.acceptanceCriteria),
    '<details>\n<summary>Hints</summary>\n\n' + bullets(exercise.hints) + '\n\n</details>');
  const solution = exercise.solution;
  const example = solution.exampleId ? examples.get(solution.exampleId) : null;
  lessonDoc.push('<details>\n<summary>Solution and reasoning</summary>\n\n' + solution.explanation +
    (solution.code ? code(solution.code) : example ? code(example.code) : '') +
    `\n\nReference: ${cite(exercise.sourceIds)}.\n\n</details>`);
}
lessonDoc.push('## Mini app', '[Build the notebook quantity picker step by step](MINI-APP.md). Then build the related seat picker or reading target on your own.');
lessonDoc.push('## Mastery check', lesson.mastery.policy);
for (const check of lesson.mastery.checks) lessonDoc.push(`**${check.evidence}**\n\nPass evidence: ${check.pass}`);
lessonDoc.push('Suggested revisit days: ' + lesson.mastery.reviewSchedule.dayOffsets.join(', ') + '. ' + lesson.mastery.reviewSchedule.note);
lessonDoc.push('## Interview preparation', 'These are original interview-style questions. They are not presented as recorded questions from any particular company.');
for (const question of lesson.interviewQuestions) lessonDoc.push(`### ${question.id}: ${question.question}`, question.answer, `Follow-up: ${question.followUp}\n\nReference: ${cite(question.sourceIds)}.`);
lessonDoc.push('## Publication checks', bullets(Object.entries(lesson.publicationChecklist).filter(([key]) => key !== 'note').map(([key, value]) => `${key}: ${value ? 'done' : 'pending'}`)), lesson.publicationChecklist.note);
save('USESTATE.md', lessonDoc);

const appDoc = [`# Mini app: ${app.title}`, note, app.goal, '## Concepts used', bullets(app.conceptTopicIds.map(id => topics.get(id).title)), '## Acceptance requirements', bullets(app.requirements)];
for (const step of app.steps) appDoc.push(`## Step ${step.order}: ${step.title}`, step.task, ...(step.code ? [code(step.code), 'These are incremental fragments inside the React module; use the complete module below when running the final app.'] : []), `Why: ${step.reason}\n\nCheck: ${step.check}`);
appDoc.push('## Complete App.jsx', code(app.finalCode), '## Check behavior', '| Given | When | Then |\n| --- | --- | --- |\n' + app.acceptanceScenarios.map(x => `| ${x.given} | ${x.when} | ${x.then} |`).join('\n'), '## Related independent ideas');
for (const idea of ideas) appDoc.push(`### ${idea.title}`, idea.brief, bullets(idea.acceptanceCriteria));
appDoc.push('## Extend after the base works', bullets(app.extensions), `References: ${cite(app.sourceIds)}.`, '[Return to useState](USESTATE.md). Browser acceptance scenarios are authored; they have not been executed yet.');
save('MINI-APP.md', appDoc);

const coverageDoc = ['# React coverage audit', note, coverage.method,
  `${coverage.items.length} source inventory items have syllabus destinations. ${catalog.topics.filter(t => t.contentStatus === 'sample-draft').length} topic has an authored sample; remaining lesson content is planned.`,
  '## Open audits', ...coverage.openAudits.map(x => `- **${x.id} (${x.status}):** ${x.detail}`),
  '## Source → topic mappings',
  '| Category | Source item | Topic destination | Content |\n| --- | --- | --- | --- |\n' + coverage.items.map(item => `| ${item.category} | [${item.name}](${sources.get(item.sourceId).url}) | ${item.topicIds.map(id => topics.get(id).title).join(', ')} | ${item.contentStatus} |`).join('\n'),
  '## Explicit scope exclusions', bullets(coverage.excludedScope),
  '## Maintenance', coverage.updatePolicy,
  '## Source registry', bullets([...sources.values()].map(source => `[${source.title}](${source.url}) — reviewed ${source.accessedAt}`))
];
save('COVERAGE.md', coverageDoc);
console.log('Generated SYLLABUS.md, USESTATE.md, MINI-APP.md, and COVERAGE.md.');
