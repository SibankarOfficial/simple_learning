# Mini app: Notebook quantity picker

Generated from the JSON content. Edit JSON, then regenerate. Content review date: 2026-09-10.

Choose 1–5 notebooks, show the total, and reset the quantity. Explain your state choices instead of copying the tutorial code.

## Concepts used

- useState
- Passing event handlers
- Choosing minimal state
- Conditional rendering and null

## Acceptance requirements

- Initially quantity 1
- Unit price 120
- Quantity must stay between 1 and 5
- Total derives from quantity
- Plus/minus reflect boundaries
- Reset restores initial quantity
- Controls have meaningful accessible names

## Step 1: Plan the UI and rules

Sketch the quantity, total, plus, minus, and reset controls. Write the allowed range.


```jsx
const MIN = 1;
const MAX = 5;
const UNIT_PRICE = 120;
```


These are incremental fragments inside the React module; use the complete module below when running the final app.

Why: Clear acceptance criteria help you decide what to build.

Check: Quantities 0 and 6 are not allowed. The price is fixed.

## Step 2: Choose the minimum state

Add one quantity state variable at the top level of App.


```jsx
const [quantity, setQuantity] = useState(1);
const total = quantity * UNIT_PRICE;
```


These are incremental fragments inside the React module; use the complete module below when running the final app.

Why: Calculating the total avoids keeping duplicate values in sync.

Check: The total does not need a setter.

## Step 3: Add increase and decrease actions

Use functional updaters to enforce the limits.


```jsx
const increase = () => setQuantity(q => Math.min(MAX, q + 1));
const decrease = () => setQuantity(q => Math.max(MIN, q - 1));
```


These are incremental fragments inside the React module; use the complete module below when running the final app.

Why: The update logic must enforce the rules too.

Check: Repeated increases stop at 5. Repeated decreases stop at 1.

## Step 4: Connect the controls

Add named buttons, disable them at the limits, and show the total.


```jsx
<button aria-label="Increase quantity" disabled={quantity === MAX} onClick={increase}>+</button>
```


These are incremental fragments inside the React module; use the complete module below when running the final app.

Why: A visual symbol also needs a clear accessible name.

Check: The buttons work with a keyboard. The plus button is disabled at the maximum.

## Step 5: Add reset

Set quantity back to its initial value when Reset is clicked.


```jsx
<button onClick={() => setQuantity(1)}>Reset</button>
```


These are incremental fragments inside the React module; use the complete module below when running the final app.

Why: The total updates from quantity, so it needs no extra setter.

Check: Resetting from 5 gives quantity 1 and total 120.

## Step 6: Build it again without the example

Close the final code and rebuild the feature in a blank App.jsx file.

Why: Move from following instructions to building independently.

Check: Pass every acceptance scenario below and explain each state choice.

## Complete App.jsx


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


## Check behavior

| Given | When | Then |
| --- | --- | --- |
| First render | No interaction | Quantity 1, total 120; minus disabled |
| Quantity 1 | Increase four times | Quantity 5, total 600; plus disabled |
| Quantity 5 | Try increasing again | Quantity stays 5 |
| Quantity 5 | Decrease four times | Quantity 1, total 120; minus disabled |
| Quantity 4 | Reset | Quantity 1 and total 120 |
| Keyboard navigation | Tab then activate enabled control | Meaningful name and expected update |

## Related independent ideas

### Cinema seat quantity

Build a seat picker with a range of 1–8 seats, a price of 250 per seat, reset, and a calculated total. Write the full code yourself.

- Bounds 1–8
- Total always seats × 250
- Clear button labels

### Daily reading target

Build a daily reading target from 5–60 pages, with steps of 5 and a reset to 10. Write down what must change before coding.

- Step size 5
- Boundaries respected
- Reset restores 10

## Extend after the base works

- Make price a prop and explain why total still is derived.
- Support changing stock: define what happens when stock becomes zero before changing code.
- Share quantity with a sibling order summary by lifting state.

References: [Component memory](https://react.dev/learn/state-a-components-memory), [Choosing state structure](https://react.dev/learn/choosing-the-state-structure), [Responding to events](https://react.dev/learn/responding-to-events).

[Return to useState](USESTATE.md). Browser acceptance scenarios are authored; they have not been executed yet.
