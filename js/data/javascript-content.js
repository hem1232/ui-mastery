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

// ============================================================
{
  id: 'error-handling',
  title: 'Error Handling & Custom Error Classes',
  dek: 'Beyond try/catch: designing errors that carry useful information and can be handled selectively.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>The built-in <code>Error</code> object carries a <code>message</code> and <code>stack</code> trace, but real applications benefit from <b>custom error subclasses</b> that carry structured, domain-specific information (an HTTP status code, a validation field name) and can be distinguished from other errors via <code>instanceof</code> — letting calling code handle different failure modes differently instead of parsing error message strings.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ApiError';         // shows up correctly in stack traces / logs
    this.status = status;
    this.endpoint = endpoint;
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) {
    throw new ApiError(\`Failed to load user\`, res.status, \`/api/users/\${id}\`);
  }
  return res.json();
}

// Selective handling based on error TYPE, not fragile message string matching
try {
  await fetchUser('123');
} catch (err) {
  if (err instanceof ApiError && err.status === 404) {
    showNotFoundMessage();
  } else if (err instanceof ApiError) {
    showGenericApiError(err.status);
  } else if (err instanceof ValidationError) {
    highlightField(err.field);
  } else {
    throw err;   // unknown error type — don't silently swallow it, rethrow
  }
}

// Error.cause (ES2022) — chain errors without losing the original context
try {
  parseConfig(raw);
} catch (originalError) {
  throw new Error('Failed to initialize app', { cause: originalError });
}`, 'error-handling.js')}
      ${callout('Anti-pattern to avoid', 'A bare catch (err) { console.log(err) } that swallows the error without rethrowing or handling it hides real bugs from users and monitoring tools. Always either handle an error meaningfully or let it propagate.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'API client layers', body:'A typed ApiError class lets UI code branch on status codes (401 → redirect to login, 403 → show permission message) cleanly, without parsing strings.' },
        { title:'Form validation', body:'Custom ValidationError classes carrying a field name let a form component highlight the exact field that failed, from a single caught error.' },
        { title:'Global error monitoring', body:'Tools like Sentry group and triage errors far better when error.name and structured properties are meaningful, not every error being a generic "Error".' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'temporal-api',
  title: 'The Temporal API (Modern Date/Time)',
  dek: 'The native replacement for the notoriously broken built-in Date object.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>JavaScript's built-in <code>Date</code> object has long-standing, well-known problems: it's mutable (methods like <code>setMonth()</code> silently change the object in place), months are zero-indexed (a constant source of off-by-one bugs), and it conflates "a point in time" with "a calendar date" with "a wall-clock time," making timezone handling error-prone. <b>Temporal</b> is a new, standards-track API designed to fix all of this — with distinct, immutable types for each concept (<code>Temporal.PlainDate</code> for a calendar date with no time/timezone, <code>Temporal.ZonedDateTime</code> for a precise instant with timezone, etc.).</p>
      ${callout('Availability note', 'Temporal is at Stage 3 in the ECMAScript process as of this writing and shipping in some browsers behind experimental flags or via polyfill — check current support before relying on it in production, but it\'s worth knowing as the clear future direction for date/time handling in JS.')}
    </section>
    <section class="block">
      ${h2('Example — Old Date vs Temporal')}
      ${codeBlock('js', `
// ❌ Old Date — mutable, confusing zero-indexed months
const d = new Date(2026, 7, 16);   // month 7 = August (!) — classic off-by-one trap
d.setMonth(d.getMonth() + 1);      // MUTATES 'd' in place — easy to introduce bugs
console.log(d.getMonth());         // 8 = September

// ✅ Temporal — immutable, explicit, no zero-indexing surprises
const date = Temporal.PlainDate.from('2026-08-16');   // explicit ISO string, month is "8" naturally
const nextMonth = date.add({ months: 1 });              // returns a NEW date, doesn't mutate
console.log(date.toString());       // still '2026-08-16' — original untouched
console.log(nextMonth.toString());  // '2026-09-16'

// Distinct types for distinct concepts — no more ambiguity
const meetingTime = Temporal.ZonedDateTime.from('2026-08-16T14:00:00[America/New_York]');
const inTokyo = meetingTime.withTimeZone('Asia/Tokyo');
console.log(inTokyo.toString());    // correctly converted, DST-aware

// Duration and comparison, built in, no manual millisecond math
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
const start = Temporal.PlainTime.from('09:00');
const end = start.add(duration);    // '11:30:00'`, 'temporal.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Booking/scheduling systems', body:'Correctly reasoning about timezones, daylight saving transitions, and recurring events is exactly the class of bug Temporal is designed to prevent by construction.' },
        { title:'Replacing Moment.js/date-fns for new projects', body:'As support matures, Temporal is expected to reduce or eliminate the need for third-party date libraries for many common use cases.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'type-coercion-equality',
  title: 'Type Coercion, Equality & Truthy/Falsy',
  dek: 'Why "0" == 0 is true but "0" === 0 is false — and the small set of rules that make JS comparisons predictable once you know them.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>==</code> (loose equality) converts operands to a common type before comparing, following a specific, well-defined set of coercion rules — it's not "random," it just has more steps than people remember. <code>===</code> (strict equality) never converts types — if the types differ, it's immediately false, no coercion attempted. This is why <code>===</code> is the near-universal default in production code: it removes an entire category of "wait, why is this true" surprises.</p>
      <p>Separately, every value in JS is either <b>truthy</b> or <b>falsy</b> when evaluated in a boolean context (an <code>if</code>, a <code>&&</code>/<code>||</code> chain). There are exactly <b>eight falsy values</b> — everything else is truthy, including things people often assume are falsy like <code>'0'</code> (a non-empty string) or <code>[]</code>/<code>{}</code> (empty collections).</p>
    </section>
    <section class="block">
      ${h2('The 8 Falsy Values — Memorize This List')}
      ${codeBlock('js', `
false
0
-0
0n            // BigInt zero
""            // empty string
null
undefined
NaN

// Everything else is truthy — including these commonly-mistaken cases:
Boolean('0');     // true  — non-empty string, even though it "looks like" zero
Boolean([]);       // true  — empty array is still an object, objects are always truthy
Boolean({});        // true  — same reason
Boolean(' ');        // true  — a string with just a space is non-empty`, 'falsy.js')}
    </section>
    <section class="block">
      ${h2('Loose vs Strict Equality')}
      ${codeBlock('js', `
0 == '0';        // true  — string coerced to number first
0 == '';         // true  — empty string coerced to 0
0 == false;      // true  — boolean coerced to number
null == undefined; // true — special case, ONLY equal to each other with ==
null === undefined; // false — different types, no coercion with ===

'0' === 0;        // false — different types, strict equality stops here
NaN === NaN;       // false — NaN is never equal to anything, even itself!
Number.isNaN(NaN); // true — the CORRECT way to check for NaN

// Object.is — like === but fixes the two edge cases above
Object.is(NaN, NaN);   // true
Object.is(0, -0);       // false (=== considers these equal, Object.is doesn't)`, 'equality.js')}
      ${callout('Practical rule', 'Always use === and !==. The one common, deliberate exception: checking for both null and undefined at once with a single loose comparison — <code>if (value == null)</code> is a widely recognized idiom for "value is null OR undefined."')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Form/API validation bugs', body:'A huge share of "why is this falsy check wrong" bugs trace back to not knowing 0, empty string, or NaN are legitimate falsy values that can slip through an "if (!value)" check unintentionally.' },
        { title:'Linting rules', body:'ESLint\'s eqeqeq rule (banning == in favor of ===) is standard in virtually every production JS/TS codebase for exactly the reasons above.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'map-set',
  title: 'Map & Set — Beyond Plain Objects and Arrays',
  dek: 'Purpose-built collection types that fix real limitations of using a plain object as a dictionary or an array for uniqueness.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A plain object as a "dictionary" has real limitations: keys are coerced to strings (so a number or object key silently becomes a string), it inherits properties from <code>Object.prototype</code> that can collide with real keys, and getting the size requires <code>Object.keys(obj).length</code>. <code>Map</code> fixes all three — any value can be a key (including objects), no prototype pollution risk, and <code>.size</code> is built in. <code>Set</code> is the equivalent fix for "array of unique values" — enforcing uniqueness automatically instead of manually checking <code>includes()</code> before adding.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// Map — keys can be ANY type, including objects (impossible with a plain object)
const userScores = new Map();
const userObj = { id: 1 };
userScores.set(userObj, 95);       // the object itself is the key
userScores.set('guest', 0);
userScores.get(userObj);            // 95
userScores.size;                    // 2 — no Object.keys() dance needed

// Iterating a Map — insertion order guaranteed, unlike historical object key order edge cases
for (const [key, value] of userScores) {
  console.log(key, value);
}

// Set — automatic uniqueness, no manual includes() checks
const tags = new Set(['react', 'vue', 'react']);  // duplicate silently ignored
tags.size;              // 2
tags.add('angular');
tags.has('vue');        // true
[...tags];               // ['react', 'vue', 'angular'] — easy conversion to array

// Real use: deduping an array in one line
const uniqueIds = [...new Set([1, 2, 2, 3, 3, 3])];  // [1, 2, 3]

// WeakMap/WeakSet (touched earlier under memory management) — same idea,
// but keys must be objects and don't prevent garbage collection`, 'map-set.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Caching/memoization', body:'A Map keyed by function arguments (or an object reference) is the standard structure for caching computed results.' },
        { title:'Deduplication', body:'Removing duplicate IDs from an API response, or tracking "already-processed" items during a data transform — Set makes both a one-liner.' },
        { title:'Frequency counting', body:'Counting occurrences of values (e.g. "how many orders per customer") is cleaner with a Map than juggling an object\'s string-coerced keys.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'regular-expressions',
  title: 'Regular Expressions',
  dek: 'Pattern matching for strings — validation, search-and-replace, and extraction, all in one compact syntax.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A regular expression (regex) is a pattern used to match character combinations in strings. In JS, a regex is its own type, created via a literal (<code>/pattern/flags</code>) or the <code>RegExp</code> constructor (needed when the pattern is built dynamically from a variable). The four methods worth knowing: <code>.test()</code> (does it match? — boolean), <code>.match()</code>/<code>.matchAll()</code> (extract matches from a string), and <code>.replace()</code> (find and replace, supporting a pattern instead of a literal substring).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// Validation — test() returns true/false
const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
emailPattern.test('user@example.com');  // true
emailPattern.test('not-an-email');       // false

// Extraction with named capture groups — far more readable than positional groups
const dateStr = '2026-08-16';
const dateMatch = dateStr.match(/^(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})$/);
dateMatch.groups.year;   // "2026"
dateMatch.groups.month;  // "08"

// Search and replace — pattern-based, with backreferences to captured groups
const formatted = 'John Smith'.replace(/(\\w+)\\s(\\w+)/, '$2, $1');
// "Smith, John" — $1/$2 refer to the captured groups

// Global flag + matchAll — extract EVERY match, not just the first
const text = 'Contact: a@x.com or b@y.com';
const emails = [...text.matchAll(/[\\w.]+@[\\w.]+/g)].map(m => m[0]);
// ['a@x.com', 'b@y.com']

// Common flags: g (global — find all, not just first), i (case-insensitive), m (multiline)
/hello/i.test('HELLO world');  // true — case-insensitive`, 'regex.js')}
      ${callout('Readability tip', 'Complex regexes are notoriously hard to read later. Prefer named capture groups ((?<name>...)) over positional ones, and consider a short comment above any non-trivial pattern explaining what it validates.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Form validation', body:'Email, phone number, password strength patterns — regex is the standard tool for structural (not semantic) input validation.' },
        { title:'Data cleaning/parsing', body:'Extracting structured data from loosely-formatted text (log files, pasted content, CSV edge cases) commonly relies on regex extraction.' },
        { title:'Search-as-you-type highlighting', body:'Wrapping matched substrings in a <mark> tag for search result highlighting uses regex-based replace.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'rendering-pipeline-raf',
  title: 'The Browser Rendering Pipeline & requestAnimationFrame',
  dek: 'What actually happens between a JS state change and pixels appearing on screen — and how to hook into that cycle correctly.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Every visual frame the browser produces goes through a pipeline: <b>Style</b> (recalculate which CSS rules apply) → <b>Layout</b> (compute exact size/position of every element — "reflow") → <b>Paint</b> (fill in pixels) → <b>Composite</b> (assemble layers, often on the GPU). Changing a property like <code>width</code> triggers the full pipeline from Layout; changing <code>transform</code>/<code>opacity</code> can skip straight to Composite — this is the deeper reason those two properties animate far more cheaply (referenced earlier in the CSS animations topic).</p>
      <p><code>requestAnimationFrame(callback)</code> schedules a callback to run right before the browser's next repaint — the correct way to drive JS-based animation, because it's synchronized to the display's actual refresh rate (typically 60fps) and automatically pauses when the tab isn't visible, unlike <code>setInterval</code>.</p>
    </section>
    <section class="block">
      ${h2('Pipeline Diagram')}
      ${diagram(`
        <svg viewBox="0 0 640 130" width="100%" style="max-width:640px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="11">
            ${['JS','Style','Layout','Paint','Composite'].map((n,i)=>{
              const x = 10 + i*126;
              const color = ['#3fd977','#4fa8ff','#e3a53f','#ff4b55','#7c8798'][i];
              return `<rect x="${x}" y="40" width="112" height="46" rx="6" fill="${color}14" stroke="${color}"/>
                <text x="${x+56}" y="68" text-anchor="middle" fill="#f1f5f9">${n}</text>
                ${i<4 ? `<line x1="${x+112}" y1="63" x2="${x+126}" y2="63" stroke="#7c8798" marker-end="url(#rp)"/>` : ''}`;
            }).join('')}
          </g>
          <defs><marker id="rp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'Changing width/top forces the WHOLE pipeline from Layout; changing transform/opacity skips straight to Composite')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// ❌ setInterval — not synced to display refresh, keeps running in background tabs
setInterval(() => {
  el.style.left = (parseFloat(el.style.left) + 1) + 'px';
}, 16);

// ✅ requestAnimationFrame — synced to actual screen refresh, pauses in background tabs
function animate(timestamp) {
  el.style.transform = \`translateX(\${position}px)\`;   // transform, not left — cheap to animate
  position += 1;
  if (position < 300) requestAnimationFrame(animate);   // schedule the NEXT frame
}
requestAnimationFrame(animate);

// Reading layout (offsetHeight etc.) right after writing a style forces
// a SYNCHRONOUS layout recalculation ("layout thrashing") — avoid interleaving:
// ❌ el.style.width = '200px'; console.log(el.offsetHeight); // forces sync layout
// ✅ batch all reads, then all writes, or use requestAnimationFrame to separate them`, 'raf.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Custom JS-driven animations', body:'Drag-and-drop, custom scroll effects, canvas-based visualizations — anywhere CSS transitions/animations alone aren\'t expressive enough.' },
        { title:'Performance debugging', body:'Understanding this pipeline is essential for reading a browser DevTools performance trace and diagnosing why a page feels janky.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'cookies-deep-dive',
  title: 'Cookies — Attributes & Practical Use',
  dek: 'Small pieces of data the browser sends automatically with every request to a domain — and the attributes that control who can read them and when they\'re sent.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A cookie is a small key-value pair stored by the browser and automatically attached to every HTTP request to the domain that set it — unlike localStorage, which JS must explicitly read and the browser never sends anywhere on its own. This automatic-sending behavior is exactly why cookies are used for session/auth tokens, and exactly why they need careful attribute configuration to stay secure.</p>
    </section>
    <section class="block">
      ${h2('Key Attributes')}
      ${codeBlock('js', `
// Setting a cookie from JS (only works for non-httpOnly cookies —
// a session cookie set by the SERVER with httpOnly can't be touched by JS at all)
document.cookie = "theme=dark; path=/; max-age=31536000; SameSite=Lax";

// Reading cookies — there's no built-in parser, you get one long string
document.cookie;   // "theme=dark; sessionHint=abc123; ..."

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}`, 'cookies-js.js')}
      ${useCaseGrid([
        { title:'httpOnly', body:'Cookie is invisible to JavaScript entirely — only sent automatically by the browser to the server. Essential for auth tokens (covered in the Angular security topic) to block XSS-based theft.' },
        { title:'Secure', body:'Cookie is only ever sent over HTTPS — never over an unencrypted connection, even accidentally.' },
        { title:'SameSite', body:'Controls whether the cookie is sent on cross-site requests. "Strict" never sends cross-site; "Lax" (the modern default) sends on top-level navigation but not on cross-site subrequests/images; "None" (requires Secure) sends everywhere — needed for legitimate cross-site embedding scenarios.' },
        { title:'max-age / expires', body:'Without either, a cookie is a "session cookie" — deleted when the browser closes. Setting one makes it persistent across restarts, up to that duration.' },
      ])}
      ${callout('Real-world default', 'A typical secure auth cookie set by a backend looks like: Set-Cookie: session=xyz; HttpOnly; Secure; SameSite=Lax; Path=/. All four attributes together form the standard safe baseline for session cookies.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Session/auth tokens', body:'The httpOnly cookie approach referenced in the Angular security deep-dive is set and read entirely server-side — the frontend never directly touches the token value.' },
        { title:'Consent/preference persistence', body:'Cookie banners, A/B test bucket assignment, and simple preferences that need to survive across subdomains (which localStorage can\'t do) commonly use cookies instead.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'build-tools-env-config',
  title: 'Build Tools & Environment Configuration',
  dek: 'What actually happens between writing source code and shipping a production bundle — bundling, tree-shaking, and environment-specific config.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Modern frontend code isn't shipped as written — a <b>build tool</b> (Webpack, Vite, esbuild — Angular CLI uses esbuild under the hood since v17) bundles many source files into optimized output: resolving imports into a dependency graph, tree-shaking unused exports (covered earlier under ES Modules), minifying, and splitting code into separate chunks for lazy-loaded routes. <b>Environment variables</b> let the same source code produce different builds for different targets (dev vs. staging vs. production) — different API URLs, different logging verbosity, feature flags — without hardcoding conditionals everywhere.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// vite.config.js — a typical modern build tool config (conceptually similar to Angular CLI's)
export default {
  build: {
    outDir: 'dist',
    sourcemap: true,           // generate .map files for debugging production errors
    rollupOptions: {
      output: {
        manualChunks: {         // split large third-party deps into their own cacheable chunk
          vendor: ['lodash', 'rxjs'],
        },
      },
    },
  },
};`, 'build-config.js')}
      ${codeBlock('bash', `
# .env files — different values loaded per environment, never committed with real secrets
# .env.development
API_URL=http://localhost:3000/api
LOG_LEVEL=debug

# .env.production
API_URL=https://api.acme.com
LOG_LEVEL=error`, '.env')}
      ${callout('The Angular equivalent', 'Angular\'s own convention is environment.ts / environment.prod.ts (or the newer file-replacement build configurations in angular.json), swapped automatically based on the --configuration flag passed to ng build — conceptually the same idea as .env files, just Angular-CLI-specific.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Multi-environment deployments', body:'Every real product needs at minimum dev/staging/production builds pointing at different backends — this is the mechanism that makes that possible without manual code edits per deploy.' },
        { title:'Bundle size accountability', body:'Understanding chunking/tree-shaking is necessary to diagnose why a production bundle is larger than expected, and to fix it (e.g. importing a whole library instead of a specific function).' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'testing-fundamentals-jest',
  title: 'JavaScript Testing Fundamentals (Jest)',
  dek: 'Writing and structuring unit tests for plain functions and logic — the foundation underneath framework-specific testing tools.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Before framework-specific testing (like Angular's TestBed, covered earlier), it's worth knowing plain JS unit testing fundamentals — they transfer everywhere. Tests are organized into <code>describe</code> blocks (grouping related tests) containing <code>it</code>/<code>test</code> blocks (individual test cases), each making <code>expect()</code> assertions. <b>Mocking</b> replaces a real dependency (an API call, the current date, a random number) with a controlled fake, so a test is deterministic and doesn't depend on external systems.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// cart.js — the code under test
export function calculateTotal(items, taxRate = 0.08) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return Math.round(subtotal * (1 + taxRate) * 100) / 100;
}

// cart.test.js
import { calculateTotal } from './cart';

describe('calculateTotal', () => {
  it('sums item prices correctly with tax', () => {
    const items = [{ price: 10, qty: 2 }, { price: 5, qty: 1 }];
    expect(calculateTotal(items)).toBe(27);   // (20 + 5) * 1.08 = 27
  });

  it('returns 0 for an empty cart', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('respects a custom tax rate', () => {
    expect(calculateTotal([{ price: 100, qty: 1 }], 0.10)).toBe(110);
  });
});

// Mocking — replacing a real dependency with a controlled fake
import { fetchExchangeRate } from './api';
jest.mock('./api');

test('converts currency using the mocked exchange rate', async () => {
  fetchExchangeRate.mockResolvedValue(1.1);   // fake the API response, deterministically
  const result = await convertToEuros(100);
  expect(result).toBe(110);
  expect(fetchExchangeRate).toHaveBeenCalledTimes(1);
});

// Common matchers
expect(value).toBe(5);                  // strict equality (===)
expect(obj).toEqual({ a: 1 });          // deep equality for objects/arrays
expect(fn).toThrow('Invalid input');    // asserts a function throws
expect(array).toContain('apple');
expect(promise).resolves.toBe('done');  // async assertion`, 'cart.test.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Pure business logic', body:'Pricing calculations, validation rules, data transformations — logic with no framework dependency is fastest and most valuable to unit test directly, before even touching component tests.' },
        { title:'CI pipelines', body:'These tests run fastest of any test type (no browser, no DOM) — typically the first and most frequent check in a CI pipeline, run on every single commit.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'essential-array-methods',
  title: 'Essential Array Methods — A Practical Reference',
  dek: 'The mutating vs. non-mutating distinction that trips people up, and the handful of methods that cover nearly every real data-transformation need.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Array methods split into two camps with real consequences: <b>mutating</b> methods change the original array in place (and most return something other than the new array, which surprises people); <b>non-mutating</b> methods return a brand-new array, leaving the original untouched. In UI code — especially with frameworks that rely on reference equality (OnPush, React) — reaching for a mutating method by accident is a common source of "state changed but the UI didn't update" bugs.</p>
      ${callout('The rule that matters most', 'Prefer non-mutating methods for anything touching component/application state. Reserve mutating methods (push, sort, splice) for truly local, throwaway arrays where nothing else holds a reference to the original.')}
    </section>
    <section class="block">
      ${h2('Non-Mutating (Safe for State) — Reference')}
      ${codeBlock('js', `
const nums = [5, 2, 8, 1];

nums.map(n => n * 2);              // [10, 4, 16, 2] — transform each element
nums.filter(n => n > 2);           // [5, 8] — keep elements matching a condition
nums.reduce((sum, n) => sum + n, 0); // 16 — fold into a single value
nums.find(n => n > 5);             // 8 — first matching element (or undefined)
nums.findIndex(n => n > 5);        // 2 — index of first match (or -1)
nums.some(n => n > 5);             // true — does AT LEAST ONE match?
nums.every(n => n > 0);            // true — do ALL match?
nums.includes(8);                  // true
nums.slice(1, 3);                  // [2, 8] — extract a range, original untouched
[...nums].sort((a, b) => a - b);   // spread FIRST, then sort — sort() mutates otherwise!
nums.flatMap(n => [n, n * 10]);    // [5, 50, 2, 20, 8, 80, 1, 10] — map + flatten in one step
Array.from({ length: 3 }, (_, i) => i * 2);  // [0, 2, 4] — generate an array from scratch
Object.entries({ a: 1, b: 2 });    // [['a', 1], ['b', 2]] — object to array of pairs`, 'non-mutating.js')}
    </section>
    <section class="block">
      ${h2('Mutating (Changes The Original — Use Carefully)')}
      ${codeBlock('js', `
const list = [1, 2, 3];

list.push(4);          // adds to end, returns the NEW LENGTH (not the array!)
list.pop();             // removes from end, returns the REMOVED element
list.unshift(0);        // adds to start, returns new length
list.shift();           // removes from start, returns removed element
list.sort();             // sorts IN PLACE — also returns the array, easy to be misled
list.reverse();          // reverses IN PLACE
list.splice(1, 1, 'x');  // removes/inserts IN PLACE at index 1

// The classic OnPush-breaking bug:
this.items.push(newItem);        // ❌ SAME array reference — OnPush component won't re-render
this.items = [...this.items, newItem]; // ✅ NEW reference — triggers change detection correctly`, 'mutating.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Redux/NgRx/signal state updates', body:'Every reducer or signal .update() call MUST use non-mutating patterns — this is precisely why the spread-based patterns shown throughout this reference are used everywhere in state code.' },
        { title:'Data transformation pipelines', body:'map/filter/reduce chains are the standard, readable way to transform an API response into exactly the shape a component needs to render.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'observer-apis',
  title: 'Observer APIs — Intersection, Resize & Mutation',
  dek: 'Three native browser APIs that watch for visibility, size, and DOM changes efficiently, without a single scroll or resize event listener.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Before these APIs existed, "is this element visible on screen?" or "did this element's size change?" required manually attaching scroll/resize listeners and recalculating positions on every single event — expensive and imprecise. All three Observer APIs work the same way: you register a callback, tell the browser what to watch, and it notifies you asynchronously and efficiently, calculated internally by the browser's own rendering engine rather than your JS re-measuring the DOM repeatedly.</p>
    </section>
    <section class="block">
      ${h2('IntersectionObserver — "Is this element visible?"')}
      ${codeBlock('js', `
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');   // trigger a fade-in animation
      loadImage(entry.target);                    // lazy-load the real image
      observer.unobserve(entry.target);           // stop watching once it's loaded
    }
  });
}, {
  threshold: 0.1,        // fire when at least 10% of the element is visible
  rootMargin: '200px',   // start loading 200px BEFORE it actually enters the viewport
});

document.querySelectorAll('.lazy-image').forEach(img => observer.observe(img));`, 'intersection-observer.js')}
    </section>
    <section class="block">
      ${h2('ResizeObserver — "Did this element\'s size change?"')}
      ${codeBlock('js', `
// Reacts to an ELEMENT's size changing — including changes caused by content,
// not just the window resizing (which window.resize alone can't detect)
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const width = entry.contentRect.width;
    entry.target.classList.toggle('narrow-layout', width < 400);
    // this is conceptually what powers CSS container queries, at the JS level
  }
});

resizeObserver.observe(document.querySelector('.sidebar-panel'));`, 'resize-observer.js')}
    </section>
    <section class="block">
      ${h2('MutationObserver — "Did the DOM change?"')}
      ${codeBlock('js', `
// Watches for DOM changes — additions/removals of nodes, attribute changes, text changes
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' && mutation.addedNodes.length) {
      console.log('New nodes added:', mutation.addedNodes);
    }
  });
});

mutationObserver.observe(document.querySelector('#chat-messages'), {
  childList: true,   // watch for added/removed children
  subtree: true,     // watch descendants too, not just direct children
});

// Always disconnect when done watching, to avoid a memory leak
mutationObserver.disconnect();`, 'mutation-observer.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Infinite scroll & lazy loading', body:'IntersectionObserver is the standard, efficient way to detect "user scrolled near the bottom" or "this image entered the viewport" — replacing manual scroll-event math entirely.' },
        { title:'Responsive components without container queries', body:'ResizeObserver is the JS-level equivalent of container queries — useful for components needing to run actual logic (not just CSS) based on their own size.' },
        { title:'Watching third-party DOM injection', body:'MutationObserver is used when integrating with a script you don\'t control that injects/modifies DOM, and your code needs to react to those changes (analytics tools, browser extensions, some embed widgets).' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'promise-combinators',
  title: 'Promise Combinators — all, allSettled, race & any',
  dek: 'Four distinct strategies for handling multiple promises together, each answering a different question about "when are we done?"',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>Promise.all</code> was covered earlier for running independent requests in parallel — here's the complete family, each with a genuinely different use case based on exactly what "done" means for your situation.</p>
    </section>
    <section class="block">
      ${h2('Example — All Four, Side By Side')}
      ${codeBlock('js', `
const p1 = fetch('/api/user');
const p2 = fetch('/api/orders');
const p3 = fetch('/api/might-fail');   // suppose this one rejects

// Promise.all — waits for ALL to succeed; if even ONE rejects, the WHOLE thing rejects immediately
try {
  const [user, orders, extra] = await Promise.all([p1, p2, p3]);
} catch (err) {
  // if p3 rejects, you land HERE — you get NOTHING from p1/p2 even though they succeeded
}

// Promise.allSettled — waits for ALL to finish, regardless of success/failure —
// NEVER rejects, gives you a full report of what worked and what didn't
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log('Success:', r.value);
  else console.log('Failed:', r.reason);
});

// Promise.race — resolves/rejects as soon as the FIRST promise settles (win OR lose)
// classic use: a timeout race
const withTimeout = Promise.race([
  fetch('/api/slow-endpoint'),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
]);

// Promise.any — resolves as soon as the FIRST promise SUCCEEDS, ignoring failures;
// only rejects if EVERY promise fails
const fastestMirror = await Promise.any([
  fetch('https://mirror1.example.com/data'),
  fetch('https://mirror2.example.com/data'),
  fetch('https://mirror3.example.com/data'),
]);
// whichever CDN mirror responds successfully first wins — failures from the others are ignored`, 'promise-combinators.js')}
    </section>
    <section class="block">
      ${h2('Choosing Between Them')}
      ${useCaseGrid([
        { title:'Promise.all', body:'All results are required together, and if any one fails the whole operation should be considered failed — loading a page that needs user + permissions + settings all present to render correctly.' },
        { title:'Promise.allSettled', body:'You want to attempt several independent operations and report on each individually — bulk operations like "upload these 5 files" where some succeeding and some failing is a valid, expected outcome.' },
        { title:'Promise.race', body:'Timeout patterns, or "whichever finishes first wins" scenarios where only the first settled result (success or failure) matters.' },
        { title:'Promise.any', body:'Redundant sources where you only need ONE to succeed — trying multiple CDN mirrors or fallback API endpoints, caring only about the fastest success.' },
      ])}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Dashboard initial load', body:'Promise.all for the common "fetch everything this page needs before rendering" pattern.' },
        { title:'Bulk upload/import UIs', body:'Promise.allSettled to show a per-item success/failure report rather than failing the entire batch over one bad file.' },
        { title:'Network resilience', body:'Promise.race for request timeouts, Promise.any for falling back across redundant endpoints — both common in apps needing to handle flaky networks gracefully.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'iife-module-pattern',
  title: 'IIFEs & The Module Pattern',
  dek: 'The pre-ES-Modules way of creating private scope — a historical pattern that still explains a lot of code you\'ll encounter.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>An <b>Immediately Invoked Function Expression (IIFE)</b> is a function defined and called in the same statement — its sole purpose is creating a new, private scope that executes once and discloses nothing to the outside except what it explicitly returns. Before ES Modules existed, this was THE standard way to avoid polluting the global scope, and it's the foundation of the classic <b>Module Pattern</b> — encapsulating private state and exposing a small public API, conceptually identical to what a closure does (covered earlier) but packaged as a reusable idiom.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// Basic IIFE — runs immediately, its internal variables never leak to global scope
(function () {
  const secret = 'hidden from outside';
  console.log('IIFE ran immediately');
})();
// 'secret' does not exist out here — completely inaccessible

// The Module Pattern — IIFE returning a public API, hiding private implementation
const Counter = (function () {
  let count = 0;   // PRIVATE — no external access, exactly like the closures topic earlier

  function increment() { count++; }
  function reset() { count = 0; }
  function getCount() { return count; }

  return { increment, reset, getCount };   // only THESE are exposed publicly
})();

Counter.increment();
Counter.increment();
Counter.getCount();   // 2
Counter.count;         // undefined — truly private, no way to reach it directly

// Why ES Modules made this largely unnecessary — same encapsulation, native syntax:
// counter.js
let count = 0;                       // private to the MODULE, not accessible outside it
export function increment() { count++; }
export function getCount() { return count; }`, 'iife-module-pattern.js')}
      ${callout('Why this still matters', 'You\'ll encounter this pattern constantly in older codebases, many npm packages\' compiled output, and any environment without native module support (some embedded/legacy contexts). Understanding it also clarifies WHY ES Modules feel like such a clean improvement — they give you this exact same privacy guarantee with zero ceremony.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Legacy codebases & many npm packages', body:'Bundled/compiled JavaScript (especially UMD-format packages) frequently wraps everything in an IIFE for safe global-scope isolation, even in 2026.' },
        { title:'Avoiding global scope pollution in plain scripts', body:'A quick vanilla-JS script embedded directly in an HTML page (no build tooling) still benefits from this pattern to avoid colliding with other scripts on the same page.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'json-deep-dive',
  title: 'JSON — Beyond the Basics',
  dek: 'The lesser-known second and third arguments to JSON.stringify/parse — filtering, transforming, and formatting output.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Most code uses <code>JSON.stringify(obj)</code> and <code>JSON.parse(str)</code> with a single argument, but both accept optional additional parameters that solve real, common problems: a <b>replacer</b> function/array to filter or transform values during stringification, a <b>reviver</b> function to transform values while parsing (e.g. converting ISO date strings back into real <code>Date</code> objects), and an indentation argument for human-readable pretty-printed output.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
const user = {
  name: 'Priya',
  password: 'secret123',
  createdAt: new Date('2026-01-01'),
  sessionToken: 'abc-xyz',
};

// Replacer as an ARRAY — whitelist specific keys only, everything else dropped
JSON.stringify(user, ['name', 'createdAt']);
// '{"name":"Priya","createdAt":"2026-01-01T00:00:00.000Z"}' — password/token excluded

// Replacer as a FUNCTION — transform or omit values conditionally
JSON.stringify(user, (key, value) => {
  if (key === 'password' || key === 'sessionToken') return undefined;  // strip sensitive fields
  return value;
});

// Third argument — pretty-print with indentation, great for logs/debugging
JSON.stringify({ a: 1, b: { c: 2 } }, null, 2);
// {
//   "a": 1,
//   "b": {
//     "c": 2
//   }
// }

// Reviver — transform values while PARSING (e.g. revive real Date objects,
// since JSON has no native date type — dates always come back as strings otherwise)
const raw = '{"name":"Priya","createdAt":"2026-01-01T00:00:00.000Z"}';
const parsed = JSON.parse(raw, (key, value) => {
  if (key === 'createdAt') return new Date(value);
  return value;
});
parsed.createdAt instanceof Date;   // true — properly revived, not just a string

// Circular references — JSON.stringify THROWS on these (structuredClone, covered
// earlier, handles circular refs natively and is usually the better tool for cloning)
const circular = { name: 'test' };
circular.self = circular;
JSON.stringify(circular);   // TypeError: Converting circular structure to JSON`, 'json-deep-dive.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Stripping sensitive fields before logging', body:'A replacer function is the standard way to ensure passwords/tokens never accidentally end up in logs or error reports sent to a monitoring service.' },
        { title:'API responses with dates', body:'The reviver pattern is a common (if increasingly Temporal/library-replaced) way to automatically convert ISO date strings from an API into real Date objects on parse.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'indexeddb',
  title: 'IndexedDB — Structured Client-Side Storage',
  dek: 'The browser\'s real database, for when localStorage\'s size limits and string-only values aren\'t enough.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>localStorage (covered earlier) is synchronous, string-only, and limited to a few MB — fine for small preferences, wrong for anything larger or more structured. <b>IndexedDB</b> is a full, asynchronous, transactional, object-based database built into the browser — it can store structured objects directly (no manual JSON stringify/parse), handle much larger amounts of data (typically hundreds of MB or more, browser-dependent), and supports indexes for efficient querying. Its native API is notoriously verbose and callback-heavy, so most real projects use a thin wrapper library rather than the raw API directly.</p>
    </section>
    <section class="block">
      ${h2('Example — Raw API (verbose, shown for understanding)')}
      ${codeBlock('js', `
const request = indexedDB.open('MyAppDB', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('notes', { keyPath: 'id' });
  store.createIndex('byDate', 'createdAt');   // enables efficient queries by date
};

request.onsuccess = (event) => {
  const db = event.target.result;
  const tx = db.transaction('notes', 'readwrite');
  const store = tx.objectStore('notes');

  store.put({ id: 1, title: 'Meeting notes', createdAt: new Date(), tags: ['work'] });
  // note: real objects, arrays, dates — no manual JSON.stringify needed
};`, 'indexeddb-raw.js')}
      ${codeBlock('js', `
// Realistic approach — using the "idb" library (a thin Promise-based wrapper)
import { openDB } from 'idb';

const db = await openDB('MyAppDB', 1, {
  upgrade(db) {
    db.createObjectStore('notes', { keyPath: 'id' });
  },
});

await db.put('notes', { id: 1, title: 'Meeting notes', createdAt: new Date() });
const note = await db.get('notes', 1);
const allNotes = await db.getAll('notes');`, 'indexeddb-idb-lib.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Offline-first apps', body:'Storing substantial application data locally so the app remains fully functional offline, syncing to the server when connectivity returns — commonly paired with the Service Worker/PWA patterns covered earlier.' },
        { title:'Client-side caching of large datasets', body:'Caching API responses, uploaded files, or generated data that\'s too large or too structured for localStorage.' },
      ])}
    </section>
  `
},

  ]
};
