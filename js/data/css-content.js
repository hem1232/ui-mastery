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

// ============================================================
{
  id: 'has-selector',
  title: 'The :has() Relational Pseudo-Class',
  dek: 'CSS finally gets a "parent selector" — style an element based on what it contains.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>For decades CSS could only select downward (an element and its descendants), never upward. <code>:has()</code> changes that — it matches an element if the selector inside it matches <i>any descendant</i>, effectively giving you a parent selector and a form of conditional styling based on sibling/child state, with zero JavaScript.</p>
      ${callout('Browser support', ':has() shipped in all major browsers by late 2023/2024 — it\'s safe to use in modern production apps, but still worth checking your specific browser support matrix for legacy targets.')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Style a form field wrapper only if it contains an invalid input */
.field:has(input:invalid) {
  border-color: red;
}

/* Style a card differently if it has an image (vs text-only) */
.card:has(img) {
  grid-template-columns: 120px 1fr;
}

/* Style a label based on a checkbox's checked state — no JS toggle needed */
label:has(input:checked) {
  background: var(--accent-bg);
  font-weight: 600;
}

/* Select a heading ONLY if immediately followed by a paragraph */
h2:has(+ p) {
  margin-bottom: 4px;
}`, 'has.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Form validation styling', body:'Highlight a whole field group as invalid without adding a JS-driven class toggle — the browser already knows validity state.' },
        { title:'Custom checkbox/radio UI', body:'Style a styled "fake" checkbox based on the real (visually hidden) input\'s :checked state via :has() on the label.' },
        { title:'Conditional card layouts', body:'A card component can lay itself out differently depending on whether it contains an image, badge, or footer — pure CSS, no variant props needed.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'cascade-layers',
  title: 'Cascade Layers (@layer)',
  dek: 'Explicit, name-based precedence groups that end specificity wars between resets, frameworks, and app code.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>@layer</code> lets you declare named groups of styles and control their precedence order explicitly — independent of specificity or source order. A rule in a later-declared layer always beats a rule in an earlier layer, <b>even if the earlier layer's selector is more specific</b>. Unlayered styles (plain CSS with no <code>@layer</code>) always win over anything in a layer, which is important to remember.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Declare layer order up front — this order is what matters, not file order */
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer components {
  .button { padding: 8px 16px; border-radius: 6px; background: blue; }
}

@layer utilities {
  /* even though .text-red has lower specificity than .button below,
     it wins because 'utilities' is declared LAST */
  .text-red { color: red !important; }
}

/* A third-party library's styles can be dropped into their own layer
   so your app styles can override them without fighting specificity */
@import url('some-library.css') layer(vendor);`, 'layers.css')}
      ${callout('Why this matters', 'Before @layer, overriding a UI library often meant escalating specificity (extra classes, IDs, !important) in an arms race. With layers, you just declare your app styles in a layer that comes after the library\'s layer — done.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Design systems + app overrides', body:'A shared component library ships in one layer; consuming apps override safely from a later layer without !important.' },
        { title:'CSS resets', body:'Put a reset in the very first layer so it never accidentally beats intentional component styles.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'container-queries-deep',
  title: 'Container Queries — Deep Dive',
  dek: 'Beyond the basics: container types, container-name, and style queries.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Container queries respond to the size of a <b>containment context</b> you opt an element into via <code>container-type</code>, not the viewport. There are two relevant values: <code>inline-size</code> (query width only — the common case) and <code>size</code> (query both dimensions, but requires the container to have an explicit size since it can no longer size itself based on content). Naming a container with <code>container-name</code> lets a deeply nested descendant target a specific ancestor container rather than the nearest one.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}
.main-grid {
  container-type: inline-size;
  container-name: main;
}

/* Target a SPECIFIC named container, not just "nearest ancestor" */
@container sidebar (min-width: 300px) {
  .product-card { flex-direction: row; }
}
@container main (min-width: 600px) {
  .product-card { flex-direction: column; }
}

/* Same component, two different layouts, depending purely on
   which container it happens to be rendered inside */`, 'container-queries.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Truly reusable components', body:'A <code>&lt;ProductCard&gt;</code> dropped into a narrow sidebar vs. a wide main grid can each get the right layout automatically.' },
        { title:'Dashboard widgets', body:'Draggable/resizable dashboard panels (think Grafana-style) need to reflow their internal content based on the panel\'s own size, not the window.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'grid-subgrid',
  title: 'CSS Grid — Subgrid',
  dek: 'Letting nested grid items align to their parent grid\'s tracks instead of defining their own.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Normally, a grid item that is itself <code>display: grid</code> defines its own independent set of tracks — its children have no awareness of the parent grid's column/row lines. <code>grid-template-columns: subgrid</code> (or rows) tells a nested grid to <b>reuse its parent's track definitions</b> instead, so nested content can align perfectly across sibling cards — a layout problem that was previously unsolvable in pure CSS.</p>
    </section>
    <section class="block">
      ${h2('Example — Aligned Card Grid')}
      ${codeBlock('css', `
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;   /* reuse the PARENT's row tracks */
}
/* Now every card's title/body/footer rows line up perfectly across
   the whole grid, even if one card's title wraps to two lines —
   without subgrid, each card would size its rows independently */

.card__title  { grid-row: 1; }
.card__body   { grid-row: 2; }
.card__footer { grid-row: 3; }`, 'subgrid.css')}
      ${callout('Support note', 'Subgrid has solid support in Firefox, Safari, and Chrome (from v117+) as of 2024/2025 — check your target browser matrix, but it\'s generally safe for modern apps.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Product/pricing card grids', body:'Keeps titles, prices, and CTA buttons aligned across a row of cards even when content length varies — previously required JS height-matching hacks.' },
        { title:'Form layouts', body:'Aligning labels and inputs across multiple nested fieldsets to a shared column grid.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'logical-properties',
  title: 'Logical Properties & Writing Modes',
  dek: 'Direction-aware CSS — writing "start/end" instead of "left/right" so layouts work correctly in any language.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Physical properties (<code>margin-left</code>, <code>text-align: right</code>) hardcode a left-to-right assumption. <b>Logical properties</b> use flow-relative terms — <code>inline</code> (the direction text flows, e.g. left→right in English) and <code>block</code> (the direction blocks stack, e.g. top→bottom) — so the same CSS automatically adapts when <code>direction: rtl</code> is set for Arabic/Hebrew, without a separate RTL stylesheet.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* ❌ Physical — breaks in RTL layouts */
.card {
  margin-left: 16px;
  padding-right: 24px;
  text-align: left;
  border-left: 3px solid var(--accent);
}

/* ✅ Logical — automatically flips for RTL, zero extra CSS */
.card {
  margin-inline-start: 16px;   /* "left" in LTR, "right" in RTL */
  padding-inline-end: 24px;    /* "right" in LTR, "left" in RTL */
  text-align: start;
  border-inline-start: 3px solid var(--accent);
}

/* inline-size / block-size replace width / height for the same reason
   in vertical writing modes (e.g. some Japanese typesetting) */
.sidebar { inline-size: 280px; }`, 'logical-properties.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Internationalized products', body:'Any product shipping Arabic/Hebrew/Urdu locales needs this — logical properties remove the need to maintain a parallel `[dir="rtl"]` override stylesheet.' },
        { title:'Design systems', body:'Modern component libraries (Material, Spectrum) author with logical properties by default so consumers get RTL support for free.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'clamp-fluid-sizing',
  title: 'clamp(), min(), max() — Fluid Sizing',
  dek: 'Responsive values without media query breakpoints — one line replaces three.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>clamp(min, preferred, max)</code> picks a value that scales fluidly with viewport (or any relative unit) between a floor and a ceiling — the browser continuously recalculates it, unlike a media query which jumps abruptly at a breakpoint. <code>min()</code> and <code>max()</code> are the same idea with only one bound. This collapses what used to require 3+ media queries into a single declaration.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Fluid heading: never smaller than 1.75rem, never larger than 3.5rem,
   scales smoothly with viewport width in between */
h1 { font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem); }

/* Fluid spacing that respects a container's available width */
.section { padding-inline: clamp(16px, 5vw, 64px); }

/* min() — never wider than 90% of the viewport, capped at 600px */
.modal { width: min(90vw, 600px); }

/* max() — at least 300px, but grows with content/container */
.sidebar { width: max(300px, 20%); }`, 'clamp.css')}
      ${callout('Why it beats media queries here', 'Text and spacing that "step" at breakpoints often look visually jarring at the exact pixel where they jump. clamp() interpolates continuously, so there\'s no visible snap.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Fluid typography systems', body:'Design systems increasingly define type scale entirely in clamp() so headings scale smoothly across every device width, not just at 3-4 breakpoints.' },
        { title:'Modal/dialog sizing', body:'min(90vw, 600px) is the standard one-liner for "never touch the screen edges, but cap at a sane max width."' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'is-where-selectors',
  title: ':is() and :where() Selector Functions',
  dek: 'Grouping selectors to reduce repetition — and controlling whether the group adds specificity or not.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Both take a comma-separated selector list and match any of them, but differ in specificity: <code>:is()</code> takes the specificity of its <b>most specific</b> argument; <code>:where()</code> always contributes <b>zero specificity</b>, no matter what's inside it — making it ideal for resets and base styles that should be trivially overridable.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Without :is() — repetitive */
header a:hover, main a:hover, footer a:hover { color: var(--accent); }

/* With :is() — same result, far less repetition */
:is(header, main, footer) a:hover { color: var(--accent); }

/* :where() — zero specificity, trivially overridable by ANY other rule */
:where(h1, h2, h3) { margin-block: 0; }
/* a plain ".title { margin-block: 8px }" will always beat the rule above,
   even though ".title" alone has lower specificity than "h1, h2, h3" would */`, 'is-where.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'CSS resets / base styles', body:':where() is the standard modern way to write a reset so it never fights app-level overrides on specificity.' },
        { title:'Utility/design-system authoring', body:'Component libraries use :is() to write compact selector groups without accidentally inflating specificity beyond what\'s needed.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'feature-queries',
  title: '@supports — Feature Queries',
  dek: 'Detecting browser support for a CSS feature before using it, so older browsers get a safe fallback.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>@supports</code> lets you write CSS that only applies if the browser actually understands a given property/value — the CSS equivalent of feature detection. This lets you progressively enhance: write a safe fallback first, then use <code>@supports</code> to layer on a modern technique for browsers that support it, without breaking older ones.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Fallback first — works everywhere */
.gallery {
  display: flex;
  flex-wrap: wrap;
}

/* Enhancement — only applied if the browser understands CSS Grid subgrid */
@supports (grid-template-rows: subgrid) {
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Check multiple conditions */
@supports (display: grid) and (gap: 1rem) {
  .layout { display: grid; gap: 1rem; }
}

/* not() — target browsers that DON'T support something */
@supports not (backdrop-filter: blur(10px)) {
  .modal-overlay { background: rgba(0,0,0,0.85); } /* opaque fallback */
}`, 'supports.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Progressive enhancement', body:'Ship a solid baseline experience for all browsers, then layer on newer CSS (subgrid, container queries) only where supported.' },
        { title:'Design system libraries', body:'Component libraries supporting a wide browser matrix use @supports to safely adopt new CSS features ahead of universal support.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'css-architecture',
  title: 'CSS Architecture — BEM & Utility-First',
  dek: 'Two competing philosophies for naming and organizing CSS at scale, and when each makes sense.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><b>BEM</b> (Block__Element--Modifier) is a naming convention that encodes structure into class names, keeping specificity flat (every selector is a single class) and making relationships between elements explicit just from reading the HTML. <b>Utility-first</b> (Tailwind-style) instead composes small, single-purpose classes directly in markup — no custom CSS file to maintain per component, at the cost of longer class lists in the HTML.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<!-- BEM: block__element--modifier -->
<div class="card card--featured">
  <img class="card__image" src="...">
  <h3 class="card__title">Product name</h3>
  <button class="card__button card__button--primary">Buy now</button>
</div>

<style>
  .card { border-radius: 8px; padding: 16px; }
  .card--featured { border: 2px solid gold; }
  .card__title { font-size: 18px; font-weight: 600; }
  .card__button--primary { background: blue; color: white; }
</style>

<!-- Utility-first (Tailwind-style): compose from small classes -->
<div class="rounded-lg p-4 border-2 border-gold">
  <img class="w-full rounded" src="...">
  <h3 class="text-lg font-semibold">Product name</h3>
  <button class="bg-blue-600 text-white px-4 py-2 rounded">Buy now</button>
</div>`, 'architecture.html')}
    </section>
    <section class="block">
      ${h2('Which To Choose')}
      ${useCaseGrid([
        { title:'BEM fits', body:'Teams that want a clean separation between markup and styling, design systems with a dedicated CSS/design team, or codebases avoiding a build-time utility framework.' },
        { title:'Utility-first fits', body:'Fast iteration in product teams, avoiding the "naming things is hard" tax, and keeping styles co-located with markup so nothing goes stale in an unused CSS file.' },
        { title:'In practice', body:'Many component-based apps (Angular included) use utility classes for layout/spacing and a few well-named custom classes for genuinely reusable, complex components — a hybrid, not a strict either/or.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'css-houdini-property',
  title: '@property & CSS Houdini',
  dek: 'Giving custom properties a real type, so the browser can animate them smoothly instead of treating them as opaque strings.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A plain custom property (<code>--angle: 0deg</code>) is, to the browser, just a string — it has no type, so the browser can't interpolate it during a transition/animation (you can't "animate" between the strings "0deg" and "360deg" the way you can a number). <code>@property</code> (part of the CSS Houdini initiative) registers a custom property with an explicit <b>syntax</b> (its type), an <b>initial value</b>, and whether it <b>inherits</b> — once registered, the browser knows how to interpolate it, unlocking smooth animation of things that were previously animation-dead-ends, like gradient angles or a custom counter-driven value.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Register the custom property with a real type */
@property --gradient-angle {
  syntax: '<angle>';       /* tells the browser this is an angle, not just a string */
  initial-value: 0deg;
  inherits: false;
}

.spinner {
  background: conic-gradient(from var(--gradient-angle), #4fa8ff, #ff4b55);
  transition: --gradient-angle 1s linear;
}
.spinner:hover {
  --gradient-angle: 360deg;   /* NOW this smoothly animates — impossible without @property */
}

/* Without @property, the line above would just "snap" instantly —
   the browser has no idea how to interpolate an unregistered custom property */`, 'houdini.css')}
      ${callout('What "Houdini" means', 'CSS Houdini is a broader umbrella of low-level APIs (Paint API, Layout API, Properties & Values API) that expose parts of the CSS engine to JavaScript/CSS directly, so developers can extend CSS itself rather than waiting years for new native features. @property is the most practically useful, widely-supported piece of it today.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Animated gradients & loaders', body:'Smoothly rotating conic-gradient spinners, animated progress rings driven by a custom percentage property — previously required JS-driven inline styles to animate at all.' },
        { title:'Design tokens with type safety', body:'Registering a design token\'s type (e.g. a spacing value must be a <length>) catches accidental invalid values earlier and enables safer theming.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'scroll-driven-animations',
  title: 'Scroll-Driven Animations',
  dek: 'Tying an animation\'s progress directly to scroll position — entirely in CSS, no scroll event listener required.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Traditionally, "animate as the user scrolls" (a progress bar, a parallax effect, a fade-in reveal) meant a JS scroll event listener recalculating styles on every frame — expensive and prone to jank. Native <b>scroll-driven animations</b> let a <code>@keyframes</code> animation's timeline be driven directly by scroll position instead of wall-clock time, computed entirely by the browser's compositor — off the main thread, no JS required.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Reading progress bar that fills as the user scrolls the page */
@keyframes grow-progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
.progress-bar {
  animation: grow-progress linear;
  animation-timeline: scroll(root);   /* driven by document scroll, not time */
  transform-origin: left;
}

/* Fade + slide an element in as it enters the viewport */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal-card {
  animation: fade-in-up linear both;
  animation-timeline: view();          /* driven by the element's own visibility in viewport */
  animation-range: entry 0% cover 40%; /* animate only across this portion of scroll */
}`, 'scroll-driven.css')}
      ${callout('Browser support note', 'This is one of the newer CSS features (broad support landed through 2024) — check your target browser matrix, and treat it as a progressive enhancement layered on top of content that\'s already visible/usable without it.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Reading progress indicators', body:'Blog/article "how far you\'ve scrolled" bars — a longstanding pattern that used to require a scroll listener + rAF loop, now pure CSS.' },
        { title:'Scroll-reveal content', body:'Cards/sections fading or sliding in as they enter the viewport — a common marketing-site pattern, now off the main thread entirely.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'will-change-gpu-layers',
  title: 'will-change & GPU Compositing Layers',
  dek: 'Giving the browser a heads-up before an animation starts, so it can prepare an optimized rendering path in advance.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>We covered earlier that animating <code>transform</code>/<code>opacity</code> can skip Layout and Paint, running on the Composite step alone. But the browser still needs to <b>promote</b> an element onto its own GPU layer to do this — and that promotion itself has a small cost. <code>will-change</code> tells the browser "this property is about to change, prepare a layer for it now" — done ahead of time (e.g. on hover-start) rather than the instant the animation begins, avoiding a visible stutter on the very first frame.</p>
      ${callout('The trap', 'will-change is not a free performance boost — leaving it applied permanently on many elements can consume significant GPU memory (each promoted layer costs memory) and can actually hurt performance. Apply it briefly, right before an animation, and remove it after — never as a blanket "just in case" rule.')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* ❌ Applied permanently to every card — wastes GPU memory on cards
   that are never actually animating at any given moment */
.card { will-change: transform; }

/* ✅ Applied only during the interaction that actually needs it */
.card {
  transition: transform 200ms ease-out;
}
.card:hover {
  will-change: transform;   /* hint added right as the animation is about to start */
  transform: translateY(-4px) scale(1.02);
}`, 'will-change.css')}
      ${codeBlock('js', `
// For JS-triggered animations, add/remove will-change dynamically —
// the same principle: hint just before, clean up right after
element.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform';
});
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';   // release the layer once the animation is done
});`, 'will-change-js.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Complex hover/drag interactions', body:'Elements that transform significantly on interaction (drag handles, expanding cards) benefit from a well-timed will-change hint to avoid a first-frame stutter.' },
        { title:'Debugging with DevTools layers panel', body:'Chrome DevTools\' "Layers" panel visually shows which elements have been promoted to their own compositing layer — useful for confirming will-change is actually helping, not just guessing.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'print-stylesheets',
  title: 'Print Stylesheets',
  dek: 'Styling specifically for when a page gets printed or exported to PDF — often overlooked, but expected for invoices, receipts, and reports.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>The <code>@media print</code> query lets you define styles that apply only when a page is printed (or "printed" to PDF via the browser's print dialog) — completely separate from the screen stylesheet. Without it, a page prints exactly as it appears on screen: dark backgrounds waste ink, navigation bars and buttons that mean nothing on paper still show up, and content can awkwardly split across page boundaries.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
@media print {
  /* Hide anything meaningless on paper */
  nav, .sidebar, .no-print, button, .cookie-banner {
    display: none !important;
  }

  /* Force light backgrounds and dark text regardless of the app's dark theme */
  body {
    background: white;
    color: black;
  }

  /* Show the actual URL next to links — a reader can't click a printed page */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #555;
  }

  /* Prevent awkward mid-element page breaks */
  .invoice-line-item, table tr, .card {
    break-inside: avoid;
  }

  /* Force a new page before a major section */
  .invoice-summary {
    break-before: page;
  }

  @page {
    margin: 2cm;   /* controls the physical page margins, not CSS box margins */
  }
}`, 'print.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Invoices & receipts', body:'E-commerce and SaaS billing pages almost always need a clean print stylesheet since "print as PDF" is the primary way users save/share invoices.' },
        { title:'Reports & printable documents', body:'Dashboards or data views with a "print report" button rely entirely on this to produce something professional-looking rather than a chopped-up screenshot of the UI.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'aspect-ratio-object-fit',
  title: 'aspect-ratio & object-fit',
  dek: 'Keeping images and video from stretching or distorting, and reserving correct space for them before they even load.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>aspect-ratio</code> lets an element maintain a defined width-to-height ratio automatically — no more padding-percentage hacks to reserve space for a 16:9 video before it loads. <code>object-fit</code> controls how an image/video fills its box when the box's aspect ratio doesn't match the media's natural ratio: <code>cover</code> fills the box completely, cropping overflow; <code>contain</code> fits the whole media inside, letterboxing if needed; <code>fill</code> stretches to fit exactly (usually looks distorted, rarely what you want).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Reserve space for a video BEFORE it loads — prevents layout shift */
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
}
.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: cover;   /* fills the box, crops overflow — no distortion */
}

/* Square product thumbnails regardless of the source image's actual dimensions */
.product-thumb {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
}

/* Logo that must show ENTIRELY, never cropped, even in a fixed box */
.logo {
  aspect-ratio: 3 / 1;
  object-fit: contain;   /* letterboxes rather than crops */
}`, 'aspect-ratio.css')}
      ${callout('Pairs directly with earlier topics', 'This is exactly the mechanism that makes the width/height attributes on NgOptimizedImage (covered earlier) work well together with responsive containers — aspect-ratio reserves the box, object-fit controls how the image behaves inside it.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Video embeds', body:'Maintaining a correct 16:9 (or any) ratio responsively, without the old "padding-bottom: 56.25%" hack that used to be the standard workaround.' },
        { title:'Product/avatar image grids', body:'Uniform square or fixed-ratio thumbnails from source images of wildly different dimensions — object-fit: cover is the standard fix.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'text-truncation',
  title: 'Text Truncation & Line Clamping',
  dek: 'Cutting off overflowing text with an ellipsis — for a single line, and for a fixed number of lines.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Single-line truncation is a well-established three-property combo. Multi-line truncation ("show exactly 3 lines, then ellipsis") historically required a WebKit-specific hack — <code>-webkit-line-clamp</code> — which has since become a de facto cross-browser standard despite the vendor prefix in its name, and is now also available as the standard, unprefixed <code>line-clamp</code> in newer browsers.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Single-line truncation — the classic three-property combo */
.title {
  white-space: nowrap;       /* prevent wrapping to a new line */
  overflow: hidden;           /* hide anything that overflows the box */
  text-overflow: ellipsis;    /* show "…" at the cut-off point */
}

/* Multi-line clamp — show exactly 3 lines, then "…" */
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* newer standard equivalent, supported in recent browsers: */
  line-clamp: 3;
}`, 'truncation.css')}
      ${callout('Common gotcha', 'Truncation only works if the element actually has a constrained width (or is inside a flex/grid item without min-width: 0) — a flex child\'s default min-width: auto can prevent it from ever shrinking enough to trigger overflow. Add min-width: 0 to the truncated element\'s flex/grid container if truncation silently isn\'t working.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Card/list titles', body:'Product names, article titles — any variable-length text in a fixed-width card needs single-line truncation to avoid breaking the layout.' },
        { title:'Preview/summary text', body:'Article excerpts, comment previews, product descriptions in a grid — line-clamp keeps card heights consistent regardless of content length.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'scroll-snap',
  title: 'CSS Scroll Snap',
  dek: 'Native, physics-free "snap to item" scrolling — carousels and paginated content without a JavaScript library.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Scroll snap makes a scrollable container "lock" to specific positions as the user scrolls or swipes, rather than stopping at an arbitrary point — the mechanism behind native-feeling carousels, image galleries, and full-page scroll sections, entirely in CSS. The parent gets <code>scroll-snap-type</code> (which axis, and how strictly to snap); each child gets <code>scroll-snap-align</code> (where within the viewport it should align to).</p>
    </section>
    <section class="block">
      ${h2('Example — Horizontal Carousel')}
      ${codeBlock('css', `
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;   /* horizontal axis, ALWAYS snap (vs "proximity" = softer) */
  gap: 16px;
  scroll-behavior: smooth;
}
.carousel-item {
  scroll-snap-align: center;        /* each item centers itself when snapped to */
  flex: 0 0 80%;                    /* each card takes 80% of the viewport width */
}

/* Full-page vertical snap sections */
.snap-container {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}
.snap-section {
  height: 100vh;
  scroll-snap-align: start;
}`, 'scroll-snap.css')}
      ${callout('mandatory vs proximity', 'mandatory ALWAYS snaps to the nearest point when scrolling stops — can feel too aggressive for some content. proximity only snaps if you\'re already close to a snap point, feeling gentler for content that\'s also meant to be read mid-scroll, not just paged through.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Product image carousels', body:'Mobile-friendly swipeable galleries that "snap" to show one image at a time — replaces many JS carousel libraries for the simple case.' },
        { title:'Full-page scroll storytelling sections', body:'Marketing sites with distinct full-viewport sections that snap into place as the user scrolls, without a scroll-jacking JS library.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'backdrop-filter-blend-modes',
  title: 'backdrop-filter & Blend Modes',
  dek: 'Glassmorphism and creative color-mixing effects — blurring or blending whatever is BEHIND an element, not the element itself.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>filter</code> (covered implicitly elsewhere) affects an element's own rendering — its own blur, brightness, etc. <code>backdrop-filter</code> instead applies the effect to whatever is <b>behind</b> the element, visible through its (usually semi-transparent) background — this is the specific mechanism behind the popular "frosted glass" UI effect. <code>mix-blend-mode</code> controls how an element's content blends with whatever is beneath it, using the same blend modes familiar from Photoshop (multiply, screen, overlay, etc.).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Classic "frosted glass" navbar — blurs whatever scrolls behind it */
.navbar {
  background: rgba(255, 255, 255, 0.7);   /* semi-transparent background */
  backdrop-filter: blur(12px) saturate(1.5);
  -webkit-backdrop-filter: blur(12px) saturate(1.5);  /* Safari still needs the prefix */
}

/* Glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

/* Blend mode — image tinted by an overlay color, blending WITH the image beneath */
.tinted-image {
  background-color: #4fa8ff;
  background-blend-mode: multiply;   /* the color multiplies with the image's own colors */
}

/* mix-blend-mode — element blends with content BEHIND it in the stacking context */
.overlay-text {
  mix-blend-mode: difference;   /* text color inverts based on what's underneath — always readable */
  color: white;
}`, 'backdrop-filter.css')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Frosted-glass navigation/modals', body:'A dominant modern UI trend (macOS/iOS-style translucent panels) — backdrop-filter: blur() is the specific mechanism behind it.' },
        { title:'Image overlays with guaranteed contrast', body:'mix-blend-mode: difference on overlay text guarantees readability against any background image, without needing to know the image\'s colors in advance.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'prefers-media-features',
  title: 'prefers-color-scheme & prefers-reduced-motion',
  dek: 'Respecting the user\'s OS-level preferences for dark mode and reduced motion, automatically.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>These are media queries that read the user's <b>operating system</b> settings, not anything about the browser window itself. <code>prefers-color-scheme</code> lets a page automatically match the OS's light/dark mode setting. <code>prefers-reduced-motion</code> respects a genuine accessibility setting some users enable because animation can trigger discomfort, dizziness, or worse for vestibular disorders — this one isn't just a nice-to-have, it's directly tied to user wellbeing and is referenced in WCAG guidelines.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('css', `
/* Automatic dark mode based on OS setting — combine with custom properties (covered earlier) */
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0e14;
    --text: #e2e8f0;
  }
}
body { background: var(--bg); color: var(--text); }

/* Respecting reduced motion — a REAL accessibility requirement, not just polish */
.hero-animation {
  animation: float 3s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .hero-animation {
    animation: none;   /* or a much shorter/subtler alternative */
  }
}

/* A safe, universal default some teams apply globally */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`, 'prefers-media.css')}
      ${callout('JS-side detection, too', 'The same preferences are readable in JavaScript via window.matchMedia(\'(prefers-color-scheme: dark)\').matches — useful for anything beyond pure CSS, like choosing which image variant to load or configuring a JS-driven animation library.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Dark mode as a default, not just a toggle', body:'Respecting prefers-color-scheme means a well-built app gets a sensible dark mode automatically, with a manual toggle (using the custom-properties pattern from earlier) as an override on top.' },
        { title:'Legal/accessibility compliance', body:'Disabling or reducing non-essential motion for users who\'ve explicitly requested it at the OS level is treated as a genuine accessibility requirement in many audits, not an optional nicety.' },
      ])}
    </section>
  `
},

  ]
};
