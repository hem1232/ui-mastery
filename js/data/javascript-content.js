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
      <p>Before executing any code, the JS engine creates an <b>execution context</b> in two phases: <b>creation phase</b> (allocates memory for variables/functions, sets up scope chain and <code>[...]
      <p><b>Scope</b> is lexical (determined by where code is written, not where it's called) — every function creates a new scope, and inner scopes can access outer variables via the <b>scope c[...]
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

  ]
};
