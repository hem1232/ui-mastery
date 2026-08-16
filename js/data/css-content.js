window.CSS_CONTENT = {
  label: 'CSS',
  topics: [

// ============================================================
{
  id: 'box-model',
  title: 'The Box Model',
  dek: 'Every element is a box — content, padding, border, margin. Understanding this prevents 90% of layout bugs.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Every rendered element is a rectangular box made of four layers, from inside out: <b>content</b> → <b>padding</b> → <b>border</b> → <b>margin</b>. The critical gotcha is <code>box-s[...]
      ${callout('Universal fix', `Almost every production codebase sets <code>*, *::before, *::after { box-sizing: border-box; }</code> globally so width/height include padding and border — maki[...]
    </section>
    <section class="block">
      ${h2('Diagram')}
      ${diagram(`
        <svg viewBox="0 0 500 300" width="100%" style="max-width:500px;display:block;margin:0 auto;">
          <rect x="10" y="10" width="480" height="280" fill="#4fa8ff10" stroke="#4fa8ff" stroke-dasharray="4,3"/>
          <text x="20" y="26" fill="#4fa8ff" font-family="JetBrains Mono" font-size="11">margin</text>
          <rect x="50" y="45" width="400" height="210" fill="#e3a53f18" stroke="#e3a53f"/>
          <text x="60" y="61" fill="#e3a53f" font-family="JetBrains Mono" font-size="11">border</text>
          <rect x="65" y="60" width="370" height="180" fill="#3fd97718" stroke="#3fd977"/>
          <text x="75" y="76" fill="#3fd977" font-family="JetBrains Mono" font-size="11">padding</text>
          <rect x="95" y="90" width="310" height="120" fill="#ff4b5518" stroke="#ff4b55"/>
          <text x="250" y="155" fill="#f1f5f9" text-anchor="middle" font-family="JetBrains Mono" font-size="13">content</text>
          <text x="250" y="172" fill="#7c8798" text-anchor="middle" font-family="JetBrains Mono" font-size="10">width × height</text>
        </svg>
      `, 'content-box: width applies only to the innermost red region')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* content-box (default) — width excludes padding/border */
.card-legacy {
  width: 200px;
  padding: 20px;
  border: 2px solid #333;
  /* rendered width = 200 + 40 + 4 = 244px */
}

/* border-box — width INCLUDES padding/border (predictable) */
.card {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid #333;
  /* rendered width = exactly 200px */
}`, 'box-model.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Design system tokens', body:'Component libraries set <code>border-box</code> globally so spacing tokens (padding/margin) behave predictably across every component.' },
        { title:'Grid/flex children', body:'Miscalculated box sizes are the #1 cause of unexpected overflow or wrapping in flex/grid layouts.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'cascade-specificity',
  title: 'The Cascade, Specificity & Inheritance',
  dek: 'How the browser decides which of several conflicting rules actually wins.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>When multiple rules target the same element, the browser resolves the conflict using, in order: <b>origin & importance</b> (author styles beat browser defaults; <code>!important</code> be[...]
      <p>Specificity is calculated as a tuple <code>(inline, IDs, classes/attributes/pseudo-classes, elements)</code>. Higher tuple wins, compared left to right — a single ID (0,1,0,0) always be[...]
    </section>
    <section class="block">
      ${h2('Specificity Table')}
      ${diagram(`
        <svg viewBox="0 0 620 190" width="100%" style="max-width:620px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="12">
            ${
              ['style="..."','#header','.nav-link.active','button[disabled]','div > p']
                .map((sel, i) => `<text x="20" y="${10 + i*40}" fill="#f1f5f9">${sel}</text>`)
                .join('')
            }
          </g>
        </svg>
      `, 'Higher specificity always wins regardless of source order — highest to lowest, top to bottom')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
p { color: black; }              /* specificity (0,0,0,1) */
.warning { color: orange; }      /* specificity (0,0,1,0) — wins over above */
#alert-box p.warning { color: red; } /* (0,1,1,1) — wins over both */

/* inheritance: color/font-family inherit by default, box model props don't */
body { color: #333; font-family: sans-serif; } /* inherited by all descendants */
.card { border: 1px solid #ccc; } /* NOT inherited — must be set per element */`, 'cascade.css')}
      ${callout('Modern tool', '<code>@layer</code> (cascade layers) lets you define explicit precedence groups (e.g. <code>@layer reset, base, components, utilities;</code>) so specificity fight[...]
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'CSS-in-JS / utility frameworks', body:'Tailwind and styled-components exist partly to sidestep manual specificity management by generating single-purpose, low-specificity classes[...]
        { title:'Overriding 3rd-party component styles', body:'Understanding specificity is required to override a UI library\'s default styles without resorting to <code>!important</code>.' },
      ])}
    </section>
  `
},

  ]
};
