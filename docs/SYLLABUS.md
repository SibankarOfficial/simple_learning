# React syllabus — ordered coverage draft

Generated from the JSON content. Edit JSON, then regenerate. Coverage review date: 2026-09-20.

30 chapters · 324 topics · 35 authored sample lessons. Planned topics are syllabus destinations, not completed lessons.

Your learning path: prerequisites → components/props/events → state → forms/reducers/refs/effects → reusable logic/data/routing → performance/actions → server/tooling → production/legacy. Start a linked mini app once you understand its required concepts. Web foundations now has its own project, and the first React-state project follows useState; you do not need to wait until chapter 29.

Core topics are broad coverage; ecosystem topics are a selected practical track. Reference and version-watch topics are later-depth material. A prerequisite means conceptually needed, not that its lesson is already written.

## Chapter overview

| Order | Chapter | Track | Topics |
| --- | --- | --- | --- |
| 1 | Web foundations | prerequisite | 6 |
| 2 | JavaScript foundations | prerequisite | 19 |
| 3 | React setup and orientation | core | 9 |
| 4 | Components and JSX | core | 11 |
| 5 | Props and composition | core | 9 |
| 6 | Conditions lists and events | core | 9 |
| 7 | Hooks: foundations and useState | core | 12 |
| 8 | State design and ownership | core | 12 |
| 9 | Forms and accessible interactions | core | 10 |
| 10 | Hooks: reducers and context | core | 10 |
| 11 | Hooks: refs and imperative integration | core | 9 |
| 12 | Hooks: effects and synchronization | core | 12 |
| 13 | Custom Hooks and reusable logic | core | 8 |
| 14 | Asynchronous UI and data | ecosystem | 8 |
| 15 | Routing and URL state | ecosystem | 8 |
| 16 | Rendering performance | core | 15 |
| 17 | Hooks: Actions and forms | core | 8 |
| 18 | React DOM reference | core | 13 |
| 19 | Advanced rendering and identity | core | 9 |
| 20 | Server rendering and hydration | core | 16 |
| 21 | Server Components and server functions | core | 12 |
| 22 | React Compiler | tooling | 11 |
| 23 | React rules and lint reference | tooling | 19 |
| 24 | TypeScript with React | ecosystem | 8 |
| 25 | Testing and debugging | ecosystem | 12 |
| 26 | Production application engineering | ecosystem | 12 |
| 27 | Legacy React and migration | legacy | 13 |
| 28 | Version watch and specialized APIs | version-watch | 6 |
| 29 | Mini app progression | project | 14 |
| 30 | Larger projects: later phase | project | 4 |

## 1. Web foundations

Level: foundation. Track: prerequisite. Prerequisites: none.

1. How browser pages work — lesson JSON available in the app (sample-draft)
2. Semantic HTML and forms — lesson JSON available in the app (sample-draft)
3. CSS selectors and cascade — lesson JSON available in the app (sample-draft)
4. Box model and responsive layout — lesson JSON available in the app (sample-draft)
5. Accessibility and keyboard basics — lesson JSON available in the app (sample-draft)
6. Browser DevTools and console — lesson JSON available in the app (sample-draft)

Scope sources: [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works), [How browsers load websites](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_browsers_load_websites), [HTML: A good basis for accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML), [Forms and buttons in HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms), [Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation), [Basic CSS selectors](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors), [Handling CSS conflicts](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts), [The box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model), [Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design), [Keyboard accessible](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard), [What are browser developer tools?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools).

Linked mini app: [Accessible course signup page](MINI-APPS.md#accessible-course-signup).

## 2. JavaScript foundations

Level: foundation. Track: prerequisite. Prerequisites: web-basics.

7. Values types and coercion — lesson JSON available in the app (sample-draft)
8. let const and scope — lesson JSON available in the app (sample-draft)
9. Expressions operators and equality — lesson JSON available in the app (sample-draft)
10. Conditionals and loops — lesson JSON available in the app (sample-draft)
11. Functions declarations and arrows — lesson JSON available in the app (sample-draft)
12. Parameters defaults and return values — lesson JSON available in the app (sample-draft)
13. Objects and property access — lesson JSON available in the app (sample-draft)
14. Arrays and iteration — lesson JSON available in the app (sample-draft)
15. Destructuring — lesson JSON available in the app (sample-draft)
16. Spread and rest — lesson JSON available in the app (sample-draft)
17. map filter find and reduce — lesson JSON available in the app (sample-draft)
18. Modules import and export — lesson JSON available in the app (sample-draft)
19. Closures and lexical scope — lesson JSON available in the app (sample-draft)
20. References mutation and shallow copy — lesson JSON available in the app (sample-draft)
21. Optional chaining and nullish coalescing — lesson JSON available in the app (sample-draft)
22. Promises async await and errors — lesson JSON available in the app (sample-draft)
23. Event loop and timers — lesson JSON available in the app (sample-draft)
24. Fetch JSON and HTTP — lesson JSON available in the app (sample-draft)
25. Exceptions and debugging — lesson JSON available in the app (sample-draft)

Scope sources: [Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types), [JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures), [Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators), [Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling), [Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration), [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions), [Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects), [Indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections), [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring), [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures), [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), [Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing), [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), [JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model), [Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status).

Linked mini app: [Study session report](MINI-APPS.md#study-session-report).

## 3. React setup and orientation

Level: beginner. Track: core. Prerequisites: javascript-basics.

26. What React solves and its boundaries — lesson JSON available in the app (sample-draft)
27. Declarative UI and component thinking — lesson JSON available in the app (sample-draft)
28. Editor Node package manager and terminal — lesson JSON available in the app (sample-draft)
29. Create a learning project with Vite — lesson JSON available in the app (sample-draft)
30. Framework versus build tool — lesson JSON available in the app (sample-draft)
31. Project files scripts and dependencies — lesson JSON available in the app (sample-draft)
32. Development versus production — lesson JSON available in the app (sample-draft)
33. React DevTools — lesson JSON available in the app (sample-draft)
34. Adding React to an existing page — lesson JSON available in the app (sample-draft)

Scope sources: [Installation](https://react.dev/learn/installation), [Build a React app from scratch](https://react.dev/learn/build-a-react-app-from-scratch), [Thinking in React](https://react.dev/learn/thinking-in-react), [Reacting to input with state](https://react.dev/learn/reacting-to-input-with-state), [Your first component](https://react.dev/learn/your-first-component), [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/), [package.json](https://docs.npmjs.com/files/package.json/), [Getting Started](https://vite.dev/guide/), [Features](https://vite.dev/guide/features), [Specifying dependencies and devDependencies](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file/), [createRoot](https://react.dev/reference/react-dom/client/createRoot), [Building for Production](https://vite.dev/guide/build), [React Developer Tools](https://react.dev/learn/react-developer-tools), [Add React to an existing project](https://react.dev/learn/add-react-to-an-existing-project).

Linked mini app: [First React learning workspace](MINI-APPS.md#first-react-workspace).

## 4. Components and JSX

Level: beginner. Track: core. Prerequisites: setup.

35. Function components and naming (planned)
36. Function declaration versus arrow component (planned)
37. Import and export components (planned)
38. JSX rules and compilation (planned)
39. Expressions inside JSX (planned)
40. Fragments and keyed Fragments (planned)
41. CSS classes and inline styles (planned)
42. Images assets and SVG (planned)
43. Component composition and children (planned)
44. Render trees and module dependency trees (planned)
45. Component purity and idempotence (planned)

Scope sources: [Describing the UI](https://react.dev/learn/describing-the-ui).

## 5. Props and composition

Level: beginner. Track: core. Prerequisites: components-jsx.

46. Passing and reading props (planned)
47. Destructuring and default values (planned)
48. Numbers objects arrays and functions as props (planned)
49. children and slots (planned)
50. Props spread and explicit interfaces (planned)
51. Props are read only (planned)
52. Callback props and one way data flow (planned)
53. key and ref are special (planned)
54. Component API design (planned)

Scope sources: [Describing the UI](https://react.dev/learn/describing-the-ui).

## 6. Conditions lists and events

Level: beginner. Track: core. Prerequisites: props.

55. Conditional rendering and null (planned)
56. Ternary and logical AND pitfalls (planned)
57. Rendering lists with map and filter (planned)
58. Stable keys and identity (planned)
59. Nested lists and keyed fragments (planned)
60. Passing event handlers (planned)
61. Event arguments and custom handler names (planned)
62. Event propagation capture and stopPropagation (planned)
63. preventDefault and form submission (planned)

Scope sources: [Adding Interactivity](https://react.dev/learn/adding-interactivity).

Linked mini app: [Notebook quantity picker](MINI-APPS.md#quantity-picker).

## 7. Hooks: foundations and useState

Level: beginner. Track: core. Prerequisites: rendering.

64. Rules of Hooks and call order (planned)
65. useState — [sample lesson](USESTATE.md) (sample-draft)
66. Render trigger render and commit (planned)
67. State snapshots and closures (planned)
68. Functional updates and update queues (planned)
69. Batching and event boundaries (planned)
70. Object state and nested immutable updates (planned)
71. Array state add edit remove sort (planned)
72. Lazy initialization (planned)
73. State equality and Object.is (planned)
74. State isolation per component (planned)
75. Storing a function in state (planned)

Scope sources: [useState reference](https://react.dev/reference/react/useState), [Component memory](https://react.dev/learn/state-a-components-memory), [State as a snapshot](https://react.dev/learn/state-as-a-snapshot), [State update queues](https://react.dev/learn/queueing-a-series-of-state-updates), [Updating objects](https://react.dev/learn/updating-objects-in-state), [Updating arrays](https://react.dev/learn/updating-arrays-in-state), [Choosing state structure](https://react.dev/learn/choosing-the-state-structure), [Preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state), [Input reference](https://react.dev/reference/react-dom/components/input), [StrictMode](https://react.dev/reference/react/StrictMode), [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks), [Render and commit](https://react.dev/learn/render-and-commit).

Linked mini app: [Notebook quantity picker](MINI-APPS.md#quantity-picker).

## 8. State design and ownership

Level: intermediate. Track: core. Prerequisites: hooks-foundation.

76. Reacting to input with state (planned)
77. State versus props ref and local variable (planned)
78. Choosing minimal state (planned)
79. Derived state and avoiding duplication (planned)
80. Avoiding contradictory state (planned)
81. Lifting state up (planned)
82. Controlled and uncontrolled components (planned)
83. Preserving state by type position and key (planned)
84. Resetting state intentionally (planned)
85. Why copying props into state can fail (planned)
86. Structuring deeply nested data (planned)
87. Guarded updates during render (planned)

Scope sources: [Managing State](https://react.dev/learn/managing-state).

Linked mini app: [Notebook quantity picker](MINI-APPS.md#quantity-picker).

## 9. Forms and accessible interactions

Level: intermediate. Track: core. Prerequisites: state-design.

88. Controlled text inputs (planned)
89. Checkboxes radio groups and select (planned)
90. Textarea and multiple fields (planned)
91. Uncontrolled inputs and defaultValue (planned)
92. FormData and file inputs (planned)
93. Validation touched and error states (planned)
94. Dynamic field lists (planned)
95. Accessible labels descriptions and errors (planned)
96. Focus management and keyboard interactions (planned)
97. Multi step forms (planned)

Scope sources: [React DOM Components](https://react.dev/reference/react-dom/components).

## 10. Hooks: reducers and context

Level: intermediate. Track: core. Prerequisites: state-design.

98. useReducer (planned)
99. Pure reducers actions and dispatch (planned)
100. Reducer initialization and testing (planned)
101. useState versus useReducer (planned)
102. createContext (planned)
103. useContext (planned)
104. Provider syntax and default fallback (planned)
105. Context identity and render behavior (planned)
106. Combining context and reducer (planned)
107. State colocation versus global state (planned)

Scope sources: [React Hooks index](https://react.dev/reference/react/hooks).

## 11. Hooks: refs and imperative integration

Level: intermediate. Track: core. Prerequisites: state-design.

108. useRef (planned)
109. State versus refs (planned)
110. DOM refs and focus (planned)
111. Callback refs and cleanup (planned)
112. Ref as a prop (planned)
113. useImperativeHandle (planned)
114. Working with third party DOM widgets (planned)
115. Portals and createPortal (planned)
116. Accessible dialogs and focus restoration (planned)

Scope sources: [Escape Hatches](https://react.dev/learn/escape-hatches).

## 12. Hooks: effects and synchronization

Level: intermediate. Track: core. Prerequisites: refs.

117. useEffect (planned)
118. Effect setup and cleanup (planned)
119. Dependencies and reactive values (planned)
120. Effect lifecycle and StrictMode (planned)
121. Subscriptions timers and cleanup (planned)
122. Fetching in effects race conditions and cancellation (planned)
123. Separating events from effects (planned)
124. Removing unnecessary dependencies (planned)
125. You might not need an Effect (planned)
126. useEffectEvent (planned)
127. useLayoutEffect (planned)
128. useInsertionEffect (planned)

Scope sources: [Escape Hatches](https://react.dev/learn/escape-hatches).

## 13. Custom Hooks and reusable logic

Level: intermediate. Track: core. Prerequisites: effects.

129. Extracting a custom Hook (planned)
130. Naming parameters return values and contracts (planned)
131. Each Hook call has independent state (planned)
132. Composing Hooks (planned)
133. Avoiding lifecycle wrapper Hooks (planned)
134. useDebugValue (planned)
135. Testing custom Hooks (planned)
136. Publishing reusable Hook utilities (planned)

Scope sources: [Escape Hatches](https://react.dev/learn/escape-hatches).

## 14. Asynchronous UI and data

Level: intermediate. Track: ecosystem. Prerequisites: effects.

137. Loading error empty success states (planned)
138. AbortController and stale responses (planned)
139. Pagination and infinite scrolling (planned)
140. Debouncing throttling and request timing (planned)
141. Caching deduplication and invalidation (planned)
142. Optimistic updates and rollback (planned)
143. Server state versus client state (planned)
144. Offline retry and reconnect strategies (planned)

Scope sources: [Escape Hatches](https://react.dev/learn/escape-hatches).

## 15. Routing and URL state

Level: intermediate. Track: ecosystem. Prerequisites: state-design.

145. Client navigation and browser history (planned)
146. Route trees params and nested layouts (planned)
147. Search params as state (planned)
148. Not found redirects and navigation errors (planned)
149. Route loaders and mutations (planned)
150. Pending navigation and prefetching (planned)
151. Code splitting at route boundaries (planned)
152. Protected UI and server authorization boundaries (planned)

Specialist official sources: pending review before lesson authoring.

## 16. Rendering performance

Level: advanced. Track: core. Prerequisites: custom-hooks.

153. Measuring before optimizing (planned)
154. memo (planned)
155. useMemo (planned)
156. useCallback (planned)
157. Referential equality and dependency identity (planned)
158. Profiler and React DevTools profiling (planned)
159. List virtualization (planned)
160. Code splitting and lazy (planned)
161. Suspense boundaries and fallbacks (planned)
162. Suspense enabled data sources (planned)
163. Avoiding waterfalls (planned)
164. Transition versus urgent update (planned)
165. useTransition (planned)
166. startTransition (planned)
167. useDeferredValue (planned)

Scope sources: [React APIs index](https://react.dev/reference/react/apis).

## 17. Hooks: Actions and forms

Level: advanced. Track: core. Prerequisites: forms, performance.

168. Actions and async transitions (planned)
169. Form action and button formAction (planned)
170. useActionState (planned)
171. useFormStatus (planned)
172. useOptimistic (planned)
173. Pending errors and optimistic rollback (planned)
174. Form reset behavior (planned)
175. Progressive enhancement and server validation (planned)

Scope sources: [React DOM Hooks](https://react.dev/reference/react-dom/hooks).

## 18. React DOM reference

Level: advanced. Track: core. Prerequisites: refs, forms.

176. Common DOM props and synthetic events (planned)
177. HTML SVG and custom elements (planned)
178. dangerouslySetInnerHTML and trusted content (planned)
179. Hydration warnings and suppression limits (planned)
180. title meta link style and script (planned)
181. Resource precedence and loading (planned)
182. flushSync (planned)
183. prefetchDNS (planned)
184. preconnect (planned)
185. preload (planned)
186. preloadModule (planned)
187. preinit (planned)
188. preinitModule (planned)

Scope sources: [React DOM APIs](https://react.dev/reference/react-dom).

## 19. Advanced rendering and identity

Level: advanced. Track: core. Prerequisites: performance.

189. StrictMode development checks (planned)
190. Interruptible rendering mental model (planned)
191. Suspense reveal and reset behavior (planned)
192. Activity and retained UI (planned)
193. useId and accessible IDs (planned)
194. useSyncExternalStore (planned)
195. External store snapshots and hydration (planned)
196. Error boundaries and recovery (planned)
197. Render errors versus event and async errors (planned)

Scope sources: [React Components index](https://react.dev/reference/react/components).

## 20. Server rendering and hydration

Level: advanced. Track: core. Prerequisites: concurrent.

198. CSR SSR SSG and streaming (planned)
199. createRoot root.render and root.unmount (planned)
200. hydrateRoot and recoverable errors (planned)
201. Hydration mismatches and deterministic rendering (planned)
202. renderToPipeableStream (planned)
203. renderToReadableStream (planned)
204. renderToString (planned)
205. renderToStaticMarkup (planned)
206. Streaming Suspense and bootstrap options (planned)
207. resume (planned)
208. resumeToPipeableStream (planned)
209. prerender (planned)
210. prerenderToNodeStream (planned)
211. resumeAndPrerender (planned)
212. resumeAndPrerenderToNodeStream (planned)
213. Environment and stream compatibility (planned)

Scope sources: [React DOM Server](https://react.dev/reference/react-dom/server).

## 21. Server Components and server functions

Level: advanced. Track: core. Prerequisites: server-rendering, actions.

214. Server Components versus SSR (planned)
215. Client and server module boundaries (planned)
216. use client directive (planned)
217. Serializable boundary values (planned)
218. Composition across server and client (planned)
219. Server Functions and use server (planned)
220. Validation authorization and untrusted arguments (planned)
221. use with Promise and context (planned)
222. Suspense and errors around use (planned)
223. cache (planned)
224. cacheSignal (planned)
225. Framework and bundler integration constraints (planned)

Scope sources: [Server Components](https://react.dev/reference/rsc/server-components).

## 22. React Compiler

Level: advanced. Track: tooling. Prerequisites: performance.

226. Compiler mental model and installation (planned)
227. Incremental adoption and verification (planned)
228. compilationMode (planned)
229. target and runtime compatibility (planned)
230. panicThreshold (planned)
231. logger (planned)
232. gating (planned)
233. use memo directive (planned)
234. use no memo directive (planned)
235. Compiling libraries (planned)
236. Compiler debugging and memoization limits (planned)

Scope sources: [Compiler configuration](https://react.dev/reference/react-compiler/configuration).

## 23. React rules and lint reference

Level: advanced. Track: tooling. Prerequisites: custom-hooks.

237. Components and Hooks must be pure (planned)
238. React calls Components and Hooks (planned)
239. rules-of-hooks lint (planned)
240. exhaustive-deps lint (planned)
241. component-hook-factories (planned)
242. config lint (planned)
243. error-boundaries lint (planned)
244. gating lint (planned)
245. globals lint (planned)
246. immutability lint (planned)
247. incompatible-library lint (planned)
248. preserve-manual-memoization lint (planned)
249. purity lint (planned)
250. refs lint (planned)
251. set-state-in-effect lint (planned)
252. set-state-in-render lint (planned)
253. static-components lint (planned)
254. unsupported-syntax lint (planned)
255. use-memo lint (planned)

Scope sources: [ESLint React Hooks](https://react.dev/reference/eslint-plugin-react-hooks).

## 24. TypeScript with React

Level: intermediate. Track: ecosystem. Prerequisites: state-design.

256. Typing component props and children (planned)
257. Events refs and DOM types (planned)
258. useState unions and nullable values (planned)
259. Reducer discriminated unions (planned)
260. Context with safe defaults (planned)
261. Generic components and Hooks (planned)
262. ComponentProps and utility types (planned)
263. Type narrowing and exhaustive checks (planned)

Specialist official sources: pending review before lesson authoring.

## 25. Testing and debugging

Level: intermediate. Track: ecosystem. Prerequisites: effects, forms.

264. Behavior based component tests (planned)
265. Queries by role label and text (planned)
266. User interactions and async assertions (planned)
267. Testing forms and validation (planned)
268. Mocking network boundaries (planned)
269. Hook and reducer tests (planned)
270. Error and loading state tests (planned)
271. Accessibility checks (planned)
272. End to end user journeys (planned)
273. act (planned)
274. captureOwnerStack (planned)
275. Debugging render loops and stale closures (planned)

Specialist official sources: pending review before lesson authoring.

## 26. Production application engineering

Level: advanced. Track: ecosystem. Prerequisites: routing, testing.

276. Feature based architecture (planned)
277. Error reporting and observability (planned)
278. Environment configuration and secrets boundary (planned)
279. Authentication UI and session expiry (planned)
280. Authorization enforced on server (planned)
281. XSS and untrusted content (planned)
282. Accessibility audit and internationalization (planned)
283. Performance budgets and bundle inspection (planned)
284. CI checks and production builds (planned)
285. Deployment caching and rollback (planned)
286. Design systems and reusable components (planned)
287. State library and query library selection (planned)

Specialist official sources: pending review before lesson authoring.

## 27. Legacy React and migration

Level: advanced. Track: legacy. Prerequisites: custom-hooks.

288. Component and class lifecycle methods (planned)
289. Class setState merge and callback (planned)
290. PureComponent (planned)
291. createElement (planned)
292. cloneElement (planned)
293. Children utilities (planned)
294. createRef (planned)
295. forwardRef (planned)
296. isValidElement (planned)
297. Render props and higher order components (planned)
298. Class to Hook migration (planned)
299. Removed React DOM APIs (planned)
300. Deprecated patterns and version migration (planned)

Scope sources: [Legacy React APIs](https://react.dev/reference/react/legacy).

## 28. Version watch and specialized APIs

Level: advanced. Track: version-watch. Prerequisites: server-components.

301. ViewTransition (planned)
302. addTransitionType (planned)
303. browser API with use (planned)
304. Experimental taint APIs (planned)
305. Release channels and compatibility review (planned)
306. React Native and custom renderers scope (planned)

Scope sources: [React APIs index](https://react.dev/reference/react/apis).

## 29. Mini app progression

Level: beginner. Track: project. Prerequisites: hooks-foundation.

307. Counter and quantity controls (planned)
308. Disclosure and accordion (planned)
309. Profile editor (planned)
310. Filterable catalog (planned)
311. Task board (planned)
312. Quiz and flashcards (planned)
313. Shopping cart (planned)
314. Multi step booking form (planned)
315. Search with cancellable requests (planned)
316. Context based preferences (planned)
317. Router based dashboard (planned)
318. Accessible dialog manager (planned)
319. Optimistic comment form (planned)
320. SSR and hydration demo (planned)

Scope sources: [React Quick Start](https://react.dev/learn).

## 30. Larger projects: later phase

Level: advanced. Track: project. Prerequisites: production.

321. Learning tracker (planned)
322. Commerce dashboard (planned)
323. Collaborative workspace (planned)
324. Production readiness review (planned)

Specialist official sources: pending review before lesson authoring.

## Coverage policy

See [coverage mappings and open audits](COVERAGE.md). The reference inventory is a dated scope baseline, not a guarantee of all possible applications of React.
