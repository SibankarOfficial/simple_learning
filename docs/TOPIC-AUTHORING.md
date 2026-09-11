# Topic authoring standard

Use this checklist for every lesson. The machine-readable contract is `schema/topic-lesson.schema.json`. The existing `content/react/lessons/use-state.json` file is the complete reference example.

## Before writing

1. Confirm the topic ID, chapter, order, prerequisites, level, and scope in the curriculum.
2. Register primary official sources and their review dates. Add secondary sources only when they materially improve a real scenario or explain a limitation.
3. List official sections, parameters, caveats, and troubleshooting items. Give each one a lesson destination or record a clear scope decision in coverage.
4. Decide the learner outcome: what they must explain, predict, build, debug, and transfer to a fresh situation.

## Required lesson shape

- Simple English only. Define technical terms on first use.
- Prerequisite diagnostic with a topic link for every missed foundation.
- What, why, how, when to use it, and when not to use it.
- A clear mental model and at least one real scenario.
- Common syntax plus meaningful alternatives. Explain the behavioral difference or say when it is only style.
- Practical, accessible examples with explanation, a prediction/change prompt, source links, and an explicit runtime.
- Common mistakes described as symptom → cause → fix.
- Five to ten exercises across prediction, building, debugging, design, explanation, and transfer where appropriate.
- Optional hints and an explained modal solution for every exercise. A learner must save an attempt before the solution opens.
- Original interview-style questions by default. Recorded interview claims require a public URL and honest provenance.
- A mini-app link when the topic is used by one, plus an independent variation without a supplied solution.
- Mastery evidence for explanation, independent solving, transfer, and delayed recall. Reading or viewing help never grants mastery.
- Review sessions for more than one time gap. Store each session's day offset, fresh problems, and explained feedback in the lesson JSON.

## Quality gates

Keep the catalog status `planned` until the JSON lesson exists. Use `sample-draft` while any publication check is pending. Use `published` only when all checklist fields are true and the catalog agrees.

Run `npm run validate:content`, `npm test`, and `npm run build`. Verify runnable examples in the live preview, including intended changes, errors, keyboard use, and reset. Complete an independent content review and a learner trial before publishing.

Coverage mapping proves that a known source item has a destination. It does not prove that the lesson is complete or that every React use case is covered.
