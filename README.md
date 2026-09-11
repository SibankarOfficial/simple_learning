# Simple Learning

A standalone React learning app with a minimal interface, an ordered syllabus, practice records, mini apps, and explicit coverage gaps. All app content uses simple, clear English.

## Run locally

Use Node 24.11 or newer (tested with Node 24.14), or Node 22.18+ within the Node 22 release line. This matches the installed content parser's requirements. From this directory:

```text
npm ci
npm run dev
```

Open [Simple Learning](http://127.0.0.1:5173/). The development server uses port 5173 and fails clearly if that port is occupied. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

```text
npm run build
npm run preview
```

The production build is in `dist/`. Preview it at [port 4173](http://127.0.0.1:4173/). Hash-based page links work when `dist/` is served from a static host, including a subdirectory. Serve the files over HTTP; do not open `index.html` directly from disk.

React, React DOM, Vite, and the validator's dependencies are declared in this project's own package manifest and lockfile. No ERP files, dependencies, servers, or build scripts are needed. The setup follows the [React build-from-scratch guide](https://react.dev/learn/build-a-react-app-from-scratch) and [Vite guide](https://vite.dev/guide/).

## Available now

- Subject → chapter → topic pages, with 30 chapters and 324 catalog topics. **323 topics are planned; one useState lesson is a sample draft. No lesson is marked published.**
- The useState reader includes prerequisite checks, core/deeper/reference explanations, 11 examples, mistakes, 10 exercises with optional hints and solution modals, and 12 original interview-style questions.
- Every complete React module can open in an editable live preview. Each run creates a fresh sandbox with network and app-storage access blocked. Learners write a prediction, change App.jsx, run it, compare the result, and reset to the authored example.
- Saved drafts, attempts, assistance records, self-review, and written mastery evidence. There is no automatic mastery award or code grading.
- Spaced review at 1, 3, 7, and 14 days after the first submitted attempt. Each session opens after its time gap and offers two fresh useState prediction problems with explained feedback.
- A six-step quantity-picker mini app, a built-in interactive demonstration, concept links, acceptance criteria, and two independent build ideas.
- Coverage pages for 117 official-source mappings, review dates, scope exclusions, and seven pending audits.

The application has loading, missing-content, invalid-data, and retry states. Browser storage failures show a warning; unreadable existing progress is preserved rather than overwritten.

## Content language

Use English only for lessons, questions, hints, solutions, project instructions, and UI text. Use short sentences and familiar words. Explain a technical term when it first appears, and keep API names accurate. Do not use Banglish or mix languages in app content. Set the content language to `en`; code language fields such as `jsx` stay separate.

## Review these first

- [Append-only project journal](docs/PROJECT-JOURNAL.md)
- [Project handoff and recovered decisions](docs/PROJECT-HANDOFF.md)
- [Ordered syllabus](docs/SYLLABUS.md)
- [Complete useState sample](docs/USESTATE.md)
- [Step-by-step mini app](docs/MINI-APP.md)
- [Coverage and remaining audits](docs/COVERAGE.md)

## Product agreement

Subject → chapter → topic. Every published topic needs prerequisites, what/why/how, syntax variations with tradeoffs, practical code examples, common mistakes, 5–10 meaningful exercises with hints and explained solutions, interview preparation, linked mini apps, and mastery checks. Solutions open in a modal after an attempt is saved. A solution reveal records assistance, never mastery.

Mini apps have steps, concept links, acceptance scenarios, and related independent build ideas. Topic and chapter pages link back to those apps. Bug-fixing gets a dedicated chapter section later; the sample already includes diagnostic exercises. Larger projects, AI, authentication, and database storage are later milestones.

The minimal learning UI and a focused React example runner are implemented. The runner supports the React imports used by the lesson; it does not install packages, run backend code, grade answers, or save editor changes. The interactive quantity picker remains a separate built-in demonstration. Full lesson browser verification, independent content review, and learner trials remain pending.

## Content model

`content/react/curriculum.json` is the ordered subject/chapter/topic catalog. `coverage.json` maps known official reference items to topic IDs. `sources.json` records URLs and review dates. Topic lessons, mini apps, and independent ideas use stable IDs. These JSON files are the source of truth; the Markdown documents are generated review copies.

Paths inside curriculum are relative to `content/react/`. The frontend fetches the subject manifest, catalog, source list, and selected content from `content/`. Vite serves the authored JSON directly in development; the build includes identical JSON paths and files in `dist/content/`. No manually maintained second content copy is needed.

Register another subject in `content/subjects.json` and add its content directory using the same contract. Review sessions and their explained problems live inside each lesson JSON, so new topics do not depend on useState-specific review code. Keep learner attempts/progress separate from authored content so a future database migration does not alter lesson structure.

## Local practice records

Progress uses `localStorage` under `simple-learning.progress.v1`. Records are scoped by subject, topic, and exercise. Attempts store the answer, explanation, submission time, help viewed before submission, learner confirmation of independent work, self-review outcome, and review time. A saved submission is immutable; new attempts preserve assistance history. Only explicitly self-confirmed attempts without prior hints or solutions can count toward the displayed independent exercise count, and only after self-review. Opening a solution does not rewrite an earlier saved answer or grant mastery.

New attempts after help has been viewed remain assisted. The quantity picker's complete-code reveal also records help for matching exercises p07 and p10. Evidence and review outcomes are self-reported and not independently verified. All records stay in this browser and origin; another browser, port, or hostname has separate progress. Clearing browser data removes it. There is no account sync or backend.

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
npm test
npm run validate:content
npm run docs:generate
npm run preview:runtime
```

Validation checks references, order, prerequisites, mapping consistency, the shared lesson schema, exercise/solution links, interview provenance, review sessions, and JSX syntax. It also renders complete examples using React on the server and checks the mini app's initial quantity, total, and boundary controls. Browser interactions are checked separately.

The focused tests cover subject registration, planned-content status, route parsing, immutable attempt records, independence/assistance rules, storage recovery, draft recovery, and JSON-driven review scheduling. The build also runs content validation. Browser checks cover lesson rendering, the first live example's run/edit/error/reset flow, and the built-in quantity picker's limits, reset, and keyboard activation. They do not certify every lesson example or the full app. See the handoff for remaining checks.

`npm run preview:runtime` builds the self-contained browser compiler and React runtime used by sandboxed examples. `npm run dev` and `npm run build` run it automatically. The generated `public/preview-runtime.js` is ignored because it is reproducible from the locked dependencies.

At each content release, revisit the official source indexes, review changed/new APIs, update the inventory and version notes, then validate and regenerate these review documents. There is no recurring automation configured.

After every meaningful work session, append a dated entry to `docs/PROJECT-JOURNAL.md`. Keep older entries unchanged. The newest entry must explain the final behavior, architecture and flow changes, packages, important files, solved issues, checks, alternatives, remaining risks, and next starting point.
