# React learning app — first milestone

The app foundation includes an ordered syllabus, a coverage map, and a complete useState sample lesson. All app content uses simple, clear English.

## Content language

Use English only for lessons, questions, hints, solutions, project instructions, and UI text. Use short sentences and familiar words. Explain a technical term when it first appears, and keep API names accurate. Do not use Banglish or mix languages in app content. Set the content language to `en`; code language fields such as `jsx` stay separate.

## Review these first

- [Ordered syllabus](docs/SYLLABUS.md)
- [Complete useState sample](docs/USESTATE.md)
- [Step-by-step mini app](docs/MINI-APP.md)
- [Coverage and remaining audits](docs/COVERAGE.md)

## Product agreement

Subject → chapter → topic. Every published topic needs prerequisites, what/why/how, syntax variations with tradeoffs, practical code examples, common mistakes, 5–10 meaningful exercises with hints and explained solutions, interview preparation, linked mini apps, and mastery checks. Solutions will open in a modal in the later UI. A solution reveal records assistance, never mastery.

Mini apps have steps, concept links, acceptance scenarios, and related independent build ideas. Topic and chapter pages link back to those apps. Bug-fixing gets a dedicated chapter section later; the sample already includes diagnostic exercises. Larger projects, AI, authentication, and database storage are later milestones.

The first milestone is content and review documents. The learning UI, code runner, solution modal, and progress persistence are not implemented yet. The existing ERP application is not the learning application.

## Content model

`content/react/curriculum.json` is the ordered subject/chapter/topic catalog. `coverage.json` maps known official reference items to topic IDs. `sources.json` records URLs and review dates. Topic lessons, mini apps, and independent ideas use stable IDs. These JSON files are the source of truth; the Markdown documents are generated review copies.

Paths inside curriculum are relative to `content/react/`. For the eventual frontend, serve that directory as a static content base and fetch the catalog, then fetch a selected topic's non-null `lessonPath`. Handle loading, missing files, invalid data, and network failures explicitly. Never make a planned topic look like a completed lesson.

Adding another subject means another subject directory and catalog using the same contract. Keep learner attempts/progress separate from authored content so a future database migration does not alter lesson structure. Reserve attempt fields: learnerId, topicId, exerciseId, submittedAt, hintsUsed, solutionViewed, outcome, explanation, reviewedAt.

## Status and quality rules

- `planned`: syllabus destination only; no lesson exists.
- `sample-draft`: authored for review; publication checks remain.
- `published`: use only after content review, behavior verification, source/version review, and accessibility review of its UI.
- `index-mapped` is a scope check. It does not mean every API subpage or caveat has been reviewed.
- `original-interview-style` questions are authored exercises. A recorded interview question requires a public source, date, and honest attribution; never invent company names.
- Mastery requires explanation, independent solving, transfer to a fresh problem, and delayed recall. The proposed threshold is a product rubric, not a scientific guarantee.

The scope is React for the web, prerequisites, official API families, selected ecosystem skills, legacy migration, and version-sensitive extensions. React has no finite official list of every possible use case. New source items must receive a destination or a documented scope decision. Lesson-level caveat audits remain necessary.

## Verification and maintenance

From the repository root:

```text
node learning-app/scripts/validate-content.mjs
node learning-app/scripts/render-docs.mjs
```

Validation checks references, order, prerequisites, mapping consistency, required sample sections, exercise/solution links, and JSX syntax. It also renders complete examples using React on the server and checks the mini app's initial quantity, total, and boundary controls. It does not execute browser interactions. No dependencies are added and no ERP build is needed for this content-only milestone.

At each content release, revisit the official source indexes, review changed/new APIs, update the inventory and version notes, then validate and regenerate these review documents. There is no recurring automation configured.
