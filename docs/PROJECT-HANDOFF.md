# Simple Learning project handoff

Updated: 2026-09-20. This document records product decisions and the current work state. It is maintained by hand; the other four review documents are generated from JSON.

## Start here next time

Work only in `C:\Users\siban\Documents\GitHub\simple_learning`. Do not modify the REAle ERP project. Read this file, `README.md`, the review documents in `docs/`, and the JSON in `content/react/` before continuing.

Conversation with the user is in Banglish. Every part of the application must use simple, understandable English, including lessons, questions, hints, solutions, mini-app instructions, and interface text. Keep API names accurate and explain unfamiliar terms.

The user supplied their earlier messages and the accepted reply after recovery. They match the decisions below. Work then resumed on the previously requested minimal React UI. The standalone setup and first UI implementation are now present; continue from them rather than recreating the project.

## Recovered history and its limits

Source task: **Clarify Bengali plan**, ID `01a08c47-5b3c-79d1-b283-bf09501d8c02`.

The task history was read with `read_thread`, including the oldest available conversation. The response returned seven turns with `hasMore: false` and no next cursor. The latest two turns contained no available items, so their messages cannot be reconstructed. Do not invent decisions from them. Current user instructions and the files in this project take priority over older descriptions.

Recovered sequence:

1. The user described repeated difficulty learning React from videos and wanted a more effective path to independent application.
2. The agreed learning loop was: learn a small amount, try without copying, get feedback, correct mistakes, and revisit after a gap.
3. The user proposed a React-first learning product with a minimal interface, detailed topic lessons, meaningful exercises, interview preparation, and linked mini apps.
4. The assistant added coverage tracking, active learning, and evidence-based progress. The user explicitly accepted these additions and authorized the first content milestone.
5. The first milestone produced a syllabus, coverage map, useState sample, and quantity-picker mini app as JSON and review documents.
6. The user then explicitly required simple English throughout the app. Current files contain the English version. The earlier final message describing Banglish lesson content is superseded.

Planning originally happened under the ERP task by mistake. That location is historical context only. This repository is now the only implementation workspace.

## Product decisions

- Start with React. Allow more subjects later through the same content structure.
- Organize pages as subject → chapter → topic. Example: React → Hooks → useState.
- Keep the UI minimal. Prioritize accurate content, clear explanations, and effective learning.
- Each published topic needs prerequisites, what/why/how, when to use it and when not to, syntax variations with meaningful differences, practical examples, common mistakes, 5–10 meaningful exercises, optional hints, explained solutions in a modal, and interview questions.
- Exercises should include prediction, building, debugging, and explaining decisions. They should develop reasoning rather than inflate question counts.
- Mini apps need step-by-step instructions, reasons, checks, concept links, acceptance scenarios, and related ideas to build independently. Link them from subject, chapter, and relevant topic pages. Learners need not wait until the mini-app progression chapter to build one.
- Include independent practice, feedback, spaced review, transfer to new problems, and mastery checks. Reading, opening a solution, or revealing hints must not grant mastery.
- Track official documentation coverage and missing material explicitly. A mapped source is not a completed lesson or a full caveat audit.
- Interview-style questions are acceptable with honest labels. Recorded interview provenance needs a public source and date. Never invent company names or imply that all historical interview questions are covered. Imported PDF wording remains `imported-unverified` until checked against official sources; the supplied document proves presence in the PDF, not company provenance or current accuracy.
- Do not promise guaranteed mastery or coverage of every possible React use case. Maintain an explicit scope and update it as sources change.
- Use JSON initially. Database storage, authentication, AI, larger projects, and dedicated chapter bug-fixing sections come later. Diagnostic exercises may exist now.

## Current foundation

Verified from the local JSON during recovery:

| Item | Current state |
| --- | --- |
| Chapters | 30 |
| Topics | 324 total: 317 planned, 7 sample drafts |
| Published lessons | 0 |
| Authored lessons | All 6 Web foundations topics plus `use-state` |
| Web foundations content | 6 lessons, 30 exercises, 18 original interview-style questions, 12 examples, mastery checks, and 2/7-day reviews |
| useState sections | 17, divided into core, deeper, and reference depth |
| useState examples | 11 |
| useState exercises | 10 |
| Lesson interview questions | 30 total: 18 in Web foundations plus 12 in useState |
| Top-level interview library | 253 entries: 223 preserved PDF imports plus 30 reviewed advanced/tricky questions with authoritative references |
| DSA interview sprint | Available as a separate module: 10-minute intro, 18 shared concept references, 20 easy/medium problems, 120 minutes total, and 40 tested JavaScript solutions |
| Mini apps | Notebook quantity picker (6 steps) and accessible course signup page (8 steps), both sample drafts |
| Independent ideas | 4: cinema seats, reading target, event registration, and support request form |
| Coverage mappings | 130 total; Web foundations mappings point to reviewed MDN pages |
| Learning UI | Implemented: subject/chapter/topic navigation, lesson sections, mini apps, review, interview library, and coverage |
| Solution modal | Implemented with a native dialog, close button, Escape handling, and focus restoration; complete interaction QA pending |
| Code runner | Implemented for complete React examples with an isolated preview; the built-in quantity-picker demo is separate |
| Learner progress persistence | Browser-local drafts, immutable attempts, assistance, self-review, review sessions, and written evidence |

The 324 topics are the current catalog, not 324 available lessons. Seven lessons are currently available as sample drafts. The remaining 317 topics still show a planned-content page.

The syllabus progresses through web and JavaScript foundations, setup, components, props, rendering/events, Hooks/state, forms, reducers/context, refs, effects, custom Hooks, data/routing, performance, Actions, DOM, advanced/server rendering, Server Components, Compiler/lint, TypeScript/testing/production, legacy migration, version watch, mini apps, and later larger projects. Core, prerequisite, ecosystem, tooling, legacy, and version-sensitive scope remain distinct.

## Source of truth and data contract

- `content/react/curriculum.json`: subject metadata, ordered chapters and topics, prerequisite links, content status, lesson paths, mini-app links, source IDs, and version notes.
- `content/react/lessons/*.json`: seven authored lessons with objectives, diagnostics, learning flow, sections, examples, mistakes, practice/solutions, mastery rubrics, interviews, and publication checks.
- `content/react/mini-apps/*.json`: the React quantity picker and HTML/CSS course-signup projects with requirements, steps, concept links, final code, acceptance scenarios, related ideas, and verification flags.
- `content/react/ideas.json`: four independent build briefs and acceptance criteria; no supplied solutions.
- `content/react/sources.json`: source registry with URLs and recorded review dates.
- `content/react/coverage.json`: source-to-topic mappings, open audits, exclusions, and update policy.
- `content/react/interview-questions.json`: 223 PDF-imported entries plus 30 reviewed advanced/tricky entries with stable IDs, categories, answers, examples/tips, difficulty, PDF or web sources, official verification links, and explicit review status.
- `content/dsa/practice.json`: standalone DSA sprint with intro terms, 18 reusable concept explanations, pattern signals, interview script, 20 ordered problems, concept IDs, basic and better solutions, complexity, dry runs, mistakes, practice checks, and LeetCode references.
- `scripts/render-docs.mjs`: generates `docs/SYLLABUS.md`, `docs/USESTATE.md`, `docs/MINI-APP.md`, `docs/MINI-APPS.md`, and `docs/COVERAGE.md`. It derives lesson and mini-app counts from the registries. Edit JSON before regenerating these files.
- `scripts/validate-content.mjs`: validates relationships, order, prerequisites, example syntax, exercise links, provenance rules, and server-rendered examples.

Paths in the catalog are relative to `content/react/`. The existing README calls for fetching the catalog, then the selected topic's non-null `lessonPath`, from a served content base. Handle loading, missing files, invalid data, and request failures. Preserve stable IDs and allow another subject directory to follow the same contract.

Learner attempts are separate from authored JSON in versioned browser storage. Fields include `learnerId`, `topicId`, `exerciseId`, `submittedAt`, `hintsUsed`, `solutionViewed`, `outcome`, `explanation`, and `reviewedAt`, plus an immutable answer snapshot, attempt ID, and `selfReportedIndependent`. Records are keyed by subject/topic/exercise. No backend, database, authentication, or account synchronization is implemented.

Content states:

- `planned`: a syllabus destination with no lesson.
- `sample-draft`: authored content available for review, with unfinished publication checks.
- `published`: only after content, source/version, browser behavior, and UI accessibility review.
- `index-mapped`: source scope has a destination; it does not certify all page sections or caveats.

## Learning and verification rules to preserve

The sample mastery rubric asks for explanation without notes; at least 8 independent exercises including p03, p05, p06, and p10; an independent seat-picker build; and delayed work on fresh problems. An attempt after viewing its solution does not count as independent. Do not replace this with a page-completed checkbox or automatically certify pasted code. If initial feedback is learner self-assessment, label it honestly.

Suggested review offsets in JSON are 1, 3, 7, and 14 days. They are an adjustable starting schedule, not a scientifically validated guarantee. The first submitted attempt starts the schedule; upcoming sessions stay closed until their due time according to the device clock. Each session offers two fresh prediction problems and explained feedback, followed by self-review. The sessions now live in each topic lesson JSON and are required by the shared schema. Scheduling or submitting a review does not certify mastery.

The quantity picker starts at 1, stays between 1 and 5, uses unit price 120, derives total from quantity, disables controls at limits, and resets to 1. Its acceptance scenarios include keyboard operation. Independent variations are seats from 1–8 at 250 each and a reading target from 5–60 in steps of 5, resetting to 10.

Local content validation passes for 7 lesson files, 40 exercises, 30 lesson interview questions, 86 code snippets, 2 mini apps, and 130 coverage mappings. Fourteen complete React modules render on the server. Full browser behavior, independent content review, and learner trials remain pending, so no lesson is published.

## Standalone setup audit

At recovery this directory had no manifest, dependencies, or frontend. It now has its own `package.json`, `package-lock.json`, installed dependencies, `index.html`, `src/`, tests, and `vite.config.js`. No `AGENTS.md` or `.openai/hosting.json` exists. Work stays local in the requested repository; no hosted Site was registered or deployed.

Node v24.14.0 and npm 11.9.0 are available on this machine. The initial missing-parser error is fixed. Exact installed versions are React/React DOM 19.3.0, Vite 8.3.0, React plugin 6.1.1, Babel parser 8.0.5, and esbuild 0.28.2. They belong to this repository. The declared Node range is `^22.18.0 || >=24.11.0`, matching Babel parser's stricter runtime requirement. No ERP packages or scripts are used. Preserve the lockfile; use `npm ci` for a clean installation.

Both existing scripts resolve files relative to their own module location. Their relocated paths and dependency documentation are corrected. The documentation renderer uses only Node built-ins. The validator now checks the type of the browser-verification flag instead of requiring it to remain false forever. The solution-modal note and document generator reflect the implemented UI, while publication flags remain honest.

## Implemented UI and commands

- `src/App.jsx`: subject selection, curriculum, chapters, planned-topic pages, and hash routes.
- `src/Lesson.jsx`: Learn, Examples, Practice, Mastery check, and Interview views, with lesson data fetched on demand.
- `src/MiniApps.jsx`: JSON-driven mini-app list and reader for React or HTML projects, concept links, independent ideas, and the quantity demo.
- `src/Coverage.jsx`: source mappings, recorded dates, missing content, and pending audits.
- `src/Review.jsx`: evidence notes and delayed practice sessions read from each lesson JSON.
- `src/InterviewQuestions.jsx`: top-level searchable interview library with category, review-status, and source filters; questions progress from foundation/unlabeled through intermediate and advanced to tricky, while reviewed questions expose technical verification links.
- `src/DsaPractice.jsx`: DSA overview, intro, centralized concept page with exact-section routes, 20 linked inner problem pages, collapsed solutions, complexity comparison, and previous/next navigation.
- `src/progress.js` and `src/ProgressContext.jsx`: immutable attempts, assistance history, learner confirmation, self-review, storage recovery, and review dates.
- `src/components.jsx`: native solution dialog, code display/copy, source links, statuses, and error/loading states.
- `src/CodePlayground.jsx` and `src/preview/runner.jsx`: editable examples with prediction, Run, Reset, isolated output, and simple compile/render errors. Every run creates a fresh sandbox. Its content policy blocks network requests and access to the parent app or its storage. The runner supports the lesson's React imports and no extra packages.
- `schema/topic-lesson.schema.json` and `docs/TOPIC-AUTHORING.md`: the reusable lesson contract and human authoring checklist. All authored lessons are validated against the schema; catalog and lesson status, subject, and chapter must agree. A published lesson fails validation while any publication check remains pending.
- `content/subjects.json`: extensible subject registry. Vite serves authored JSON in development and emits the same content paths in the production build.

Commands from the project root:

```text
npm ci
npm run dev
npm test
npm run build
npm run preview
npm run docs:generate
npm run preview:runtime
```

Use `npm.cmd` on Windows if needed. Development uses `http://127.0.0.1:5173/`; production preview uses port 4173. Both ports are strict to avoid silently moving to another app's server. The current development process was launched for local review; verify whether it is still running when resuming.

## Verification and remaining work

- Fourteen focused automated checks pass for manifests, planned content, routes, the DSA sprint contract, independence/assistance, saved answer immutability, storage recovery, retry drafts, and JSON-driven delayed review problems/dates.
- A standalone production build passes and contains the authored JSON; content validation passes without the ERP project.
- Interview-library validation checks 253 unique entries, PDF hashes/counts/page sequences, web source counts, categories, review status, difficulty, and authoritative URLs for all 30 reviewed advanced questions.
- The local development URL returned HTTP 200. A Codex preview opening was requested (tool reported queued); the user's existing Chrome Simple Learning tab was then available and used for limited checks.
- The lesson renders with the expected English sections and prerequisite/draft labels. Desktop mini-app layout was visually inspected. Quantity 1/120, four increases to 5/600, disabled upper control, four decreases to 1/120, reset from 4, and keyboard activation of Increase were observed in the browser.
- The first live example was checked in Chrome: it rendered at Count 0, updated to Count 1, accepted an edited initial value and increment, showed a useful invalid-JSX error, and Reset restored the authored code and Count 0. The preview runtime needed an explicit production environment replacement; that issue is fixed in `vite.preview.config.js`.
- The global interview page was checked in Chrome: the top navigation route opened without the React sidebar, 253 total/30 reviewed/223 imported counts rendered, the reviewed-only filter returned 30, and an expanded answer showed code, interview focus, two official references, and public question-bank provenance. The latest ordering change puts foundation/unlabeled questions first and reserves tricky questions for the end.
- The DSA module was checked in Chrome: overview counts and all 20 links rendered; the complete intro opened; Two Sum showed its Loops and Hash Map concept links; Hash Map navigated to and highlighted its exact section on the shared 18-concept page; and the concept linked back to all three problems that use it. All 40 basic/better JavaScript implementations returned expected results for representative inputs in a local execution check.
- Complete modal interaction/focus testing, the remaining live examples, saved-practice and review behavior in a real browser, responsive/zoom checks, network-policy probing, and content-error/retry UI checks remain to be exercised. Pure progress behavior has automated coverage, which is not a substitute for those browser checks.
- All seven authored lessons remain `sample-draft`; no publication flag was advanced based on schema, build, or limited UI checks alone.
- A focused React example runner is implemented. It executes editable lesson modules in a fresh sandbox, but it does not grade submitted practice answers. Self-reported evidence is never a verified mastery score.
- The built-in quantity demo is React/useState-specific. Delayed review material is topic-owned JSON. PDF answers still need official-source review and should be corrected in JSON without claiming that the supplied documents are authoritative.
- The next content milestone is Chapter 2, **JavaScript foundations**, with 19 ordered topics. Continue chapter by chapter using the Web foundations pattern: exact official sources, complete lesson drafts, meaningful exercises, mastery/review data, a linked mini app, deep validation, generated docs, and browser checks.
- Immediate interview use: open `#/dsa/intro`, spend 10 minutes there, then follow problems 1–20 in order. The 120-minute schedule is a fast review target, not a promise that every learner can independently master all 20 problems in one session.

Browser progress uses `simple-learning.progress.v1` and is local to browser and origin. Hints and solution reveals persist across attempts. Viewing the mini app's full solution records assistance for p07/p10. A previously saved answer is not altered by later help. Future attempts remain assisted. Corrupt existing storage is left untouched; the UI warns that new work is session-only. No test answers were inserted into the user's browser practice records during the limited UI check.

## Pending coverage audits

Keep the detailed records in `content/react/coverage.json` current:

- Official ecosystem sources for routing, testing, TypeScript, query libraries, and deployment.
- Lesson-level reference parameters, caveats, examples, and troubleshooting.
- Release channels and minimum runtimes for newer/specialized APIs.
- Compiler library shipping guide and configuration subpages.
- Publicly sourced recorded interview material.
- Prerequisite depth and possible later dedicated subjects.
- Page-level mapping for introductory guides, tutorial, setup, and TypeScript guides.

The coverage review date is 2026-09-19 after adding Web foundations mappings. React version labels recorded earlier remain historical observations, not a fresh version audit. Revisit official sources before new version-sensitive claims or publishing. There is no recurring source-review automation configured.

## Handoff maintenance

After each milestone, update current state, decisions, commands, actual check results, and next work in this document. Also append a self-contained dated record to `docs/PROJECT-JOURNAL.md`; never delete or rewrite its older entries. The journal entry must cover architecture and flow changes, packages, important files, solved issues, alternatives, verification, risks, and the next starting point. Keep unfinished checks explicit. Do not overwrite generated review documents with divergent hand-written content. Preserve the user's next decisions here so continuing the project does not depend on recovering unavailable task history.
