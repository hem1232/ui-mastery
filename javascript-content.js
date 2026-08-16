window.JS_CONTENT = {
  label: 'JavaScript',
  topics: [

// ============================================================
{
  id: 'execution-context-scope',
  title: 'Execution Context, Scope & Hoisting',
  dek: 'What actually happens before your code runs a single line.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Before executing any code, the JS engine creates an <b>execution context</b> in two phases: <b>creation phase</b> (allocates memory for variables/functions, sets up scope chain and <code>this</code>) then <b>execution phase</b> (runs code line by line). This is why <code>function</code> declarations are fully usable before their line of code ("hoisted"), while <code>let</code>/<code>const</code> are hoisted but left in an uninitialized <b>Temporal Dead Zone</b> — accessing them before declaration throws a <code>ReferenceError</code> rather than returning <code>undefined</code>.</p>
      <p><b>Scope</b> is lexical (determined by where code is written, not where it's called) — every function creates a new scope, and inner scopes can access outer variables via the <b>scope chain</b>, but not vice versa.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
console.log(fn());     // "hoisted!" — function declarations fully hoisted
console.log(typeof v); // "undefined" — var hoisted, initialized to undefined
console.log(l);        // ReferenceError — TDZ, let hoisted but NOT initialized

function fn() { return "hoisted!"; }
var v = 1;
let l = 2;

function outer() {
  const x = 10;
  function inner() {
    console.log(x); // 10 — inner can read outer's scope (scope chain)
  }
  inner();
}
// outer's x is NOT accessible outside outer() — lexical scoping`, 'scope.js')}
    </section>
    <section class="block">
      ${h2('Scope Chain Diagram')}
      ${diagram(`
        <svg viewBox="0 0 420 220" width="100%" style="max-width:420px;display:block;margin:0 auto;">
          <rect x="10" y="10" width="400" height="200" rx="8" fill="#3fd97710" stroke="#3fd977"/>
          <text x="20" y="28" fill="#3fd977" font-family="JetBrains Mono" font-size="11">Global scope</text>
          <rect x="30" y="45" width="360" height="150" rx="8" fill="#3fd97718" stroke="#3fd977"/>
          <text x="40" y="63" fill="#3fd977" font-family="JetBrains Mono" font-size="11">outer() scope { x: 10 }</text>
          <rect x="50" y="80" width="320" height="95" rx="8" fill="#3fd97722" stroke="#3fd977"/>
          <text x="60" y="98" fill="#f1f5f9" font-family="JetBrains Mono" font-size="11">inner() scope</text>
          <text x="60" y="120" fill="#f1f5f9" font-family="JetBrains Mono" font-size="11">console.log(x) →</text>
          <text x="60" y="138" fill="#7c8798" font-family="JetBrains Mono" font-size="10.5">not found here, walk UP the chain...</text>
          <text x="60" y="156" fill="#7c8798" font-family="JetBrains Mono" font-size="10.5">found in outer() scope → 10</text>
        </svg>
      `, 'Lookups walk outward through the scope chain, never inward')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Debugging "undefined" bugs', body:'Understanding var vs let hoisting explains a huge class of "works sometimes" bugs in loops and async callbacks.' },
        { title:'Module encapsulation', body:'Lexical scoping is what lets a module keep internal helper functions private, exposing only what\'s explicitly exported.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'closures',
  title: 'Closures',
  dek: 'A function that remembers the variables from where it was created — even after that scope has finished executing.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A closure is formed when an inner function references variables from its outer (enclosing) function. Even after the outer function returns, the inner function retains a live reference to those variables — the JS engine keeps them in memory instead of garbage-collecting them, because the closure still needs them.</p>
      ${callout('Interview framing', `Closures aren't a special syntax — they happen automatically any time a function is defined inside another function and uses variables from it. The "trick" is recognizing that the captured variables are <b>live references</b>, not snapshots.`)}
    </section>
    <section class="block">
      ${h2('Example — Private State (Module Pattern)')}
      ${codeBlock('js', `
function createCounter() {
  let count = 0;               // private — no external access
  return {
    increment: () => ++count,
    reset: () => { count = 0; },
    get value() { return count; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.value); // 2
// 'count' is completely inaccessible from outside — true encapsulation

// Classic gotcha: closures in loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // logs 3, 3, 3 — var is function-scoped, shared
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // logs 0, 1, 2 — let creates a new binding per iteration
}`, 'closures.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'React/Angular hooks & signals', body:'Custom hooks and signal factories rely on closures to keep internal state private per-instance.' },
        { title:'Debounce / throttle utilities', body:'Both patterns close over a timer ID variable that persists between calls to the returned function.' },
        { title:'Event handler factories', body:'<code>onClick={() => handleDelete(item.id)}</code> is a closure capturing <code>item.id</code> at render time.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'this-keyword',
  title: 'The "this" Keyword',
  dek: 'Determined by HOW a function is called, not where it\'s defined — except for arrow functions, which break that rule on purpose.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Unlike closures (lexical), <code>this</code> is dynamic — its value is determined by the <b>call site</b>, following these rules in priority order:</p>
      <ol>
        <li><code>new Fn()</code> → <code>this</code> is the newly created object</li>
        <li><code>fn.call(obj)</code> / <code>.apply()</code> / <code>.bind(obj)</code> → <code>this</code> is explicitly set to <code>obj</code></li>
        <li><code>obj.method()</code> → <code>this</code> is <code>obj</code> (whatever is left of the dot)</li>
        <li>Plain function call → <code>this</code> is <code>undefined</code> in strict mode (or <code>window</code> in sloppy mode)</li>
      </ol>
      <p><b>Arrow functions have no own <code>this</code></b> — they capture it lexically from their enclosing scope at definition time, which is why they solved the classic "callback loses this" problem.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
class Timer {
  seconds = 0;

  startBroken() {
    setInterval(function () {
      this.seconds++;         // 'this' is undefined here — plain function call
    }, 1000);                  // TypeError: Cannot read properties of undefined
  }

  startFixed() {
    setInterval(() => {
      this.seconds++;         // arrow fn: 'this' lexically = the Timer instance ✓
    }, 1000);
  }
}

const btn = document.querySelector('button');
btn.addEventListener('click', function () {
  console.log(this); // 'this' = btn (the element — "left of the dot" caller)
});`, 'this.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Class methods as callbacks', body:'Passing <code>this.handleClick</code> as a callback loses binding — solved with arrow class fields or <code>.bind(this)</code> in the constructor.' },
        { title:'Event handlers', body:'Knowing <code>this</code> = the element that fired the event is used constantly for generic, reusable DOM handlers.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'prototypes-oop',
  title: 'Prototypes & Object-Oriented JS',
  dek: 'How inheritance actually works under the hood — classes are syntax sugar over the prototype chain.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>JavaScript objects link to another object via an internal <code>[[Prototype]]</code> reference (exposed as <code>__proto__</code>, set via <code>Object.getPrototypeOf</code>). When you access a property, the engine walks up this <b>prototype chain</b> until it finds it (or reaches <code>null</code>). <code>class</code> syntax (ES6) is syntactic sugar over this exact mechanism — it doesn't introduce a new inheritance model, just a cleaner way to write it.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound.\`; }
}

class Dog extends Animal {
  speak() { return \`\${this.name} barks.\`; }        // overrides
  parentSpeak() { return super.speak(); }              // explicit prototype walk
}

const rex = new Dog('Rex');
console.log(rex.speak());         // "Rex barks."
console.log(rex.parentSpeak());   // "Rex makes a sound."

// Under the hood — this is what 'class'/'extends' compiles down to:
console.log(Object.getPrototypeOf(rex) === Dog.prototype);          // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true`, 'prototypes.js')}
    </section>
    <section class="block">
      ${h2('Prototype Chain Diagram')}
      ${diagram(`
        <svg viewBox="0 0 500 130" width="100%" style="max-width:500px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="11.5">
            <rect x="10" y="45" width="110" height="40" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="65" y="70" text-anchor="middle" fill="#f1f5f9">rex</text>
            <line x1="120" y1="65" x2="170" y2="65" stroke="#7c8798" marker-end="url(#pa)"/>
            <rect x="170" y="45" width="130" height="40" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="235" y="70" text-anchor="middle" fill="#f1f5f9">Dog.prototype</text>
            <line x1="300" y1="65" x2="350" y2="65" stroke="#7c8798" marker-end="url(#pa)"/>
            <rect x="350" y="45" width="140" height="40" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="420" y="70" text-anchor="middle" fill="#f1f5f9">Animal.prototype</text>
          </g>
          <defs><marker id="pa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'Property lookups walk right until found — [[Prototype]] links, not copies')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Base component/service classes', body:'Angular services often extend a shared base class (e.g. a generic CRUD service) via prototype inheritance.' },
        { title:'Memory efficiency', body:'Methods live once on the prototype, shared by every instance — not duplicated per object, unlike arrow-function class fields.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'event-loop',
  title: 'The Event Loop, Call Stack & Task Queues',
  dek: 'How single-threaded JavaScript handles async work without blocking — and why promises run before setTimeout.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>JavaScript runs on a single thread with one <b>call stack</b>. Async work (timers, network, DOM events) is handed off to the browser's Web APIs; when it completes, a callback is placed into a <b>queue</b> — and the <b>event loop</b> only pushes queued callbacks onto the stack once it's completely empty.</p>
      <p>There are two queue types with different priority: the <b>microtask queue</b> (Promise <code>.then</code>, <code>queueMicrotask</code>, <code>async/await</code> continuations) and the <b>macrotask queue</b> (<code>setTimeout</code>, <code>setInterval</code>, DOM events, I/O). <b>All microtasks are fully drained before the next macrotask runs</b> — this is why promise callbacks consistently "jump the queue" ahead of timers.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
console.log('1: sync start');

setTimeout(() => console.log('2: macrotask (setTimeout)'), 0);

Promise.resolve().then(() => console.log('3: microtask (promise)'));

console.log('4: sync end');

// Output order:
// 1: sync start
// 4: sync end
// 3: microtask (promise)     ← microtasks drain BEFORE next macrotask
// 2: macrotask (setTimeout)`, 'event-loop.js')}
    </section>
    <section class="block">
      ${h2('Event Loop Diagram')}
      ${diagram(`
        <svg viewBox="0 0 640 260" width="100%" style="max-width:640px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="11">
            <rect x="20" y="20" width="180" height="60" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="110" y="55" text-anchor="middle" fill="#f1f5f9">Call Stack</text>
            <rect x="20" y="100" width="180" height="60" rx="6" fill="#4fa8ff14" stroke="#4fa8ff"/>
            <text x="110" y="135" text-anchor="middle" fill="#f1f5f9">Web APIs</text>
            <text x="110" y="150" text-anchor="middle" fill="#7c8798" font-size="9.5">(timers, fetch, DOM)</text>

            <rect x="360" y="20" width="260" height="50" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="490" y="50" text-anchor="middle" fill="#f1f5f9">Microtask Queue (Promises)</text>
            <rect x="360" y="90" width="260" height="50" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
            <text x="490" y="120" text-anchor="middle" fill="#f1f5f9">Macrotask Queue (setTimeout)</text>

            <rect x="230" y="170" width="180" height="50" rx="6" fill="#0a0e1400" stroke="#7c8798" stroke-dasharray="3,3"/>
            <text x="320" y="200" text-anchor="middle" fill="#7c8798">Event Loop</text>

            <line x1="200" y1="130" x2="360" y2="45" stroke="#4fa8ff" marker-end="url(#el)"/>
            <line x1="200" y1="130" x2="360" y2="115" stroke="#4fa8ff" marker-end="url(#el)"/>
            <line x1="360" y1="45" x2="200" y2="45" stroke="#ff4b55" stroke-dasharray="2,2" marker-end="url(#el2)"/>
            <text x="230" y="80" fill="#7c8798" font-size="9.5">drain ALL microtasks first,</text>
            <text x="230" y="92" fill="#7c8798" font-size="9.5">then ONE macrotask, repeat</text>
          </g>
          <defs>
            <marker id="el" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#4fa8ff"/></marker>
            <marker id="el2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#ff4b55"/></marker>
          </defs>
        </svg>
      `, 'Stack must be empty before the loop pulls from either queue; microtasks always drain first')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Race condition debugging', body:'Understanding queue priority explains why a promise-based state update can "beat" a setTimeout-based one even when the timeout is 0ms.' },
        { title:'Angular zone.js / change detection', body:'Zone.js patches async APIs (setTimeout, promises, DOM events) precisely to know when to trigger change detection.' },
        { title:'Avoiding jank', body:'Long synchronous tasks block the single thread entirely — breaking heavy work into chunks (via <code>setTimeout(fn,0)</code> or <code>requestIdleCallback</code>) keeps the UI responsive.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'promises-async-await',
  title: 'Promises & Async/Await',
  dek: 'From callback hell to a readable, sequential-looking syntax for asynchronous code.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A <code>Promise</code> represents a value that may not exist yet — it's always in one of three states: <b>pending</b> → <b>fulfilled</b> or <b>rejected</b>, and once settled, it never changes again. <code>async/await</code> is syntax sugar over promises: an <code>async</code> function always returns a promise, and <code>await</code> pauses execution of that function (not the whole thread) until the awaited promise settles.</p>
    </section>
    <section class="block">
      ${h2('Example — Parallel vs Sequential')}
      ${codeBlock('js', `
async function sequential() {
  const user = await fetchUser(1);      // waits ~300ms
  const posts = await fetchPosts(1);    // THEN waits another ~300ms
  return { user, posts };               // total: ~600ms
}

async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(1),                       // both start immediately
    fetchPosts(1),
  ]);
  return { user, posts };               // total: ~300ms (whichever is slower)
}

async function withErrorHandling() {
  try {
    const data = await fetchUser(1);
    return data;
  } catch (err) {
    console.error('Failed to fetch user:', err.message);
    return null;                        // graceful fallback
  }
}

// Promise.allSettled — get results even if some reject
const results = await Promise.allSettled([fetchUser(1), fetchUser(999)]);
// [{status:'fulfilled', value:{...}}, {status:'rejected', reason: Error}]`, 'async.js')}
      ${callout('Common mistake', 'Awaiting inside a loop sequentially awaits each item one-by-one even when the requests are independent — wrap independent async calls in <code>Promise.all()</code> to run them concurrently instead.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'API data fetching', body:'Nearly every network call in a modern UI app — loading a dashboard, submitting a form — is orchestrated with async/await.' },
        { title:'RxJS interop', body:'Angular\'s HttpClient returns Observables, but async/await + <code>firstValueFrom()</code> is common for one-off, promise-style consumption.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'es6-features',
  title: 'Modern JavaScript (ES6+) Essentials',
  dek: 'Destructuring, spread/rest, optional chaining, and the syntax that\'s now assumed knowledge.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A working set of modern syntax that shows up in virtually every production file — worth knowing cold rather than looking up each time.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// Destructuring — extract values by shape
const { name, address: { city } = {} } = user;
const [first, ...rest] = ['a', 'b', 'c'];      // rest: ['b','c']

// Spread — expand an iterable
const merged = { ...defaults, ...userOverrides };  // shallow merge, right wins
const combined = [...arr1, ...arr2];

// Optional chaining + nullish coalescing
const city2 = user?.address?.city ?? 'Unknown';    // safe access + default
// ?? only falls back on null/undefined (unlike || which also catches 0, '', false)

// Template literals + tagged templates
const msg = \`Hello, \${user.name}! You have \${count} new messages.\`;

// Array methods that replaced manual loops
const total = cart.reduce((sum, item) => sum + item.price, 0);
const inStock = products.filter(p => p.qty > 0);
const names = users.map(u => u.name);
const admin = users.find(u => u.role === 'admin');

// Object shorthand + computed keys
const key = 'status';
const obj = { name, [key]: 'active' };            // { name: ..., status: 'active' }`, 'modern-js.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'React/Angular props & inputs', body:'Destructuring is the standard way to pull specific fields out of a props object or API response.' },
        { title:'Immutable state updates', body:'Spread syntax (<code>{...state, field: newValue}</code>) is the idiomatic way to update state without mutation in Redux, NgRx, and signals.' },
        { title:'Defensive rendering', body:'<code>user?.profile?.avatar ?? "/default.png"</code> avoids an entire class of "cannot read property of undefined" crashes.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'modules',
  title: 'JavaScript Modules (ESM)',
  dek: 'Native import/export — how code is organized and how bundlers use this structure for tree-shaking.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>ES Modules give every file its own scope (no global leakage), execute in <b>strict mode</b> by default, and are statically analyzable — imports/exports must be at the top level, which is precisely what lets bundlers (webpack, esbuild, Vite) perform <b>tree-shaking</b>: eliminating exported code that's never actually imported anywhere.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// math-utils.js
export const PI = 3.14159;
export function square(x) { return x * x; }
export default function add(a, b) { return a + b; }   // one default export per file

// app.js
import add, { square, PI } from './math-utils.js';
import * as MathUtils from './math-utils.js';         // namespace import

// Dynamic import — code-splitting, loaded only when needed
button.addEventListener('click', async () => {
  const { openModal } = await import('./modal.js');   // separate chunk, lazy-loaded
  openModal();
});`, 'modules.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Lazy loading routes', body:'Angular\'s <code>loadComponent: () => import(...)</code> in route config is dynamic import — code for a route only downloads when the user navigates there.' },
        { title:'Bundle size optimization', body:'Tree-shaking relies entirely on static ESM syntax — using CommonJS (<code>require</code>) in a library defeats it.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'design-patterns',
  title: 'Common Design Patterns in JS/UI Code',
  dek: 'Debounce, throttle, observer, and singleton — patterns that show up constantly in front-end code.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Design patterns are reusable solutions to recurring problems. In UI engineering, a handful come up constantly regardless of framework.</p>
    </section>
    <section class="block">
      ${h2('Debounce vs Throttle')}
      ${codeBlock('js', `
// Debounce: wait for a pause in events, then run ONCE
// Use case: search-as-you-type — don't fire an API call every keystroke
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
searchInput.addEventListener('input', debounce(handleSearch, 300));

// Throttle: run at most once per interval, regardless of event frequency
// Use case: scroll/resize handlers — don't run on EVERY pixel of scroll
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (inThrottle) return;
    fn(...args);
    inThrottle = true;
    setTimeout(() => inThrottle = false, limit);
  };
}
window.addEventListener('scroll', throttle(handleScroll, 100));`, 'debounce-throttle.js')}
    </section>
    <section class="block">
      ${h2('Observer Pattern (foundation of RxJS/signals)')}
      ${codeBlock('js', `
class EventEmitter {
  #listeners = new Map();
  on(event, cb) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(cb);
  }
  emit(event, payload) {
    (this.#listeners.get(event) || []).forEach(cb => cb(payload));
  }
}
const bus = new EventEmitter();
bus.on('cart:updated', (cart) => console.log('New total:', cart.total));
bus.emit('cart:updated', { total: 59.99 });`, 'observer.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Search/autocomplete', body:'Debounce is the standard way to avoid firing a network request on every single keystroke.' },
        { title:'Infinite scroll / resize-responsive layouts', body:'Throttle keeps expensive scroll/resize handlers from running hundreds of times per second.' },
        { title:'State management', body:'NgRx, RxJS, and Angular Signals are all implementations of the observer pattern at their core.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'generators-iterators',
  title: 'Generators & Iterators',
  dek: 'Functions that can pause and resume — the low-level mechanism async/await and for...of are built on.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>An <b>iterator</b> is any object with a <code>.next()</code> method returning <code>{ value, done }</code>. An <b>iterable</b> is any object implementing <code>Symbol.iterator</code> (arrays, strings, Maps, Sets) — this is what powers <code>for...of</code> and the spread operator. A <b>generator function</b> (<code>function*</code>) is a convenient way to write an iterator: calling it doesn't run the body immediately, it returns a generator object; each call to <code>.next()</code> runs until the next <code>yield</code>, pausing execution and returning that value.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;      // pauses here, returns current id, resumes on next .next()
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
// infinite sequence, but only computed lazily, one value at a time

// Making a custom object iterable with for...of
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next: () => current <= end
        ? { value: current++, done: false }
        : { value: undefined, done: true }
    };
  }
}
for (const n of new Range(1, 5)) console.log(n); // 1 2 3 4 5
console.log([...new Range(1, 3)]);                // [1, 2, 3] — spread works too`, 'generators.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Lazy/infinite sequences', body:'Generating paginated data, unique IDs, or large computed sequences without holding the whole thing in memory at once.' },
        { title:'Custom data structure traversal', body:'Making a tree or linked-list class work naturally with for...of / spread by implementing Symbol.iterator.' },
        { title:'Under the hood of async/await', body:'async/await is conceptually generators + promises combined — understanding generators demystifies how await "pauses" a function.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'memory-gc',
  title: 'Memory Management & Garbage Collection',
  dek: 'How the JS engine frees memory automatically — and the patterns that quietly defeat it.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>JS uses automatic garbage collection based on <b>reachability</b>: an object is kept alive as long as something reachable from a "root" (global scope, currently executing functions) references it, directly or transitively. Once nothing reachable references an object, the engine's garbage collector (commonly a generational mark-and-sweep algorithm in V8) reclaims its memory — you never manually free anything.</p>
      <p><b>Memory leaks</b> in JS almost always mean "something is unintentionally still reachable" — not a true leak like in C, but memory that should have been freed staying alive because a reference to it lingers somewhere unexpected.</p>
    </section>
    <section class="block">
      ${h2('Common Leak Patterns')}
      ${codeBlock('js', `
// 1. Forgotten event listeners / subscriptions keep their closure alive
class WidgetBroken {
  constructor() {
    window.addEventListener('resize', this.onResize); // never removed!
  }
  onResize = () => { /* ...this whole instance is now unreleasable... */ };
}
class WidgetFixed {
  constructor() { window.addEventListener('resize', this.onResize); }
  onResize = () => { /* ... */ };
  destroy() { window.removeEventListener('resize', this.onResize); } // ✅ call this on cleanup
}

// 2. Detached DOM nodes referenced from JS
let cachedRow = document.querySelector('.row');
table.removeChild(cachedRow);
// 'cachedRow' still references the DOM node — it can't be garbage collected
// until 'cachedRow' itself goes out of scope or is set to null

// 3. Accidental global variables
function leaky() {
  accidentallyGlobal = new Array(1_000_000).fill('x'); // no let/const — leaks to window
}

// WeakMap/WeakSet: hold references WITHOUT preventing garbage collection
const cache = new WeakMap();
cache.set(someObject, computedResult);
// if 'someObject' is otherwise unreferenced, it CAN still be collected —
// the WeakMap entry disappears automatically with it`, 'memory.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Single-page apps', body:'SPAs never do a full page reload — leaked listeners/subscriptions from unmounted components accumulate over a long session and eventually degrade performance.' },
        { title:'Angular ngOnDestroy discipline', body:'Directly maps to this concept — unsubscribed Observables are exactly this class of leak, framework-specific flavor.' },
        { title:'Caching layers', body:'WeakMap is the correct structure for caching computed values keyed by object identity without preventing those objects from being freed.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'web-workers',
  title: 'Web Workers',
  dek: 'Running JavaScript on a separate thread — true parallelism for CPU-heavy work, off the main thread.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>JavaScript's single-threaded model means any heavy synchronous computation blocks rendering and user input. A <b>Web Worker</b> runs a script on a genuinely separate OS thread with its own memory — no shared state, no DOM access — communicating with the main thread only via <code>postMessage</code> (data is copied/cloned, not shared, by default). This is real parallelism, not the cooperative concurrency of the event loop.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// main.js
const worker = new Worker('heavy-calc.worker.js');

worker.postMessage({ numbers: largeArray });   // data is cloned to the worker

worker.onmessage = (event) => {
  console.log('Result from worker:', event.data.result);
  // main thread was never blocked while this ran
};

worker.onerror = (err) => console.error('Worker error:', err.message);

// heavy-calc.worker.js — runs on a separate thread
self.onmessage = (event) => {
  const { numbers } = event.data;
  const result = numbers.reduce((sum, n) => sum + expensiveOp(n), 0); // CPU-heavy
  self.postMessage({ result });
};`, 'workers.js')}
      ${callout('Angular note', 'The Angular CLI has built-in support (`ng generate web-worker`) that automatically wires up the worker file, TypeScript types, and build config — no manual bundler setup needed.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Heavy client-side computation', body:'Image/video processing, large CSV parsing, complex financial calculations — anything that would otherwise freeze the UI for hundreds of milliseconds.' },
        { title:'Real-time collaborative editors', body:'Running CRDT/OT conflict-resolution algorithms off the main thread keeps typing latency low even during heavy merge operations.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'typescript-fundamentals',
  title: 'TypeScript Fundamentals',
  dek: 'The type layer on top of JavaScript that Angular is built entirely around — interfaces, generics, and utility types.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>TypeScript adds a static type system on top of JS, checked at compile time and erased before runtime (types have zero runtime cost). It catches an entire class of bugs — wrong argument types, typos in property names, null/undefined access — before code ever runs, and powers editor autocomplete/refactoring. Angular's entire API (decorators, DI, templates with strict mode) is designed around TypeScript.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
// Interfaces describe object shape
interface User {
  id: number;
  name: string;
  email?: string;       // optional property
  readonly createdAt: Date;  // can't be reassigned after creation
}

// Union types — a value that can be one of several types
type Status = 'idle' | 'loading' | 'success' | 'error';

// Generics — write code that works with any type, safely
function firstItem<T>(arr: T[]): T | undefined {
  return arr[0];
}
const num = firstItem([1, 2, 3]);        // inferred as number | undefined
const user = firstItem<User>(users);      // explicit type argument

// Utility types — transform existing types instead of rewriting them
type PartialUser = Partial<User>;         // all properties optional
type UserPreview = Pick<User, 'id' | 'name'>;  // only these two fields
type UserWithoutId = Omit<User, 'id'>;    // everything except 'id'

// Type narrowing — TS understands control flow
function printStatus(status: Status) {
  if (status === 'error') {
    console.log('Something went wrong'); // TS knows status is 'error' here
  }
}`, 'typescript-basics.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Angular everything', body:'Components, services, DI tokens, RxJS operators, reactive forms — all fully typed; Angular without TypeScript isn\'t really a supported setup.' },
        { title:'API contract safety', body:'Sharing a generated type (e.g. from an OpenAPI schema) between frontend and backend catches breaking API changes at compile time, not in production.' },
        { title:'Large team codebases', body:'Types act as always-up-to-date documentation and refactoring safety net — renaming a field updates every usage the compiler flags.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'call-apply-bind',
  title: 'call, apply & bind — Explicit "this" Control',
  dek: 'Three methods every function has for explicitly setting what "this" refers to when it runs.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>All functions inherit <code>.call()</code>, <code>.apply()</code>, and <code>.bind()</code> from <code>Function.prototype</code> — they let you explicitly control <code>this</code> rather than relying on call-site rules. <code>.call(thisArg, a, b)</code> and <code>.apply(thisArg, [a, b])</code> invoke the function <b>immediately</b> with a given <code>this</code> (differing only in how arguments are passed). <code>.bind(thisArg)</code> instead returns a <b>new function</b> permanently bound to that <code>this</code>, without calling it.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
const user = { name: 'Priya' };
function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

greet.call(user, 'Hi', '!');            // "Hi, Priya!" — args passed individually
greet.apply(user, ['Hi', '!']);         // "Hi, Priya!" — args passed as an array

const boundGreet = greet.bind(user, 'Hi');
boundGreet('!');                        // "Hi, Priya!" — 'this' + first arg locked in, called later

// Classic real-world use: borrowing array methods on array-like objects
function sumArgs() {
  // 'arguments' is array-like but has no .reduce() — borrow Array's method
  return Array.prototype.reduce.call(arguments, (sum, n) => sum + n, 0);
}
sumArgs(1, 2, 3); // 6

// bind for event handlers that need a fixed 'this'
class Toggle {
  constructor() {
    this.on = false;
    this.handleClick = this.handleClick.bind(this); // lock 'this' once, in constructor
  }
  handleClick() { this.on = !this.on; }
}`, 'call-apply-bind.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Class methods as callbacks', body:'bind() in the constructor is the classic pre-arrow-function-class-fields way to keep "this" correct when passing a method as a callback.' },
        { title:'Function borrowing / utility libraries', body:'call/apply let you reuse a method from one type (e.g. Array) on an array-like object (arguments, NodeList) that doesn\'t have it natively.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'event-delegation',
  title: 'Event Delegation & the DOM Event Flow',
  dek: 'Handling events on many children with a single listener, by exploiting event bubbling.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>DOM events flow in three phases: <b>capture</b> (root → target), <b>target</b> (the element itself), then <b>bubble</b> (target → root). Because most events bubble by default, you can attach <b>one</b> listener to a common ancestor and inspect <code>event.target</code> to determine which specific child was actually interacted with — instead of attaching a separate listener to every child, which is both slower to set up and breaks for dynamically added children.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// ❌ Without delegation — must re-attach a listener every time a row is added
document.querySelectorAll('.list-item').forEach(item => {
  item.addEventListener('click', handleItemClick); // misses items added later!
});

// ✅ With delegation — ONE listener, works for items added at any point later
document.querySelector('.list').addEventListener('click', (event) => {
  const item = event.target.closest('.list-item'); // walk up from wherever was clicked
  if (!item) return;                                 // click wasn't inside an item
  console.log('Clicked item:', item.dataset.id);
});

// stopPropagation() halts bubbling — used sparingly, breaks delegation for ancestors
button.addEventListener('click', (e) => {
  e.stopPropagation(); // parent's delegated listener will NOT see this click
});`, 'event-delegation.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Dynamic lists', body:'A todo list, comment thread, or data table where rows are added/removed at runtime — delegation means new rows work without re-binding anything.' },
        { title:'Framework internals', body:'React and Angular both use a form of event delegation internally (typically one root listener) rather than attaching a native listener per element, for performance.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'fetch-abort-errors',
  title: 'Fetch API, AbortController & Error Handling',
  dek: 'The native way to make HTTP requests — and the request-cancellation pattern most tutorials skip.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>fetch()</code> is the native, promise-based HTTP client — but it has a well-known gotcha: <b>it only rejects on network failure</b>, not on HTTP error status codes (404, 500). You must check <code>response.ok</code> yourself. <code>AbortController</code> is the native way to cancel an in-flight fetch — essential for avoiding race conditions when a user triggers a new request before the previous one finishes (e.g. fast typing in a search box).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {                          // fetch does NOT throw on 404/500!
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
  }
  return response.json();
}

// AbortController — cancel a stale request when a newer one starts
let currentController;
async function search(query) {
  currentController?.abort();                  // cancel the previous in-flight request
  currentController = new AbortController();

  try {
    const res = await fetch(\`/api/search?q=\${query}\`, {
      signal: currentController.signal,
    });
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') return;      // expected — ignore, a newer request is running
    throw err;                                    // a real error — rethrow
  }
}

// Timeout pattern built on AbortController
function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}`, 'fetch.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Typeahead search', body:'Aborting stale requests prevents an old, slow response from overwriting a newer, faster one — a very common real bug otherwise.' },
        { title:'Component unmount cleanup', body:'Aborting pending fetches when a component/page is torn down avoids "setState on unmounted component" warnings and wasted bandwidth.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'functional-patterns',
  title: 'Currying, Composition & Functional Basics',
  dek: 'Building complex behavior by combining small, pure functions — patterns borrowed from functional programming.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A <b>pure function</b> always returns the same output for the same input and has no side effects — easy to test and reason about. <b>Currying</b> transforms a function taking multiple arguments into a sequence of functions each taking one argument, enabling partial application (pre-filling some arguments to create a specialized function). <b>Composition</b> combines small single-purpose functions into a pipeline, each transforming the output of the last.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// Currying — transform (a, b) => ... into a => b => ...
const multiply = (a) => (b) => a * b;
const double = multiply(2);       // partially applied — 'a' is locked in
double(5);                        // 10

// Real use: pre-configured validators
const minLength = (min) => (value) => value.length >= min;
const isValidPassword = minLength(8);
isValidPassword('short');         // false
isValidPassword('longenough123'); // true

// Composition — combine small functions into a pipeline
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

const trim = (s) => s.trim();
const toLower = (s) => s.toLowerCase();
const removeSpaces = (s) => s.replace(/\\s+/g, '-');

const slugify = pipe(trim, toLower, removeSpaces);
slugify('  Hello World  '); // "hello-world"`, 'functional.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Reusable validation logic', body:'Curried validators (like minLength above) compose into flexible, reusable form-validation rule sets.' },
        { title:'RxJS pipe()', body:'RxJS\'s <code>.pipe(operator1, operator2, ...)</code> is exactly this composition pattern — each operator transforms the stream and passes it to the next.' },
        { title:'Redux/NgRx selectors', body:'Composing small selector functions to derive complex state slices from simpler ones is standard practice in these state libraries.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'web-storage',
  title: 'Web Storage & structuredClone',
  dek: 'localStorage, sessionStorage, and the modern native way to deep-clone data.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>localStorage</code> persists data with no expiration, scoped per-origin, shared across all tabs. <code>sessionStorage</code> is scoped to a single tab and cleared when that tab closes. Both are <b>synchronous</b> and store only strings — objects must be serialized with <code>JSON.stringify</code>/<code>JSON.parse</code>. For larger or more structured client-side data, <code>IndexedDB</code> (async, supports objects/blobs, much higher storage limits) is the correct tool — Web Storage is only appropriate for small amounts of data.</p>
      <p><code>structuredClone()</code> is a built-in global function (no library needed) that deep-clones most JS values, including circular references and types <code>JSON.parse(JSON.stringify(x))</code> can't handle (Dates, Maps, Sets, ArrayBuffers).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// localStorage — persists across browser restarts
localStorage.setItem('theme', JSON.stringify({ mode: 'dark' }));
const theme = JSON.parse(localStorage.getItem('theme') ?? '{}');
localStorage.removeItem('theme');

// sessionStorage — gone when the tab closes
sessionStorage.setItem('wizardStep', '3');

// Storage event — fires in OTHER tabs when localStorage changes (not the tab that made the change)
window.addEventListener('storage', (event) => {
  console.log(\`\${event.key} changed from \${event.oldValue} to \${event.newValue}\`);
});

// structuredClone — deep clone, handles Dates/Maps/circular refs (JSON.stringify can't)
const original = { date: new Date(), tags: new Set(['a', 'b']) };
const copy = structuredClone(original);
copy.date instanceof Date; // true — JSON.stringify would have turned this into a string`, 'storage.js')}
      ${callout('Never store', 'Auth tokens/sensitive data in localStorage are readable by any script on the page — vulnerable to XSS. Prefer httpOnly cookies for sensitive credentials where possible.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'UI preference persistence', body:'Theme, sidebar collapsed state, table column widths — small, non-sensitive UI state that should survive a refresh.' },
        { title:'Cross-tab sync', body:'The "storage" event is the standard trick for keeping multiple open tabs of the same app in sync (e.g. logging out everywhere at once).' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'proxy-reflect',
  title: 'Proxy & Reflect',
  dek: 'Intercepting fundamental object operations — the mechanism behind Vue\'s reactivity and many mocking libraries.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A <code>Proxy</code> wraps an object and lets you intercept fundamental operations on it — getting a property, setting a property, deleting a property — via <b>traps</b>. <code>Reflect</code> is a companion built-in providing the default implementation of those same operations, typically used inside a trap to "do the normal thing" after your custom logic runs.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
const user = { name: 'Priya', age: 29 };

const loggedUser = new Proxy(user, {
  get(target, prop) {
    console.log(\`Reading "\${prop}"\`);
    return Reflect.get(target, prop);      // default behavior — actually return the value
  },
  set(target, prop, value) {
    console.log(\`Setting "\${prop}" to\`, value);
    return Reflect.set(target, prop, value); // default behavior — actually set it
  },
});

loggedUser.name;          // logs "Reading name" -> "Priya"
loggedUser.age = 30;      // logs 'Setting age to 30'

// Real-world building block: a simple reactive object (simplified signal-like mechanism)
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, prop, value) {
      const result = Reflect.set(target, prop, value);
      onChange(prop, value);              // notify subscribers something changed
      return result;
    }
  });
}
const state = reactive({ count: 0 }, (prop, value) => console.log(\`\${prop} → \${value}\`));
state.count++; // logs "count → 1"`, 'proxy-reflect.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Reactive frameworks', body:'Vue 3\'s reactivity system is built directly on Proxy — reading/writing a reactive object\'s properties automatically triggers dependency tracking and re-renders.' },
        { title:'Validation / access control layers', body:'A Proxy can enforce read-only properties, validate values on assignment, or log access for debugging — without changing the underlying object\'s code.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'symbols',
  title: 'Symbols',
  dek: 'A primitive type for creating guaranteed-unique property keys — used to hook into built-in language behavior.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A <code>Symbol</code> is a unique, immutable primitive value — every <code>Symbol()</code> call produces a value guaranteed not to equal any other symbol, even with the same description. This makes symbols useful as "hidden" or collision-proof object keys, and the language uses a set of <b>well-known symbols</b> (like <code>Symbol.iterator</code>, seen earlier in generators) to let objects opt into built-in behaviors like iteration.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
const id1 = Symbol('id');
const id2 = Symbol('id');
id1 === id2; // false — always unique, even with identical descriptions

// Using a symbol as a "private-ish" object key — won't collide with
// any string key, and is skipped by JSON.stringify / Object.keys / for...in
const _internalState = Symbol('internalState');
const widget = {
  name: 'Button',
  [_internalState]: { clicked: 0 },
};
Object.keys(widget);        // ['name'] — symbol key is hidden from normal enumeration
JSON.stringify(widget);     // '{"name":"Button"}' — symbol properties are skipped

// Well-known symbol: Symbol.toPrimitive controls how an object converts
class Money {
  constructor(amount) { this.amount = amount; }
  [Symbol.toPrimitive](hint) {
    if (hint === 'string') return \`$\${this.amount.toFixed(2)}\`;
    return this.amount;
  }
}
\`Price: \${new Money(9.5)}\`;  // "Price: $9.50" — string hint used automatically`, 'symbols.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Library internals', body:'Libraries use symbols for metadata keys attached to objects they don\'t own, guaranteeing no collision with the consumer\'s own property names.' },
        { title:'Custom iteration protocol', body:'Symbol.iterator (covered in Generators) is the standard way any class opts into for...of and spread support.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'intl-api',
  title: 'The Intl API — Formatting Dates, Numbers & Text',
  dek: 'Native, locale-aware formatting for dates, currency, and lists — no date library required for most needs.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>The <code>Intl</code> namespace provides built-in, locale-aware formatters — correctly handling regional differences (date order, currency symbols, thousand separators, pluralization rules) that are easy to get wrong by hand-formatting strings. For many apps this eliminates the need for a heavy date/number formatting library entirely.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// Dates — locale and format both configurable
new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date());
// "August 16, 2026"
new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date());
// "16 August 2026" — day/month order flips automatically per locale

// Currency — correct symbol AND correct placement per locale
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.5);
// "$1,234.50"
new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(1234.5);
// "1.234,50 €" — different thousands separator AND symbol position

// Relative time — "3 days ago" style, without a library
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
rtf.format(-3, 'day');  // "3 days ago"
rtf.format(1, 'day');   // "tomorrow"

// Pluralization rules — correctly handles languages with complex plural forms
const pr = new Intl.PluralRules('en-US');
pr.select(1);  // "one"
pr.select(5);  // "other"`, 'intl.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Global products', body:'Displaying prices, dates, and "time ago" timestamps correctly for users across regions — without hand-rolling locale logic.' },
        { title:'Reducing bundle size', body:'Many apps use Intl to avoid pulling in a full date library like Moment.js just for basic formatting needs.' },
      ])}
    </section>
  `
},

  ]
};
