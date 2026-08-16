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

  ]
};
