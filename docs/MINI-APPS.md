# Mini apps

Generated from the JSON content. Edit JSON, then regenerate. Coverage review date: 2026-09-20.

4 guided mini apps are registered. Opening complete code is guided help, not mastery.

<a id="quantity-picker"></a>
## Notebook quantity picker

Status: sample-draft. Choose 1–5 notebooks, show the total, and reset the quantity. Explain your state choices instead of copying the tutorial code.

### Concepts used

- useState
- Passing event handlers
- Choosing minimal state
- Conditional rendering and null

### Requirements

- Initially quantity 1
- Unit price 120
- Quantity must stay between 1 and 5
- Total derives from quantity
- Plus/minus reflect boundaries
- Reset restores initial quantity
- Controls have meaningful accessible names

### Step 1: Plan the UI and rules

Sketch the quantity, total, plus, minus, and reset controls. Write the allowed range.


```jsx
const MIN = 1;
const MAX = 5;
const UNIT_PRICE = 120;
```


Why: Clear acceptance criteria help you decide what to build.

Check: Quantities 0 and 6 are not allowed. The price is fixed.

### Step 2: Choose the minimum state

Add one quantity state variable at the top level of App.


```jsx
const [quantity, setQuantity] = useState(1);
const total = quantity * UNIT_PRICE;
```


Why: Calculating the total avoids keeping duplicate values in sync.

Check: The total does not need a setter.

### Step 3: Add increase and decrease actions

Use functional updaters to enforce the limits.


```jsx
const increase = () => setQuantity(q => Math.min(MAX, q + 1));
const decrease = () => setQuantity(q => Math.max(MIN, q - 1));
```


Why: The update logic must enforce the rules too.

Check: Repeated increases stop at 5. Repeated decreases stop at 1.

### Step 4: Connect the controls

Add named buttons, disable them at the limits, and show the total.


```jsx
<button aria-label="Increase quantity" disabled={quantity === MAX} onClick={increase}>+</button>
```


Why: A visual symbol also needs a clear accessible name.

Check: The buttons work with a keyboard. The plus button is disabled at the maximum.

### Step 5: Add reset

Set quantity back to its initial value when Reset is clicked.


```jsx
<button onClick={() => setQuantity(1)}>Reset</button>
```


Why: The total updates from quantity, so it needs no extra setter.

Check: Resetting from 5 gives quantity 1 and total 120.

### Step 6: Build it again without the example

Close the final code and rebuild the feature in a blank App.jsx file.

Why: Move from following instructions to building independently.

Check: Pass every acceptance scenario below and explain each state choice.

### Complete App.jsx


```jsx
import { useState } from 'react';

const MAX = 5;
const UNIT_PRICE = 120;
export default function App() {
  const [quantity, setQuantity] = useState(1);
  const total = quantity * UNIT_PRICE;
  return <section aria-label="Quantity picker">
    <h1>Notebook order</h1>
    <p aria-live="polite">Quantity: {quantity}. Total: ₹{total}</p>
    <button aria-label="Decrease quantity" disabled={quantity === 1}
      onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
    <button aria-label="Increase quantity" disabled={quantity === MAX}
      onClick={() => setQuantity(q => Math.min(MAX, q + 1))}>+</button>
    <button onClick={() => setQuantity(1)}>Reset</button>
  </section>;
}
```


### Acceptance scenarios

| Given | When | Then |
| --- | --- | --- |
| First render | No interaction | Quantity 1, total 120; minus disabled |
| Quantity 1 | Increase four times | Quantity 5, total 600; plus disabled |
| Quantity 5 | Try increasing again | Quantity stays 5 |
| Quantity 5 | Decrease four times | Quantity 1, total 120; minus disabled |
| Quantity 4 | Reset | Quantity 1 and total 120 |
| Keyboard navigation | Tab then activate enabled control | Meaningful name and expected update |

### Independent ideas

- **Cinema seat quantity:** Build a seat picker with a range of 1–8 seats, a price of 250 per seat, reset, and a calculated total. Write the full code yourself.

- **Daily reading target:** Build a daily reading target from 5–60 pages, with steps of 5 and a reset to 10. Write down what must change before coding.

References: [Component memory](https://react.dev/learn/state-a-components-memory), [Choosing state structure](https://react.dev/learn/choosing-the-state-structure), [Responding to events](https://react.dev/learn/responding-to-events).

<a id="accessible-course-signup"></a>
## Accessible course signup page

Status: sample-draft. Build a responsive course card and signup form with meaningful HTML, native validation, visible keyboard focus, and an evidence-based browser check.

### Concepts used

- How browser pages work
- Semantic HTML and forms
- CSS selectors and cascade
- Box model and responsive layout
- Accessibility and keyboard basics
- Browser DevTools and console

### Requirements

- One clear page heading and one main content area
- A course article with a descriptive heading and list
- A signup form with connected labels and named controls
- Native email and required-field validation
- A visible keyboard focus indicator
- A fluid card that does not cause horizontal scrolling
- A browser check using Elements, Console, and Network

### Step 1: Plan the page and request

Create index.html and write what the browser must load.


```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Course signup</title>
  </head>
  <body></body>
</html>
```


Why: The document shell gives the browser language, character, viewport, and title information.

Check: Network shows one successful document request when the file is served.

### Step 2: Add meaningful structure

Add header, main, article, headings, and a useful list.


```html
<header><a href="#main">Skip to content</a></header>
<main id="main">
  <article class="course-card">
    <h1>React foundations workshop</h1>
    <p>Practice web basics before React.</p>
    <h2>You will practise</h2>
    <ul><li>Semantic HTML</li><li>Responsive CSS</li><li>Keyboard checks</li></ul>
  </article>
</main>
```


Why: Landmarks and headings describe the page before visual styling is added.

Check: The page has one clear h1, and the skip link moves focus to main content.

### Step 3: Build the form with native controls

Add labeled name and email fields plus a submit button.


```html
<form action="#thanks" method="get">
  <h2>Reserve a place</h2>
  <label for="name">Name</label>
  <input id="name" name="name" autocomplete="name" required>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required>
  <button type="submit">Reserve my place</button>
</form>
<p id="thanks">Check the address bar after a valid submission.</p>
```


Why: Native form controls provide names, keyboard behavior, and useful validation before JavaScript.

Check: Clicking either label focuses its field; an empty or invalid email blocks submission.

### Step 4: Set predictable boxes

Apply border-box and basic readable styles.


```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.5; }
.course-card { width: min(100% - 2rem, 44rem); margin: 2rem auto; padding: clamp(1rem, 4vw, 2rem); border: 1px solid #b8c0cc; border-radius: 1rem; }
```


Why: Border-box and flexible constraints make the card easier to reason about at different widths.

Check: The card keeps side space and never exceeds 44rem.

### Step 5: Style controls and focus

Use simple class and state selectors without removing focus.


```css
label { display: block; margin-block-start: 1rem; font-weight: 700; }
input, button { width: 100%; padding: 0.75rem; font: inherit; }
button { margin-block-start: 1rem; cursor: pointer; }
:focus-visible { outline: 3px solid #0b63ce; outline-offset: 3px; }
input:invalid:not(:focus) { border-color: #a61b1b; }
```


Why: Simple selectors stay maintainable, while focus and validation states remain perceivable.

Check: Tab reaches every control in order and focus is always visible.

### Step 6: Test at different widths

Resize, zoom, and enter long text before adding a breakpoint.


```css
@media (min-width: 42rem) {
  form { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
  form h2, form button { grid-column: 1 / -1; }
}
```


Why: A content-driven breakpoint enhances a working fluid base.

Check: The narrow layout remains one column; the wider layout changes only when fields have enough room.

### Step 7: Collect browser evidence

Use DevTools instead of guessing whether the page works.

Why: A repeatable check turns an apparent result into evidence.

Check: Elements shows associated labels and winning styles; Console has no errors; Network shows the document response; keyboard and native validation pass.

### Step 8: Rebuild it independently

Close the final code and build the same behavior with different content and colors.

Why: Independent transfer is stronger evidence than copying the guided page.

Check: Meet every acceptance scenario and explain each semantic and layout choice.

### Complete index.html


```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Course signup</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.5; color: #172033; background: #f4f7fb; }
    .skip { position: absolute; inset-inline-start: 1rem; transform: translateY(-150%); }
    .skip:focus { transform: translateY(0); }
    .course-card { width: min(100% - 2rem, 44rem); margin: 2rem auto; padding: clamp(1rem, 4vw, 2rem); background: white; border: 1px solid #b8c0cc; border-radius: 1rem; }
    label { display: block; margin-block-start: 1rem; font-weight: 700; }
    input, button { width: 100%; padding: 0.75rem; font: inherit; }
    button { margin-block-start: 1rem; cursor: pointer; }
    :focus-visible { outline: 3px solid #0b63ce; outline-offset: 3px; }
    input:invalid:not(:focus) { border-color: #a61b1b; }
    @media (min-width: 42rem) {
      form { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
      form h2, form button { grid-column: 1 / -1; }
    }
  </style>
</head>
<body>
  <header><a class="skip" href="#main">Skip to content</a></header>
  <main id="main" class="course-card" tabindex="-1">
    <article>
      <h1>React foundations workshop</h1>
      <p>Practice web basics before React.</p>
      <h2>You will practise</h2>
      <ul><li>Semantic HTML</li><li>Responsive CSS</li><li>Keyboard checks</li></ul>
    </article>
    <form action="#thanks" method="get">
      <h2>Reserve a place</h2>
      <div><label for="name">Name</label><input id="name" name="name" autocomplete="name" required></div>
      <div><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div>
      <button type="submit">Reserve my place</button>
    </form>
    <p id="thanks">Check the address bar after a valid submission.</p>
  </main>
</body>
</html>
```


### Acceptance scenarios

| Given | When | Then |
| --- | --- | --- |
| Page loaded | Inspect headings and landmarks | One h1 and one main area describe the page |
| Keyboard only | Tab through the page | Skip link and every control are reachable with visible focus |
| Empty form | Submit | The browser focuses a required field and blocks normal submission |
| Invalid email | Submit | Native email validation reports the problem |
| Narrow viewport or 200% zoom | Read and use the form | Content reflows without horizontal page scrolling |
| DevTools open | Reload | Document succeeds, Console stays clear, and winning styles are visible |

### Independent ideas

- **Community event registration:** Create a responsive event page with schedule content and an accessible registration form. Use different structure and styles from the guided app.

- **Support request form:** Build a support form with issue type, description, urgency, and contact details. Decide which values are required before coding.

References: [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works), [How browsers load websites](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_browsers_load_websites), [HTML: A good basis for accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML), [Forms and buttons in HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms), [Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation), [Basic CSS selectors](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors), [Handling CSS conflicts](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts), [The box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model), [Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design), [Keyboard accessible](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard), [What are browser developer tools?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools).

<a id="study-session-report"></a>
## Study session report

Status: sample-draft. Build a plain JavaScript module that validates study-session data, summarizes progress, formats a report, and loads optional remote sessions.

### Concepts used

- Values types and coercion
- let const and scope
- Expressions operators and equality
- Conditionals and loops
- Functions declarations and arrows
- Parameters defaults and return values
- Objects and property access
- Arrays and iteration
- Destructuring
- Spread and rest
- map filter find and reduce
- Modules import and export
- Closures and lexical scope
- References mutation and shallow copy
- Optional chaining and nullish coalescing
- Promises async await and errors
- Event loop and timers
- Fetch JSON and HTTP
- Exceptions and debugging

### Requirements

- Keep sessions as an array of objects
- Validate required values
- Use pure functions for filtering and totals
- Avoid mutating input data
- Return useful empty and error states
- Export the report functions as a module

### Step 1: Model one session

Create an object with topic, minutes, score, and completed.


```js
const session = { topic: "Arrays", minutes: 25, score: 80, completed: true };
```


Why: Clear values and object shape make later logic predictable.

Check: Every property has the intended type.

### Step 2: Validate the boundary

Reject missing topic and invalid minutes.


```js
function isValidSession({ topic, minutes }) { return typeof topic === "string" && topic.trim() && Number.isFinite(minutes) && minutes >= 0; }
```


Why: Boundary validation prevents bad data from spreading.

Check: Invalid or negative minutes return false.

### Step 3: Select completed work

Use filter without changing the input array.


```js
const completed = sessions => sessions.filter(session => session.completed);
```


Why: filter expresses selection and returns a new array.

Check: The result contains only completed sessions and the input is unchanged.

### Step 4: Calculate totals

Reduce sessions into total minutes.


```js
const totalMinutes = sessions => sessions.reduce((total, session) => total + session.minutes, 0);
```


Why: The explicit initial value makes the empty case safe.

Check: An empty array returns 0.

### Step 5: Build an immutable summary

Return a new summary object.


```js
const summarize = sessions => ({ count: sessions.length, minutes: totalMinutes(sessions), topics: sessions.map(({ topic }) => topic) });
```


Why: A new result keeps data flow visible.

Check: The function does not write to sessions.

### Step 6: Format missing values

Use optional chaining and a nullish fallback.


```js
const learnerName = profile => profile?.name ?? "Learner";
```


Why: Nullish fallback preserves valid falsy values.

Check: An empty string remains an empty string; null becomes Learner.

### Step 7: Load remote data safely

Fetch JSON and reject non-success status.


```js
async function loadSessions(url) { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }
```


Why: fetch needs an explicit HTTP status check.

Check: 404 becomes a handled error rather than false success.

### Step 8: Test timing and errors

Call the report from a timer and catch failures.


```js
setTimeout(() => loadSessions("/sessions.json").then(summarize).then(console.log).catch(console.error), 0);
```


Why: The final step connects promises, timers, and error flow.

Check: Explain why the callback runs after current synchronous code.

### Complete study-session-report.js


```js
export function isValidSession({ topic, minutes }) {
  return typeof topic === "string" && Boolean(topic.trim()) && Number.isFinite(minutes) && minutes >= 0;
}

export const totalMinutes = sessions =>
  sessions.reduce((total, session) => total + session.minutes, 0);

export function summarize(sessions = []) {
  const valid = sessions.filter(isValidSession);
  const completed = valid.filter(session => session.completed);
  return {
    count: valid.length,
    completed: completed.length,
    minutes: totalMinutes(valid),
    topics: [...new Set(valid.map(({ topic }) => topic))],
  };
}

export async function loadSessions(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load sessions: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new TypeError("Expected an array of sessions");
  return data;
}
```


### Acceptance scenarios

| Given | When | Then |
| --- | --- | --- |
| No sessions | summarize runs | All numeric totals are zero and topics is empty |
| Mixed valid and invalid sessions | summarize runs | Only valid sessions contribute to the report |
| Repeated topics | summarize runs | topics contains each topic once |
| A 404 response | loadSessions runs | The returned promise rejects with the HTTP status |

### Independent ideas

- **Expense summary:** Build a module that validates expenses, groups them by category, and reports totals without mutating input.

- **Habit streak report:** Calculate completed days and current streaks from dated habit entries, then load optional JSON data.

References: [Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types), [JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures), [Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators), [Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling), [Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration), [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions), [Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects), [Indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections), [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring), [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures), [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), [Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing), [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model), [Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status).

<a id="first-react-workspace"></a>
## First React learning workspace

Status: sample-draft. Create, understand, verify, build, and inspect a small Vite React learning project without treating the starter as a complete production architecture.

### Concepts used

- What React solves and its boundaries
- Declarative UI and component thinking
- Editor Node package manager and terminal
- Create a learning project with Vite
- Framework versus build tool
- Project files scripts and dependencies
- Development versus production
- React DevTools
- Adding React to an existing page

### Requirements

- Confirm Node and npm versions
- Create a Vite React project in the intended folder
- Trace index.html to main.jsx to App.jsx
- Replace starter content with a component hierarchy
- Verify development updates and browser evidence
- Inspect components with React DevTools when available
- Create and preview a production build
- Explain which production concerns remain outside this starter

### Step 1: Check the environment

In the intended parent folder, check the active Node and npm versions.


```shell
node -v
npm -v
```


Why: The scaffold and build run in Node, so an unsupported or missing runtime must be fixed first.

Check: The versions print in the same terminal, and Node satisfies the current Vite requirement.

### Step 2: Create the React project

Scaffold a named React template, enter it, and install its declared packages.


```shell
npm create vite@latest react-learning-lab -- --template react
cd react-learning-lab
npm install
```


Why: The template creates a known starting structure and the install resolves its dependency graph.

Check: package.json, package-lock.json, index.html, and src exist in react-learning-lab.

### Step 3: Trace the startup path

Open index.html, src/main.jsx, and src/App.jsx. Write one sentence for the role of each.


```html
<div id="root"></div>
<!-- main.jsx finds this node and renders App into it. -->
```


Why: Tracing the entry path makes blank-screen debugging much easier.

Check: You can explain the path index.html → main.jsx → App.jsx without calling every file React.

### Step 4: Create a component hierarchy

Replace the starter App with a page, header, and setup checklist.


```jsx
function Header() { return <header><h1>React learning lab</h1><p>Setup before features.</p></header>; }
function SetupList() { return <ul><li>Dev server</li><li>Component tree</li><li>Production build</li></ul>; }
export default function App() { return <main><Header /><SetupList /></main>; }
```


Why: The small hierarchy connects component thinking to a real project without unrelated state logic.

Check: The page has one h1 and Components shows App with its two child components.

### Step 5: Verify development mode

Start the dev server, open its printed URL, edit one list item, and inspect Console and Network.


```shell
npm run dev
```


Why: A visible update proves the editor, source, Vite server, plugin, browser, and React root are connected.

Check: The edit appears, the document and source modules load, and Console has no unexplained error.

### Step 6: Inspect React ownership

Use React DevTools Components when available and compare it with browser Elements.

Why: The two panels answer different questions: React hierarchy versus browser DOM.

Check: Components shows App, Header, and SetupList; Elements shows their final DOM output.

### Step 7: Build and preview

Stop the dev server, create dist, and serve the built output locally.


```shell
npm run build
npm run preview
```


Why: Development success does not prove that optimized assets and their paths work.

Check: The build exits successfully and the preview URL displays the same useful content.

### Step 8: Write the boundary note

List what this project now provides and what a production product still needs.

Why: A working starter is the beginning of architecture, not the whole application.

Check: The note separates React UI, Vite tooling, and unresolved routing, data, backend, security, testing, and deployment decisions.

### Complete App.jsx


```jsx
function Header() {
  return (
    <header>
      <p>Setup verified</p>
      <h1>React learning lab</h1>
      <p>Understand each layer before adding features.</p>
    </header>
  );
}

function SetupList() {
  const checks = ["Development server", "Component tree", "React DevTools", "Production build"];
  return (
    <section>
      <h2>Workspace checks</h2>
      <ul>{checks.map(check => <li key={check}>{check}</li>)}</ul>
    </section>
  );
}

export default function App() {
  return <main><Header /><SetupList /></main>;
}
```


### Acceptance scenarios

| Given | When | Then |
| --- | --- | --- |
| Supported Node and npm | The scaffold and install commands run in the intended folder | The project and lockfile are created without changing another repository |
| Development server running | App.jsx text changes | The browser shows the update and no unexplained Console error |
| React DevTools available | Components is inspected | App, Header, and SetupList appear as a hierarchy |
| Source is ready | npm run build completes | dist contains a production build |
| Fresh production build | npm run preview is opened | The learning page renders from built assets |

### Independent ideas

- **Existing-page learning widget:** Add one small React checklist to an existing semantic HTML page while preserving the rest of the page.

- **Tool responsibility map:** Create a small React page that teaches what the editor, browser, Node, npm, Vite, React, React DOM, framework, and host each own.

References: [Installation](https://react.dev/learn/installation), [Build a React app from scratch](https://react.dev/learn/build-a-react-app-from-scratch), [Thinking in React](https://react.dev/learn/thinking-in-react), [Reacting to input with state](https://react.dev/learn/reacting-to-input-with-state), [Your first component](https://react.dev/learn/your-first-component), [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/), [package.json](https://docs.npmjs.com/files/package.json/), [Getting Started](https://vite.dev/guide/), [Features](https://vite.dev/guide/features), [Specifying dependencies and devDependencies](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file/), [createRoot](https://react.dev/reference/react-dom/client/createRoot), [Building for Production](https://vite.dev/guide/build), [React Developer Tools](https://react.dev/learn/react-developer-tools), [Add React to an existing project](https://react.dev/learn/add-react-to-an-existing-project).
