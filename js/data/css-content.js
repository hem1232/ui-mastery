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
      <p>Every rendered element is a rectangular box made of four layers, from inside out: <b>content</b> → <b>padding</b> → <b>border</b> → <b>margin</b>. The critical gotcha is <code>box-sizing</code>: by default (<code>content-box</code>), <code>width</code>/<code>height</code> apply only to the content area — padding and border are added <i>on top</i>, so a box with <code>width: 200px; padding: 20px; border: 2px solid</code> actually renders at 244px wide. This surprises nearly every developer at least once.</p>
      ${callout('Universal fix', `Almost every production codebase sets <code>*, *::before, *::after { box-sizing: border-box; }</code> globally so width/height include padding and border — making sizing predictable.`)}
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
      <p>When multiple rules target the same element, the browser resolves the conflict using, in order: <b>origin & importance</b> (author styles beat browser defaults; <code>!important</code> beats normal rules), then <b>specificity</b>, then <b>source order</b> (later wins ties).</p>
      <p>Specificity is calculated as a tuple <code>(inline, IDs, classes/attributes/pseudo-classes, elements)</code>. Higher tuple wins, compared left to right — a single ID (0,1,0,0) always beats any number of classes (0,0,n,0).</p>
    </section>
    <section class="block">
      ${h2('Specificity Table')}
      ${diagram(`
        <svg viewBox="0 0 620 190" width="100%" style="max-width:620px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="12">
            ${[
              ['style="..."','(1,0,0,0)', '#ff4b55', 10],
              ['#header','(0,1,0,0)', '#e3a53f', 50],
              ['.nav-link.active','(0,0,2,0)', '#4fa8ff', 90],
              ['button[disabled]','(0,0,1,1)', '#3fd977', 130],
              ['div > p','(0,0,0,2)', '#7c8798', 170]
            ].map(([sel,spec,color,y]) => `
              <text x="20" y="${y}" fill="${color}">${sel}</text>
              <text x="280" y="${y}" fill="#f1f5f9">${spec}</text>
              <rect x="360" y="${y-14}" width="${50 + (5-((y-10)/40))*40}" height="12" fill="${color}" opacity="0.5"/>
            `).join('')}
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
      ${callout('Modern tool', '<code>@layer</code> (cascade layers) lets you define explicit precedence groups (e.g. <code>@layer reset, base, components, utilities;</code>) so specificity fights between a design system and app overrides become predictable instead of a war of !important.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'CSS-in-JS / utility frameworks', body:'Tailwind and styled-components exist partly to sidestep manual specificity management by generating single-purpose, low-specificity classes.' },
        { title:'Overriding 3rd-party component styles', body:'Understanding specificity is required to override a UI library\'s default styles without resorting to <code>!important</code>.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'flexbox',
  title: 'Flexbox',
  dek: 'One-dimensional layout: distributing space along a row or column.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Flexbox lays children out along a single axis (row or column) and excels at distributing available space and aligning items. The container gets <code>display: flex</code>; the two core properties to internalize are <code>justify-content</code> (main axis alignment) and <code>align-items</code> (cross axis alignment).</p>
      <p>On children, <code>flex: 1</code> is shorthand for <code>flex-grow: 1; flex-shrink: 1; flex-basis: 0%</code> — it means "grow to fill available space equally," the single most-used flex declaration in real UIs.</p>
    </section>
    <section class="block">
      ${h2('Axis Diagram')}
      ${diagram(`
        <svg viewBox="0 0 560 160" width="100%" style="max-width:560px;display:block;margin:0 auto;">
          <text x="20" y="20" fill="#7c8798" font-family="JetBrains Mono" font-size="11">flex-direction: row (default)</text>
          <line x1="20" y1="80" x2="540" y2="80" stroke="#4fa8ff" stroke-width="1.5" marker-end="url(#a1)"/>
          <text x="480" y="70" fill="#4fa8ff" font-family="JetBrains Mono" font-size="10">main axis (justify-content)</text>
          <line x1="30" y1="40" x2="30" y2="130" stroke="#3fd977" stroke-width="1.5" marker-end="url(#a2)"/>
          <text x="36" y="45" fill="#3fd977" font-family="JetBrains Mono" font-size="10">cross axis (align-items)</text>
          ${[100,220,340].map((x,i)=>`<rect x="${x}" y="55" width="80" height="50" rx="6" fill="#e3a53f14" stroke="#e3a53f"/><text x="${x+40}" y="85" text-anchor="middle" fill="#f1f5f9" font-family="JetBrains Mono" font-size="11">item ${i+1}</text>`).join('')}
          <defs>
            <marker id="a1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#4fa8ff"/></marker>
            <marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#3fd977"/></marker>
          </defs>
        </svg>
      `, '"main axis" flips with flex-direction — justify-content always follows it, align-items always follows cross axis')}
    </section>
    <section class="block">
      ${h2('Example — Sticky Footer Card')}
      ${codeBlock('css', `
.card {
  display: flex;
  flex-direction: column;
  height: 320px;
}
.card__body { flex: 1; }         /* grows to fill remaining space */
.card__footer { flex-shrink: 0; } /* stays fixed height, never shrinks */

.navbar {
  display: flex;
  justify-content: space-between; /* logo left, links right */
  align-items: center;            /* vertically centered */
  gap: 16px;                      /* modern spacing, replaces margin hacks */
}`, 'flexbox.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Navbars & toolbars', body:'Distributing logo / nav links / actions along one row with <code>justify-content: space-between</code> is the standard pattern.' },
        { title:'Card layouts', body:'Equal-height cards with footers pinned to the bottom regardless of content length — a very common product-grid requirement.' },
        { title:'Centering anything', body:'<code>display:flex; align-items:center; justify-content:center;</code> is the most reliable one-liner for centering in both axes.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'grid',
  title: 'CSS Grid',
  dek: 'Two-dimensional layout: rows and columns together, with explicit placement.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Where flexbox is one-dimensional, Grid controls rows and columns simultaneously — ideal for page layouts and complex components. <code>grid-template-columns: repeat(3, 1fr)</code> creates three equal flexible columns; the <code>fr</code> unit represents a fraction of remaining space, similar in spirit to <code>flex-grow</code>.</p>
      <p>The single most useful Grid pattern for responsive design, without a single media query:</p>
      ${codeBlock('css', `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));`, '')}
      <p>This says: "fit as many 240px+ columns as possible, and stretch them to fill the row" — cards automatically reflow from 4 columns to 1 as the viewport shrinks.</p>
    </section>
    <section class="block">
      ${h2('Example — Dashboard Layout')}
      ${codeBlock('css', `
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;      /* sidebar + main */
  grid-template-rows: 64px 1fr;          /* topbar + content */
  grid-template-areas:
    "sidebar topbar"
    "sidebar main";
  height: 100vh;
}
.sidebar { grid-area: sidebar; }
.topbar  { grid-area: topbar; }
.main    { grid-area: main; }

.card-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}`, 'grid.css')}
    </section>
    <section class="block">
      ${h2('Grid Areas Diagram')}
      ${diagram(`
        <svg viewBox="0 0 400 220" width="100%" style="max-width:400px;display:block;margin:0 auto;">
          <rect x="10" y="10" width="100" height="200" rx="6" fill="#4fa8ff14" stroke="#4fa8ff"/>
          <text x="60" y="115" text-anchor="middle" fill="#4fa8ff" font-family="JetBrains Mono" font-size="12">sidebar</text>
          <rect x="120" y="10" width="270" height="50" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
          <text x="255" y="40" text-anchor="middle" fill="#e3a53f" font-family="JetBrains Mono" font-size="12">topbar</text>
          <rect x="120" y="70" width="270" height="140" rx="6" fill="#3fd97714" stroke="#3fd977"/>
          <text x="255" y="145" text-anchor="middle" fill="#3fd977" font-family="JetBrains Mono" font-size="12">main</text>
        </svg>
      `, 'grid-template-areas gives layouts a readable, ASCII-art-like definition')}
    </section>
    <section class="block">
      ${h2('Flexbox vs Grid — When To Use Which')}
      ${useCaseGrid([
        { title:'Use Flexbox for', body:'Navbars, button groups, single rows/columns of content, anything that needs to wrap organically.' },
        { title:'Use Grid for', body:'Overall page layout, image galleries, dashboards, anywhere you\'re thinking in both rows AND columns at once.' },
        { title:'Use both together', body:'Grid for the page skeleton, flexbox inside individual grid cells for aligning their internal content — extremely common in real component libraries.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'positioning-stacking',
  title: 'Positioning & Stacking Context',
  dek: 'static, relative, absolute, fixed, sticky — and the z-index rules that confuse everyone.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>position</code> values, decoded:</p>
      <ul>
        <li><b>static</b> — default, normal document flow, <code>top/left/z-index</code> ignored.</li>
        <li><b>relative</b> — stays in flow, but <code>top/left</code> offsets it visually from where it would have been.</li>
        <li><b>absolute</b> — removed from flow, positioned relative to nearest ancestor with <code>position</code> other than static.</li>
        <li><b>fixed</b> — removed from flow, positioned relative to the viewport, stays put on scroll.</li>
        <li><b>sticky</b> — hybrid: behaves relative until a scroll threshold, then sticks like fixed within its parent.</li>
      </ul>
      ${callout('The #1 z-index bug', `<code>z-index</code> only works on positioned elements (anything but <code>static</code>) AND only compares siblings within the same <b>stacking context</b>. A high z-index child can still render behind a sibling if their parents create separate stacking contexts (e.g. via <code>opacity < 1</code>, <code>transform</code>, or <code>filter</code> on an ancestor).`)}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
.dropdown-wrapper { position: relative; }         /* anchor point */
.dropdown-menu {
  position: absolute;
  top: 100%; left: 0;                              /* just below trigger */
  z-index: 10;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;                                    /* stays above content on scroll */
}

.modal-overlay {
  position: fixed;
  inset: 0;                                         /* shorthand for top/right/bottom/left: 0 */
  z-index: 1000;
}`, 'positioning.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Dropdowns & tooltips', body:'<code>position: relative</code> wrapper + <code>position: absolute</code> popover is the standard anchoring pattern.' },
        { title:'Sticky table headers / navbars', body:'<code>position: sticky</code> replaced most scroll-event-based "sticky header" JS hacks.' },
        { title:'Modals', body:'<code>position: fixed; inset:0</code> for a full-viewport overlay that ignores page scroll.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'transitions-animations',
  title: 'Transitions, Animations & Transforms',
  dek: 'Making UI feel alive — and doing it on the GPU so it stays at 60fps.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><b>Transitions</b> animate a property change between two states triggered by something else (hover, class toggle). <b>Animations</b> (<code>@keyframes</code>) run independently, can loop, and don't need a trigger. <b>Transforms</b> (<code>translate</code>, <code>scale</code>, <code>rotate</code>) move/resize elements without affecting layout flow.</p>
      ${callout('Performance rule', 'Only animate <code>transform</code> and <code>opacity</code> for smooth 60fps animation — these run on the GPU compositor thread. Animating <code>width</code>, <code>top</code>, or <code>margin</code> forces the browser to recalculate layout on every frame ("layout thrashing"), causing jank.')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Transition: smooth hover state change */
.button {
  transform: scale(1);
  transition: transform 150ms ease-out;
}
.button:hover { transform: scale(1.04); }

/* Animation: independent, looping */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
.skeleton-loader {
  animation: pulse 1.4s ease-in-out infinite;
}

/* Respect user preference — accessibility requirement */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}`, 'motion.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Loading skeletons', body:'Pulsing/shimmer placeholders while data fetches — perceived performance boost even when actual load time is unchanged.' },
        { title:'Micro-interactions', body:'Button press feedback, toast slide-ins, checkbox checkmarks — small transitions that make an app feel responsive and polished.' },
        { title:'Route transitions', body:'Angular\'s animation module wraps the Web Animations API to animate elements entering/leaving on route change.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'responsive-design',
  title: 'Responsive Design & Media Queries',
  dek: 'Mobile-first breakpoints, fluid units, and container queries — the modern approach.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><b>Mobile-first</b> means writing base styles for the smallest screen, then layering on complexity with <code>min-width</code> media queries as the viewport grows — this produces smaller, more maintainable CSS than the reverse (desktop-first with <code>max-width</code> overrides).</p>
      <p>The newest evolution is <b>container queries</b> — styling based on a parent container's size rather than the viewport, essential for components (like a card) that get reused in different-width contexts (sidebar vs. main grid).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Mobile-first: base = mobile */
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}

/* Container queries — style based on parent width, not viewport */
.card-container { container-type: inline-size; }

@container (min-width: 400px) {
  .card { flex-direction: row; }   /* stack → row once container is wide enough */
}

/* Fluid typography without any media query */
h1 { font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem); }`, 'responsive.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Reusable components', body:'Container queries let a <code>&lt;ProductCard&gt;</code> component adapt its own layout based on the column it\'s dropped into — impossible with viewport media queries alone.' },
        { title:'Design system breakpoints', body:'Standard breakpoint tokens (sm/md/lg/xl) shared between CSS and JS (for conditional rendering) keep a product visually consistent.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'custom-properties',
  title: 'Custom Properties (CSS Variables)',
  dek: 'Runtime-computed, cascade-aware variables — the backbone of theming and design tokens.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Unlike Sass variables (compile-time, static), CSS custom properties (<code>--name</code>) are live in the browser: they participate in the cascade, can be changed at runtime via JS, and can differ per DOM subtree. This makes them the correct primitive for theming (light/dark mode), design tokens, and dynamic values driven by JS or media queries.</p>
    </section>
    <section class="block">
      ${h2('Example — Theming')}
      ${codeBlock('css', `
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --space-unit: 8px;
  --radius: 6px;
}

[data-theme="dark"] {
  --color-bg: #0a0e14;
  --color-text: #e2e8f0;
}

.card {
  background: var(--color-bg);
  color: var(--color-text);
  padding: calc(var(--space-unit) * 2);
  border-radius: var(--radius);
}`, 'tokens.css')}
      ${codeBlock('js', `
// toggling theme from JS — no re-render, no framework needed
document.documentElement.dataset.theme =
  document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';`, 'theme-toggle.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Dark mode', body:'Swap a handful of root-level custom properties instead of maintaining two entire parallel stylesheets.' },
        { title:'Design tokens', body:'Design tools (Figma) export tokens that map 1:1 to CSS custom properties, keeping design and code in sync.' },
        { title:'Component libraries', body:'Expose custom properties as a public theming API (<code>--button-bg</code>) so consumers can restyle without overriding internal classes.' },
      ])}
    </section>
  `
},

  ]
};
