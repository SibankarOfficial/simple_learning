# Mini apps

Generated from the JSON content. Edit JSON, then regenerate. Coverage review date: 2026-09-19.

2 guided mini apps are registered. Opening complete code is guided help, not mastery.

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
