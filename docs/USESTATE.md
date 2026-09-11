# useState: Memory for your UI

Generated from the JSON content. Edit JSON, then regenerate. Content review date: 2026-09-10.

React → Hooks: foundations and useState → useState

Status: sample-draft. React 19.1+; each module example replaces src/App.jsx in an existing React project.

Read the core sections first. Return to the deeper and reference sections later. You do not need to memorize every variation at once.

## Outcome

- Explain the difference between a local variable and state.
- Predict results using state snapshots and update queues.
- Update objects and arrays without changing the previous data.
- Decide which values need state and which can be calculated.
- Explain how state is initialized, preserved, and reset.
- Build a quantity control with limits without following a tutorial.

## Prerequisite check

**What is first after const [first, second] = [10, 20]?**

10. This is JavaScript array destructuring. It is not special React syntax.

If you need help, review: Destructuring.

**Are onClick={handleClick} and onClick={handleClick()} the same?**

No. The first passes a function. The second calls the function during rendering.

If you need help, review: Passing event handlers.

**Does const copy = original create an independent copy of an object?**

No. Both variables refer to the same object.

If you need help, review: References mutation and shallow copy.

## Learning flow

1. Prerequisite check
2. Predict before reading
3. Core explanation
4. Run and change examples
5. Practice with optional hints
6. Explain your solution
7. Build mini app
8. Revisit after a gap

## What is state? · core

Imagine choosing two seats in a booking app. The app needs to remember that choice when the screen updates. useState gives a component this local memory. Each mounted copy of a component has its own state. Displaying two copies does not make them share state.

Reference: [Component memory](https://react.dev/learn/state-a-components-memory).

## Why is a local variable not enough? · core

When a component runs again, its local declarations run again too. Changing a local variable in an event handler does not ask React to update the screen. A state setter requests an update. State is not permanent storage: keeping data after a page refresh needs a separate storage feature.

Reference: [Component memory](https://react.dev/learn/state-a-components-memory).

### Counter: function declaration


```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```


Each click adds 1 to the pending count. Change the initial value to 10 and predict the result.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## How to read a useState declaration · core

In const [count, setCount] = useState(0), useState is the imported Hook, 0 is the initial value, count is the value for this render, and setCount requests the next update. The brackets use JavaScript destructuring. const prevents reassignment of this binding; the next render creates a new binding. The setter returns neither a Promise nor the next state value.

Reference: [useState reference](https://react.dev/reference/react/useState), [Component memory](https://react.dev/learn/state-a-components-memory).

### Counter: function declaration


```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```


Each click adds 1 to the pending count. Change the initial value to 10 and predict the result.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

### Counter: arrow component


```jsx
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
};
export default App;
```


This behaves like the function declaration version. Only the component declaration syntax changes.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## From a click to a screen update · core

The first render receives count as 0. Clicking the button queues setCount(c => c + 1). React renders the component with the updated state, then applies the needed DOM changes during the commit. Rendering a component does not mean rebuilding every DOM node.

Reference: [Render and commit](https://react.dev/learn/render-and-commit).

### Counter: function declaration


```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```


Each click adds 1 to the pending count. Change the initial value to 10 and predict the result.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Function declarations and arrow functions · core

The two App modules below are alternatives. Use one at a time. Their state behavior is the same. A function declaration can be called before its declaration in the same scope. An arrow function assigned to const cannot be used before that assignment runs. Hooks do not require arrow functions. Choose the style that is clear and consistent with your project.

Reference: [Describing the UI](https://react.dev/learn/describing-the-ui).

### Counter: function declaration


```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```


Each click adds 1 to the pending count. Change the initial value to 10 and predict the result.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

### Counter: arrow component


```jsx
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
};
export default App;
```


This behaves like the function declaration version. Only the component declaration syntax changes.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Why does the setter leave the old value in a log? · core

An event handler reads count from the render that created it. setCount(5) does not rewrite that count variable. A console.log(count) in the same handler can therefore show the previous value. A timer callback also captures values from the render that created it. These values come from a specific snapshot; they are not random.

Reference: [State as a snapshot](https://react.dev/learn/state-as-a-snapshot).

### Immediate log and delayed log


```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    console.log('This render:', count);
    setTimeout(() => console.log('Captured:', count), 1000);
  }
  return <button onClick={handleClick}>Count: {count}</button>;
}
```


After one click from 0, the screen shows 1. Both the immediate and delayed logs show 0. Each callback keeps the value captured when it was created.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Passing a value or an updater function · core

setCount(count + 1) queues a replacement value calculated now. setCount(c => c + 1) calculates the next value from the pending state. Starting at 0, three replacements in one click produce 1; three updaters produce 0 → 1 → 2 → 3. React can group updates into a batch. Do not treat separate intentional clicks as one event. Keep updater functions pure.

Reference: [State update queues](https://react.dev/learn/queueing-a-series-of-state-updates).

### Compare two update queues


```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  function replaceThreeTimes() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  function updateThreeTimes() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  }
  return <><p>{count}</p>
    <button onClick={replaceThreeTimes}>Three replacements</button>
    <button onClick={updateThreeTimes}>Three updaters</button>
    <button onClick={() => setCount(0)}>Reset</button>
  </>;
}
```


After a reset, the replacement button produces 1. Reset again and the updater button produces 3. Next, try mixing replacements and updaters.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Updating object state · core

setProfile({ name: 'Mira' }) replaces the object; it does not automatically keep the old fields. Use spread to keep existing fields. For a nested change, copy each object along the changed path. Spread makes a shallow copy, not a copy of every nested object. Changing the old object directly can also change data held by earlier snapshots.

Reference: [Updating objects](https://react.dev/learn/updating-objects-in-state).

### Nested profile editor


```jsx
import { useState } from 'react';

export default function App() {
  const [profile, setProfile] = useState({
    name: 'Mira', address: { city: 'Kolkata', country: 'India' }
  });
  return <>
    <label>Name <input value={profile.name} onChange={e => {
      const name = e.target.value;
      setProfile(p => ({ ...p, name }));
    }} /></label>
    <label>City <input value={profile.address.city} onChange={e => {
      const city = e.target.value;
      setProfile(p => ({ ...p, address: { ...p.address, city } }));
    }} /></label>
    <p>{profile.name}: {profile.address.city}, {profile.address.country}</p>
  </>;
}
```


Editing the city keeps the name and country. The event value is read before the updater runs.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Adding, editing, and removing array items · core

Create a new array: use spread to add an item, map to edit one, and filter to remove one. Copy the edited object inside the array too. sort and reverse change the original array, so copy it first. Create stable item IDs when items are added. Do not generate a new key on every render.

Reference: [Updating arrays](https://react.dev/learn/updating-arrays-in-state).

### Editable task list


```jsx
import { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [draft, setDraft] = useState('');
  function addTask(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const task = { id: crypto.randomUUID(), title, done: false };
    setTasks(items => [...items, task]);
    setDraft('');
  }
  return <>
    <form onSubmit={addTask}>
      <label>Task <input value={draft} onChange={e => setDraft(e.target.value)} /></label>
      <button>Add</button>
    </form>
    <ul>{tasks.map(task => <li key={task.id}>
      <label><input type="checkbox" checked={task.done} onChange={() =>
        setTasks(items => items.map(item =>
          item.id === task.id ? { ...item, done: !item.done } : item
        ))
      } />{task.title}</label>
      <button onClick={() => setTasks(items => items.filter(item => item.id !== task.id))}>
        Delete {task.title}
      </button>
    </li>)}</ul>
  </>;
}
```


Empty tasks are rejected. IDs are created in the event handler. Toggling creates a new array and a new object for the selected task. Use localhost or HTTPS for crypto.randomUUID.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Keep only the state you need · core

If total comes from quantity and unitPrice, calculate it during rendering. It does not need separate state. Store independent inputs and calculate values that follow from them. An Effect used only to keep a calculated value in sync adds work and can allow values to disagree. For complex connected updates, compare useState with useReducer later.

Reference: [Choosing state structure](https://react.dev/learn/choosing-the-state-structure), [You might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

### Real feature: bounded quantity picker


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


The updater enforces the limits, and the buttons show when a limit is reached. The total is calculated from quantity. Stock is fixed here; changing stock is a separate extension.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Real use case: a controlled input · core

When you pass value to an input, use onChange to store the typed value in state. Start a text input with '' so it stays controlled. For a checkbox, use checked and event.target.checked. Always provide a label. A number input's event value is still a string, so decide how to handle an empty input and number conversion.

Reference: [Input reference](https://react.dev/reference/react-dom/components/input).

### Nested profile editor


```jsx
import { useState } from 'react';

export default function App() {
  const [profile, setProfile] = useState({
    name: 'Mira', address: { city: 'Kolkata', country: 'India' }
  });
  return <>
    <label>Name <input value={profile.name} onChange={e => {
      const name = e.target.value;
      setProfile(p => ({ ...p, name }));
    }} /></label>
    <label>City <input value={profile.address.city} onChange={e => {
      const city = e.target.value;
      setProfile(p => ({ ...p, address: { ...p.address, city } }));
    }} /></label>
    <p>{profile.name}: {profile.address.city}, {profile.address.country}</p>
  </>;
}
```


Editing the city keeps the name and country. The event value is read before the updater runs.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Initial values and lazy initialization · deeper

useState(buildOptions) passes the function as an initializer. With useState(buildOptions()), JavaScript calls buildOptions on every render before passing its result to the Hook. Keep initialization pure. Changing an initial prop does not automatically reset existing state. For inexpensive values, a direct initial value is often clearer.

Reference: [useState reference](https://react.dev/reference/react/useState).

### Pure lazy initialization


```jsx
import { useState } from 'react';

function buildOptions() {
  return Array.from({ length: 1000 }, (_, index) => 'Option ' + (index + 1));
}
export default function App() {
  const [options] = useState(buildOptions);
  const [query, setQuery] = useState('');
  const matches = options.filter(option => option.toLowerCase().includes(query.toLowerCase()));
  return <>
    <label>Search <input value={query} onChange={e => setQuery(e.target.value)} /></label>
    <p>{matches.length} matches</p>
  </>;
}
```


The initializer is pure, so repeating it in StrictMode is safe. A constant list could also be defined outside the component.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Preserving and resetting state · deeper

React preserves state when a component keeps the same type, position, and key in the tree. Removing it, changing its type, or changing its key can reset its state. Defining a child component inside its parent can cause unexpected resets. A setter resets a selected state value; a changed key resets the whole component subtree.

Reference: [Preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state).

### Reset a whole form with a key


```jsx
import { useState } from 'react';

function Draft() {
  const [text, setText] = useState('');
  return <label>Draft <input value={text} onChange={e => setText(e.target.value)} /></label>;
}
export default function App() {
  const [version, setVersion] = useState(0);
  return <><Draft key={version} />
    <button onClick={() => setVersion(v => v + 1)}>Start fresh</button>
  </>;
}
```


Draft is defined outside App. Changing version gives Draft a new identity, so its state resets.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## Repeated calls in StrictMode · deeper

In development, StrictMode can repeat component rendering and calls to pure functions such as initializers and updaters to find accidental side effects. React ignores one result. This does not mean every click handler is called twice. Keep API requests, random ID creation, and changes to external data outside updater functions.

Reference: [StrictMode](https://react.dev/reference/react/StrictMode).

## Where can you call useState? · core

Call useState at the top level of a component or custom Hook, before any conditional early return. Do not call it inside a loop, condition, nested callback, event handler, class, or ordinary utility function. React uses Hook call order to match state. Put conditional UI in JSX instead of calling Hooks conditionally.

Reference: [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

## Less common cases · reference

React can skip an update when Object.is considers the next value equal to the current value. This is not a guarantee of an exact render count. Setter identity stays stable. Storing a function needs a wrapper. Calling a setter during rendering without a stopping condition can cause a render loop. Guarded updates to the currently rendering component are an advanced pattern; first consider a calculated value or a key reset.

Reference: [useState reference](https://react.dev/reference/react/useState).

### Store a function without calling it


```jsx
import { useState } from 'react';

const double = value => value * 2;
const triple = value => value * 3;
export default function App() {
  const [operation, setOperation] = useState(() => double);
  return <><p>{operation(4)}</p>
    <button onClick={() => setOperation(() => triple)}>Use triple</button>
  </>;
}
```


The wrapper returns the function to store. This prevents React from calling that function as an initializer or updater.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

### Rare pattern: compare previous props during render


```jsx
import { useState } from 'react';

function Trend({ score }) {
  const [previous, setPrevious] = useState(score);
  const [direction, setDirection] = useState('same');
  if (previous !== score) {
    setPrevious(score);
    setDirection(score > previous ? 'up' : 'down');
  }
  return <p>{score}: {direction}</p>;
}
export default function App() {
  const [score, setScore] = useState(0);
  return <><Trend score={score} />
    <button onClick={() => setScore(s => s + 1)}>Increase</button>
  </>;
}
```


The condition stops repeated updates. Only the currently rendering component updates its own state. This is a reference example for comparing previous props, not a default approach.

Try: Change one behavior without copying the example. Write the expected result first, then run your code.

## When do you not need useState? · core

A label calculated directly from props needs no extra state. Consider a ref for a changeable value that does not affect the screen. If two sibling components need the same data, move that state to a shared parent. Before copying cached server data into local state, decide which place should manage that data.

Reference: [Choosing state structure](https://react.dev/learn/choosing-the-state-structure), [You might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

## Common mistakes

| Symptom | Cause | Fix |
| --- | --- | --- |
| A render loop starts before any click | onClick={setCount(count + 1)} calls the setter during rendering. | Pass a function: onClick={() => setCount(c => c + 1)}. |
| A nested field disappears | The setter replaces the object. | Copy each object along the changed path. |
| Three updates only add 1 | All three calls replace state using the same snapshot. | Use updater functions that read the pending state. |
| The input resets while typing | Its key changes, or its component is defined inside another component. | Keep its identity stable and define the child outside the parent. |
| A function runs when you try to store it | React treats a function argument as an initializer or updater. | Pass a wrapper that returns the function to store. |

## Practice — attempt before solution

Hints are optional. Write your prediction or plan first. After reading a solution, solve the problem again in a blank file. Expand a solution below to review it. In the learning app, save your attempt before opening the solution modal. Viewing help is recorded and does not award mastery.

### p01: build · beginner

Build a bookmark toggle. It starts off, turns on after one click, and turns off after another. Update the button's aria-pressed value too.

**Acceptance criteria**

- Initial aria-pressed false
- Two clicks restore false

<details>
<summary>Hints</summary>

- A boolean can represent the two states.
- Return the opposite of the pending boolean.

</details>

<details>
<summary>Solution and reasoning</summary>

Using prev => !prev calculates the next value from the pending state.
```jsx
import { useState } from 'react';

export default function App() {
  const [saved, setSaved] = useState(false);
  return <button aria-pressed={saved} onClick={() => setSaved(s => !s)}>
    {saved ? 'Bookmarked' : 'Bookmark'}
  </button>;
}
```


Reference: [Component memory](https://react.dev/learn/state-a-components-memory).

</details>

### p02: predict · beginner

Start with count = 4. One handler calls setCount(count + 2); setCount(count + 2); console.log(count). What is logged, and what does the next render show?

**Acceptance criteria**

- Log 4
- Next UI 6
- Explain the result using a state snapshot

<details>
<summary>Hints</summary>

- Does the setter rewrite count in the current render?
- What replacement value does each call queue?

</details>

<details>
<summary>Solution and reasoning</summary>

The log shows 4 and the next render shows 6. Both calls queue 4 + 2 = 6 from the same snapshot. They do not add 4 in total.

Reference: [State as a snapshot](https://react.dev/learn/state-as-a-snapshot), [State update queues](https://react.dev/learn/queueing-a-series-of-state-updates).

</details>

### p03: predict · intermediate

Start with n = 2. One handler calls setN(n + 5); setN(x => x * 2); setN(3); setN(x => x + 1). What is the next value of n? Trace the queue.

**Acceptance criteria**

- Trace 7 → 14 → 3 → 4
- Final 4

<details>
<summary>Hints</summary>

- A replacement overwrites the pending result.
- Process each queued update in order.

</details>

<details>
<summary>Solution and reasoning</summary>

The result is 4. The queue produces replacement 7, updater result 14, replacement 3, then updater result 4. Counting setter calls alone does not tell you the result.

Reference: [State update queues](https://react.dev/learn/queueing-a-series-of-state-updates).

</details>

### p04: debug · intermediate

A delayed increment uses setTimeout(() => setCount(count + 1), 1000). Starting at 0, three quick clicks do not produce the intended +3. Fix it. Timer cancellation is outside this exercise.

**Acceptance criteria**

- Three queued callbacks yield 3
- Explain closure

<details>
<summary>Hints</summary>

- Which render supplied count to each callback?
- Use the pending value when each timer runs.

</details>

<details>
<summary>Solution and reasoning</summary>

Use a functional updater inside the timer callback. Replacing state with a value based on the same captured 0 loses increments.
```jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => {
    setTimeout(() => setCount(c => c + 1), 1000);
  }}>Schedule +1: {count}</button>;
}
```


Reference: [State as a snapshot](https://react.dev/learn/state-as-a-snapshot).

</details>

### p05: debug · intermediate

The profile is { name: 'Mira', address: { city: 'Kolkata', country: 'India' } }. Editing the city removes the country. Update the city while keeping the name and country.

**Acceptance criteria**

- Name unchanged
- Country unchanged
- Old nested object not mutated

<details>
<summary>Hints</summary>

- The state setter replaces the object.
- Copy both the outer profile and its nested address.

</details>

<details>
<summary>Solution and reasoning</summary>

Spread the profile and address, then replace city. The profile-editor example contains the complete solution.
```jsx
import { useState } from 'react';

export default function App() {
  const [profile, setProfile] = useState({
    name: 'Mira', address: { city: 'Kolkata', country: 'India' }
  });
  return <>
    <label>Name <input value={profile.name} onChange={e => {
      const name = e.target.value;
      setProfile(p => ({ ...p, name }));
    }} /></label>
    <label>City <input value={profile.address.city} onChange={e => {
      const city = e.target.value;
      setProfile(p => ({ ...p, address: { ...p.address, city } }));
    }} /></label>
    <p>{profile.name}: {profile.address.city}, {profile.address.country}</p>
  </>;
}
```


Reference: [Updating objects](https://react.dev/learn/updating-objects-in-state).

</details>

### p06: build · intermediate

Build a task list with add, checkbox toggle, and delete actions. Reject empty tasks. Toggling one task must not change another task.

**Acceptance criteria**

- Blank input adds nothing
- Toggle one item only
- Delete correct ID
- No push/splice or direct property mutation

<details>
<summary>Hints</summary>

- Give each task a stable ID.
- Use map to replace the selected item and filter to remove an item.

</details>

<details>
<summary>Solution and reasoning</summary>

Use spread, map, and filter for array updates. Copy the selected object when changing it. The task-list example contains the complete solution.
```jsx
import { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [draft, setDraft] = useState('');
  function addTask(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const task = { id: crypto.randomUUID(), title, done: false };
    setTasks(items => [...items, task]);
    setDraft('');
  }
  return <>
    <form onSubmit={addTask}>
      <label>Task <input value={draft} onChange={e => setDraft(e.target.value)} /></label>
      <button>Add</button>
    </form>
    <ul>{tasks.map(task => <li key={task.id}>
      <label><input type="checkbox" checked={task.done} onChange={() =>
        setTasks(items => items.map(item =>
          item.id === task.id ? { ...item, done: !item.done } : item
        ))
      } />{task.title}</label>
      <button onClick={() => setTasks(items => items.filter(item => item.id !== task.id))}>
        Delete {task.title}
      </button>
    </li>)}</ul>
  </>;
}
```


Reference: [Updating arrays](https://react.dev/learn/updating-arrays-in-state).

</details>

### p07: design · intermediate

A catalog has a fixed price and a chosen quantity. Does total need separate state? Build a quantity picker with only the state it needs.

**Acceptance criteria**

- Only quantity is state for fixed price
- Total always quantity × price

<details>
<summary>Hints</summary>

- Which values are inputs, and which are calculations?
- How many setters should a reset need?

</details>

<details>
<summary>Solution and reasoning</summary>

Keep price as a constant and quantity in state. Calculate total during rendering. See the quantity-picker example.
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


Reference: [Choosing state structure](https://react.dev/learn/choosing-the-state-structure), [You might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

</details>

### p08: explain-and-build · intermediate

A Draft component starts with empty text. Keep its text during a normal parent re-render, but clear it when Start fresh is clicked. Build this using a key.

**Acceptance criteria**

- Typing persists through normal parent rerender
- Changing key clears draft

<details>
<summary>Hints</summary>

- A re-render and a remount are different.
- Changing a key can change component identity.

</details>

<details>
<summary>Solution and reasoning</summary>

The key-reset example changes the child's identity using version state. Define the child outside the parent component.
```jsx
import { useState } from 'react';

function Draft() {
  const [text, setText] = useState('');
  return <label>Draft <input value={text} onChange={e => setText(e.target.value)} /></label>;
}
export default function App() {
  const [version, setVersion] = useState(0);
  return <><Draft key={version} />
    <button onClick={() => setVersion(v => v + 1)}>Start fresh</button>
  </>;
}
```


Reference: [Preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state).

</details>

### p09: debug · advanced

Using useState(double) and setOperation(triple) calls the functions instead of storing them. Write code that stores each function as a value.

**Acceptance criteria**

- Initial operation(4) is 8
- After button operation(4) is 12

<details>
<summary>Hints</summary>

- A function argument has a special meaning to React.
- Pass a wrapper that returns the function.

</details>

<details>
<summary>Solution and reasoning</summary>

React stores the function returned by the initializer or updater wrapper. The stored-function example contains the complete solution.
```jsx
import { useState } from 'react';

const double = value => value * 2;
const triple = value => value * 3;
export default function App() {
  const [operation, setOperation] = useState(() => double);
  return <><p>{operation(4)}</p>
    <button onClick={() => setOperation(() => triple)}>Use triple</button>
  </>;
}
```


Reference: [useState reference](https://react.dev/reference/react/useState).

</details>

### p10: transfer · intermediate

Build a notebook quantity picker without a tutorial: range 1–5, unit price 120, plus/minus buttons, reset, a calculated total, disabled controls at the limits, and clear button labels.

**Acceptance criteria**

- Initial 1 and 120
- Cannot exceed 5 or go below 1
- Reset restores 1 and 120
- Keyboard operable named buttons
- No separate total state

<details>
<summary>Hints</summary>

- Write the rule first: 1 <= quantity <= 5.
- Enforce the limits in the update logic as well as the disabled buttons.

</details>

<details>
<summary>Solution and reasoning</summary>

See the quantity-picker example for the solution. Then change the fixed stock from 5 to 3 and check every boundary rule again.
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


Reference: [Choosing state structure](https://react.dev/learn/choosing-the-state-structure).

</details>

## Mini app

[Build the notebook quantity picker step by step](MINI-APP.md). Then build the related seat picker or reading target on your own.

## Mastery check

Reading, hint use, or opening solutions never grants mastery. This is a proposed learning rubric, not a validated diagnostic instrument.

**Without notes, explain memory, snapshots, updaters, and immutable updates.**

Pass evidence: Give an example and a reason for each of the four concepts.

**Solve at least 8 of the 10 exercises independently.**

Pass evidence: Include p03, p05, p06, and p10. An attempt made after viewing the solution does not count as independent.

**Build your own version of the related seat-picker idea.**

Pass evidence: Check limits, reset, the calculated total, and named keyboard controls.

**Solve two new problems the next day and again one week later.**

Pass evidence: Explain the results instead of repeating memorized code.

Suggested revisit days: 1, 3, 7, 14. Use this as a starting schedule. Review sooner if you forget, and leave a longer gap when solving becomes easy.

### Day 1 review

Start with count = 3. One click calls setCount(count + 2) twice, then logs count. Predict the log and the next screen value. Explain why.

Explained feedback: The log is 3. The next screen shows 5. Both setters use the same render's snapshot and queue the same replacement, 3 + 2.

Start with n = 3. One click calls setN(n + 2); setN(x => x * 2); setN(x => x - 1). Trace the pending values and explain the final result.

Explained feedback: The queue produces 5, then 10, then 9. The replacement is followed by two updaters that each receive the pending value.

### Day 3 review

Start with count = 5. One click calls setCount(count + 4) twice, then logs count. Predict the log and the next screen value. Explain why.

Explained feedback: The log is 5. The next screen shows 9. Both setters use the same render's snapshot and queue the same replacement, 5 + 4.

Start with n = 5. One click calls setN(n + 4); setN(x => x * 2); setN(x => x - 1). Trace the pending values and explain the final result.

Explained feedback: The queue produces 9, then 18, then 17. The replacement is followed by two updaters that each receive the pending value.

### Day 7 review

Start with count = 9. One click calls setCount(count + 8) twice, then logs count. Predict the log and the next screen value. Explain why.

Explained feedback: The log is 9. The next screen shows 17. Both setters use the same render's snapshot and queue the same replacement, 9 + 8.

Start with n = 9. One click calls setN(n + 8); setN(x => x * 2); setN(x => x - 1). Trace the pending values and explain the final result.

Explained feedback: The queue produces 17, then 34, then 33. The replacement is followed by two updaters that each receive the pending value.

### Day 14 review

Start with count = 16. One click calls setCount(count + 15) twice, then logs count. Predict the log and the next screen value. Explain why.

Explained feedback: The log is 16. The next screen shows 31. Both setters use the same render's snapshot and queue the same replacement, 16 + 15.

Start with n = 16. One click calls setN(n + 15); setN(x => x * 2); setN(x => x - 1). Trace the pending values and explain the final result.

Explained feedback: The queue produces 31, then 62, then 61. The replacement is followed by two updaters that each receive the pending value.

## Interview preparation

These are original interview-style questions. They are not presented as recorded questions from any particular company.

### iq01: How does state differ from a regular variable?

React keeps state between renders, and a setter requests an update. Assigning a local variable does not do this.

Follow-up: Do two copies of the same component share state?

Reference: [Component memory](https://react.dev/learn/state-a-components-memory).

### iq02: Why does a log show the old value after setCount?

The handler reads the current render's snapshot. The setter does not rewrite that variable.

Follow-up: Why can a timer show the same behavior?

Reference: [State as a snapshot](https://react.dev/learn/state-as-a-snapshot).

### iq03: When should you use a functional updater?

Use it when the next value depends on pending previous state, especially with queued or delayed updates.

Follow-up: Compare three replacements with three updater functions.

Reference: [State update queues](https://react.dev/learn/queueing-a-series-of-state-updates).

### iq04: Does a state setter merge objects?

No. It replaces the object. Copy the fields you want to keep.

Follow-up: Is one spread enough for a nested update?

Reference: [Updating objects](https://react.dev/learn/updating-objects-in-state).

### iq05: What can go wrong if you mutate an array in state?

You change old data while possibly keeping the same reference. React may skip an update, and earlier snapshots may contain changed data.

Follow-up: Is changing an item directly inside map safe?

Reference: [Updating arrays](https://react.dev/learn/updating-arrays-in-state).

### iq06: Does state update when its initial prop changes?

No. The initializer does not keep existing state in sync. Choose controlled props, a calculated value, or an intentional reset based on who manages the data.

Follow-up: How does changing a key differ from resetting one value with a setter?

Reference: [Preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state).

### iq07: Why can StrictMode call an initializer again?

It helps find accidental side effects in development. A pure initializer is safe to repeat. This is not a rule that event handlers run twice.

Follow-up: Should an updater make a network request?

Reference: [StrictMode](https://react.dev/reference/react/StrictMode).

### iq08: Why can you not call useState inside a condition?

React needs a stable Hook call order. Skipping a call can break state matching.

Follow-up: Is it safe to place a Hook after a conditional early return?

Reference: [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

### iq09: Should total price be stored in state?

If it can be calculated from existing inputs, calculate it instead of keeping duplicate state in sync.

Follow-up: What changes if the user can enter a discount?

Reference: [Choosing state structure](https://react.dev/learn/choosing-the-state-structure).

### iq10: Does component state survive a page refresh?

No. Component state is not permanent storage. Keeping data after a refresh requires a separate storage strategy.

Follow-up: What are the different roles of localStorage and state?

Reference: [Component memory](https://react.dev/learn/state-a-components-memory).

### iq11: Does a re-render replace the whole DOM?

No. Rendering calculates the UI. The commit applies the needed DOM changes.

Follow-up: Does seeing a render in React DevTools prove that the app is slow?

Reference: [Render and commit](https://react.dev/learn/render-and-commit).

### iq12: Why might a controlled input prevent typing?

It may be missing an onChange handler, or the handler may not store the typed value.

Follow-up: Why does a checkbox use checked to control its selection?

Reference: [Input reference](https://react.dev/reference/react-dom/components/input).

## Publication checks

- authored: done
- sourcesReviewed: done
- codeSyntaxChecked: done
- browserBehaviorChecked: pending
- independentContentReview: pending
- learnerTrial: pending
- serverInitialRenderChecked: done

Sample available in the learning UI with a solution modal and local practice records. Publishing still requires the remaining content and browser checks.
