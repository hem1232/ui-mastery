window.HTML_CONTENT = {
  label: 'HTML',
  topics: [

// ============================================================
{
  id: 'semantic-html',
  title: 'Semantic HTML & Document Structure',
  dek: 'Using elements that describe meaning, not just appearance — the foundation of accessible, maintainable, SEO-friendly markup.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Semantic HTML means choosing elements based on <b>what content means</b>, not how it looks. <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> carry no meaning — screen readers, search engines, and other developers can't infer anything from them. Elements like <code>&lt;nav&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;aside&gt;</code>, and <code>&lt;header&gt;</code> communicate structure and role directly in the markup.</p>
      <p>This matters because the browser builds an <b>accessibility tree</b> from your HTML in parallel with the DOM. Assistive technology (screen readers, voice control) navigates that tree, not the visual layout. A sighted user scans a page visually in seconds; a screen-reader user "scans" it by jumping between landmarks and headings — semantic tags are what make that possible.</p>

      ${callout('Rule of thumb', `Reach for a semantic element first. Only fall back to <code>&lt;div&gt;</code>/<code>&lt;span&gt;</code> when no existing element fits the meaning — they exist purely as generic, styling-only containers.`)}
    </section>

    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<body>
  <header>
    <img src="logo.svg" alt="Acme Inc.">
    <nav aria-label="Primary">
      <ul>
        <li><a href="/products">Products</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Understanding the Event Loop</h1>
      <p>Published <time datetime="2026-08-01">Aug 1, 2026</time></p>
      <section>
        <h2>Call Stack Basics</h2>
        <p>...</p>
      </section>
    </article>

    <aside aria-label="Related reading">
      <h2>You might also like</h2>
      <ul>...</ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Acme Inc.</p>
  </footer>
</body>`, 'index.html')}
    </section>

    <section class="block">
      ${h2('Document Outline Diagram')}
      ${diagram(`
        <svg viewBox="0 0 640 260" width="100%" style="max-width:640px;display:block;margin:0 auto;">
          <rect x="10" y="10" width="620" height="240" rx="8" fill="none" stroke="#e3a53f" stroke-width="1.5"/>
          <text x="20" y="30" fill="#e3a53f" font-family="JetBrains Mono" font-size="12">&lt;body&gt;</text>
          <rect x="24" y="40" width="592" height="40" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
          <text x="34" y="64" fill="#f1f5f9" font-family="JetBrains Mono" font-size="12">&lt;header&gt; — logo + &lt;nav&gt;</text>
          <rect x="24" y="90" width="360" height="130" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
          <text x="34" y="112" fill="#f1f5f9" font-family="JetBrains Mono" font-size="12">&lt;main&gt;</text>
          <rect x="40" y="122" width="330" height="88" rx="6" fill="#0a0e14" stroke="#e3a53f" stroke-dasharray="3,3"/>
          <text x="50" y="144" fill="#cbd5e1" font-family="JetBrains Mono" font-size="11.5">&lt;article&gt;</text>
          <text x="60" y="164" fill="#7c8798" font-family="JetBrains Mono" font-size="11">&lt;h1&gt; + &lt;section&gt;&lt;h2&gt;</text>
          <rect x="396" y="90" width="220" height="130" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
          <text x="406" y="112" fill="#f1f5f9" font-family="JetBrains Mono" font-size="12">&lt;aside&gt;</text>
          <text x="406" y="132" fill="#7c8798" font-family="JetBrains Mono" font-size="11">Related content</text>
          <rect x="24" y="232" width="592" height="0" fill="none"/>
        </svg>
      `, 'A screen reader\'s "landmark" view is built directly from tags like header/nav/main/aside/footer')}
    </section>

    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'SEO', body:'Search engines weight content inside <code>&lt;h1&gt;</code>/<code>&lt;article&gt;</code> more heavily than generic divs — directly affects ranking.' },
        { title:'Screen reader navigation', body:'Users jump by landmark ("go to nav", "go to main") — this only works with real semantic tags.' },
        { title:'Design system components', body:'A shared <code>&lt;Card&gt;</code> or <code>&lt;PageHeader&gt;</code> component should render semantic tags internally so every consumer gets accessibility for free.' },
        { title:'Print / reader-mode', body:'Browser "reader view" and print stylesheets rely on <code>&lt;article&gt;</code>/<code>&lt;main&gt;</code> to know what content actually matters.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'forms-validation',
  title: 'Forms & Native Validation',
  dek: 'Input types, constraint validation API, and building accessible forms without reaching for JS first.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>HTML forms have a built-in <b>Constraint Validation API</b> — attributes like <code>required</code>, <code>pattern</code>, <code>min</code>/<code>max</code>, and typed inputs (<code>email</code>, <code>number</code>, <code>tel</code>) give you client-side validation, correct mobile keyboards, and autofill behavior with zero JavaScript. Reaching for a JS validation library before using these is one of the most common over-engineering mistakes in UI work.</p>
      <p>Each input exposes a <code>validity</code> object (<code>ValidityState</code>) describing exactly why it's invalid — <code>valueMissing</code>, <code>patternMismatch</code>, <code>typeMismatch</code>, <code>rangeOverflow</code>, etc. — so you can show precise, custom error messages while still using native validation underneath.</p>
    </section>

    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<form novalidate id="signup">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required
         autocomplete="email" aria-describedby="email-err">
  <span id="email-err" class="error" aria-live="polite"></span>

  <label for="pwd">Password</label>
  <input type="password" id="pwd" name="pwd" required
         minlength="8" pattern="(?=.*\\d)(?=.*[A-Z]).{8,}"
         aria-describedby="pwd-hint">
  <span id="pwd-hint">Min 8 chars, 1 number, 1 uppercase</span>

  <button type="submit">Create account</button>
</form>

<script>
  const form = document.getElementById('signup');
  const email = document.getElementById('email');

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      if (email.validity.typeMismatch) {
        document.getElementById('email-err').textContent =
          'Please enter a valid email address.';
      }
    }
  });
</script>`, 'signup-form.html')}
    </section>

    <section class="block">
      ${h2('Validation Flow')}
      ${diagram(`
        <svg viewBox="0 0 700 170" width="100%" style="max-width:700px;display:block;margin:0 auto;">
          ${["Submit clicked","Browser runs\\nconstraint checks","checkValidity()"].map((t,i)=>``).join('')}
          <g font-family="JetBrains Mono" font-size="11.5">
            <rect x="10" y="60" width="140" height="50" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
            <text x="80" y="90" text-anchor="middle" fill="#f1f5f9">Submit clicked</text>
            <line x1="150" y1="85" x2="200" y2="85" stroke="#7c8798" marker-end="url(#arrow)"/>
            <rect x="200" y="60" width="160" height="50" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
            <text x="280" y="80" text-anchor="middle" fill="#f1f5f9">Native constraint</text>
            <text x="280" y="96" text-anchor="middle" fill="#f1f5f9">checks run</text>
            <line x1="360" y1="85" x2="410" y2="85" stroke="#7c8798" marker-end="url(#arrow)"/>
            <rect x="410" y="10" width="140" height="50" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="480" y="40" text-anchor="middle" fill="#f1f5f9">Valid → submits</text>
            <rect x="410" y="110" width="270" height="50" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="545" y="130" text-anchor="middle" fill="#f1f5f9">Invalid → :invalid state +</text>
            <text x="545" y="146" text-anchor="middle" fill="#f1f5f9">ValidityState flags set</text>
            <line x1="360" y1="80" x2="410" y2="35" stroke="#7c8798" marker-end="url(#arrow)"/>
            <line x1="360" y1="90" x2="410" y2="135" stroke="#7c8798" marker-end="url(#arrow)"/>
          </g>
          <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'form.checkValidity() branches on ValidityState, without any library')}
    </section>

    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Checkout / signup flows', body:'Native <code>type="email"</code>/<code>type="tel"</code> triggers the correct mobile keyboard automatically — a real conversion-rate factor.' },
        { title:'Progressive enhancement', body:'Forms work even if your JS bundle fails to load, since validation and submission are native browser behavior.' },
        { title:'Design systems', body:'Wrap native inputs with custom styling but keep the underlying <code>&lt;input&gt;</code> semantics so autofill and password managers keep working.' },
      ])}
      ${callout('Common pitfall', 'Rebuilding a custom dropdown or date picker entirely in <code>&lt;div&gt;</code>s loses native keyboard support, autofill, and mobile-native pickers. Prefer styling native elements (or using <code>&lt;datalist&gt;</code>) before building from scratch.')}
    </section>
  `
},

// ============================================================
{
  id: 'accessibility-aria',
  title: 'Accessibility & ARIA',
  dek: 'How assistive technology reads your page, and when (and when not) to reach for ARIA attributes.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Accessibility (a11y) is about making UI usable by everyone, including people using screen readers, keyboard-only navigation, or switch devices. The golden rule of ARIA: <b>"No ARIA is better than bad ARIA."</b> Native elements (<code>&lt;button&gt;</code>, <code>&lt;input&gt;</code>) already carry role, state, and keyboard behavior for free. ARIA attributes (<code>role</code>, <code>aria-*</code>) exist to describe custom widgets that HTML has no native element for — a tab panel, a combobox, a modal.</p>
      <p>Three ARIA concepts to know cold:</p>
      <ul>
        <li><b>Roles</b> — what a thing is (<code>role="dialog"</code>, <code>role="tablist"</code>)</li>
        <li><b>Properties</b> — relationships that don't change (<code>aria-labelledby</code>, <code>aria-describedby</code>)</li>
        <li><b>States</b> — values that change at runtime (<code>aria-expanded</code>, <code>aria-checked</code>, <code>aria-hidden</code>)</li>
      </ul>
    </section>

    <section class="block">
      ${h2('Example — Accessible Custom Dropdown')}
      ${codeBlock('html', `
<button aria-haspopup="listbox" aria-expanded="false" id="trigger">
  Sort by: Newest
</button>
<ul role="listbox" aria-labelledby="trigger" id="menu" hidden>
  <li role="option" aria-selected="true" tabindex="0">Newest</li>
  <li role="option" aria-selected="false" tabindex="-1">Oldest</li>
  <li role="option" aria-selected="false" tabindex="-1">Most popular</li>
</ul>

<script>
  const trigger = document.getElementById('trigger');
  const menu = document.getElementById('menu');
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });
</script>`, 'dropdown.html')}

      ${callout('Golden rule', 'If a native HTML element already gives you the behavior — use it. A <code>&lt;div role="button"&gt;</code> requires you to manually add keyboard handling, focus styles, and <code>tabindex</code>. A real <code>&lt;button&gt;</code> gives you all of that for free.')}
    </section>

    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Modals & dialogs', body:'<code>role="dialog"</code> + <code>aria-modal="true"</code> + focus-trapping so keyboard/screen-reader users can\'t "escape" behind the overlay.' },
        { title:'Live regions', body:'<code>aria-live="polite"</code> announces async updates — toast notifications, form errors, cart count changes — without moving focus.' },
        { title:'Legal / enterprise compliance', body:'WCAG 2.1 AA compliance is a legal requirement (ADA, EN 301 549) for many products — accessibility audits check exactly these patterns.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'meta-seo',
  title: 'Meta Tags, SEO & Social Sharing',
  dek: 'How the &lt;head&gt; controls search rankings, link previews, and how browsers render your page.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Everything in <code>&lt;head&gt;</code> is metadata — it's not rendered, but it drives how search engines index the page and how social platforms generate link previews. Getting this right is often higher-leverage than any amount of on-page copy tweaking.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Event Loop Explained — Acme Blog</title>
  <meta name="description" content="A deep dive into the JS event loop, with diagrams.">
  <link rel="canonical" href="https://acme.com/blog/event-loop">

  <!-- Open Graph: controls link previews on Slack/FB/LinkedIn -->
  <meta property="og:title" content="Event Loop Explained">
  <meta property="og:description" content="A deep dive into the JS event loop.">
  <meta property="og:image" content="https://acme.com/og/event-loop.png">
  <meta property="og:type" content="article">

  <!-- Twitter/X card -->
  <meta name="twitter:card" content="summary_large_image">
</head>`, 'head.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Marketing/blog pages', body:'Open Graph tags directly control what image/title appears when a link is shared in Slack, LinkedIn, or iMessage.' },
        { title:'SPA frameworks', body:'Angular Universal / SSR exists largely to solve this — crawlers and social-preview bots often don\'t execute JS, so meta tags must be in the initial HTML.' },
        { title:'Multi-locale sites', body:'<code>&lt;link rel="alternate" hreflang="fr"&gt;</code> tells Google which language version to serve to which region.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'templates-web-components',
  title: 'Templates, Slots & Web Components',
  dek: 'Native, framework-agnostic component primitives: &lt;template&gt;, Shadow DOM, and Custom Elements.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Before React/Angular components existed, the platform gained native equivalents:</p>
      <ul>
        <li><b><code>&lt;template&gt;</code></b> — inert markup, parsed but not rendered until cloned via JS. Zero-cost for images/scripts inside it.</li>
        <li><b>Shadow DOM</b> — encapsulated DOM + CSS subtree attached to an element; styles don't leak in or out.</li>
        <li><b>Custom Elements</b> — define new tags (<code>&lt;user-card&gt;</code>) backed by a JS class with lifecycle callbacks.</li>
      </ul>
      <p>Together these three APIs are called <b>Web Components</b> — this is the foundation Angular Elements, Lit, and Stencil are built on.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
class UserCard extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const name = this.getAttribute('name');
    shadow.innerHTML = \`
      <style>
        .card { border: 1px solid #ccc; padding: 12px; border-radius: 8px; }
      </style>
      <div class="card">
        <slot name="avatar"></slot>
        <h3>\${name}</h3>
        <slot>Default bio text</slot>
      </div>
    \`;
  }
}
customElements.define('user-card', UserCard);
`, 'user-card.js')}
      ${codeBlock('html', `
<user-card name="Priya Shah">
  <img slot="avatar" src="priya.jpg">
  <p>Frontend engineer, ex-Google.</p>
</user-card>`, 'usage.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Design system distribution', body:'Ship one Web Component library consumable from React, Angular, Vue, or plain HTML — used by companies like Adobe (Spectrum) and Salesforce (Lightning).' },
        { title:'Micro-frontends', body:'Independently-deployed teams expose features as custom elements so a shell app can mount them without a shared framework version.' },
        { title:'Angular Elements', body:'Angular can compile a component into a standalone custom element (<code>createCustomElement()</code>) to embed in non-Angular pages.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'tables-tabular-data',
  title: 'Tables & Accessible Tabular Data',
  dek: 'Marking up grid data so it\'s actually readable by a screen reader, not just visually aligned.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A table's accessibility hinges on <b>associating each data cell with its header</b>. Visually, alignment alone tells a sighted user "this number belongs to this column" — but a screen reader reads cell by cell with no visual context, so it needs that relationship spelled out explicitly via <code>&lt;th scope="col"&gt;</code> / <code>scope="row"</code>, or for complex tables, <code>headers</code>/<code>id</code> pairing.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<table>
  <caption>Q3 Revenue by Region</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Revenue</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North America</th>
      <td>$2.1M</td>
      <td>+12%</td>
    </tr>
    <tr>
      <th scope="row">Europe</th>
      <td>$1.4M</td>
      <td>+8%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$3.5M</td>
      <td>+10%</td>
    </tr>
  </tfoot>
</table>`, 'accessible-table.html')}
      ${callout('Common mistake', 'Using a table purely for visual layout (positioning unrelated content in a grid) rather than actual tabular data confuses screen readers, which announce row/column position for every cell. Use CSS Grid/Flexbox for layout — reserve &lt;table&gt; for genuinely tabular data.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Admin dashboards & reports', body:'Financial data, analytics tables, order histories — any grid of related data points needs proper header association for screen-reader users.' },
        { title:'Data export/print views', body:'Semantic tables with <caption>/<thead>/<tfoot> also produce cleaner, more usable output when printed or exported.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'media-elements',
  title: 'Audio & Video Elements',
  dek: 'Native media playback with zero JavaScript required for basic controls.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code> provide native playback, buffering, and (with the <code>controls</code> attribute) a full browser-native UI — no library needed for basic use. Both support multiple <code>&lt;source&gt;</code> children so the browser picks the first format it supports, and both expose a rich JS API (<code>.play()</code>, <code>.pause()</code>, <code>currentTime</code>, events like <code>timeupdate</code>) for building custom players.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<video controls width="640" poster="thumbnail.jpg" preload="metadata">
  <source src="movie.webm" type="video/webm">
  <source src="movie.mp4" type="video/mp4">
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English" default>
  Your browser doesn't support video playback.
</video>

<audio controls>
  <source src="podcast.ogg" type="audio/ogg">
  <source src="podcast.mp3" type="audio/mpeg">
</audio>

<script>
  const video = document.querySelector('video');
  video.addEventListener('timeupdate', () => {
    const pct = (video.currentTime / video.duration) * 100;
    progressBar.style.width = pct + '%';   // building a custom progress UI
  });
</script>`, 'media.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Captions/subtitles', body:'The <track> element is a legal accessibility requirement (WCAG, ADA) for any pre-recorded video content on many products.' },
        { title:'Custom video players', body:'Products like YouTube-style players are built by hiding native controls and building custom UI driven by the underlying media element\'s JS API and events.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'canvas-svg',
  title: 'Canvas vs SVG',
  dek: 'Two very different ways to draw graphics in the browser — pixels vs. objects — and when to reach for each.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><b>Canvas</b> is an immediate-mode bitmap — you issue drawing commands ("draw a circle here") and the browser forgets them immediately; nothing is remembered as a DOM node, so redrawing means re-issuing all commands. This makes it fast for pixel-heavy, frequently-changing graphics (games, real-time visualizations) but means individual shapes aren't inspectable/interactive without your own hit-testing. <b>SVG</b> is retained-mode and vector-based — each shape is a real DOM node you can style with CSS, animate, and attach event listeners to directly, at the cost of more overhead with very large numbers of elements.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
// Canvas — imperative, pixel-based
const ctx = document.querySelector('canvas').getContext('2d');
ctx.fillStyle = '#4fa8ff';
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);  // draw a circle
ctx.fill();
// To "update" it, you clear and redraw everything — no persistent circle object`, 'canvas.js')}
      ${codeBlock('html', `
<!-- SVG — declarative, each shape is a real, styleable, clickable DOM node -->
<svg width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="#4fa8ff" class="interactive-circle" />
</svg>
<style>
  .interactive-circle:hover { fill: #ff4b55; cursor: pointer; }
</style>`, 'svg.html')}
    </section>
    <section class="block">
      ${h2('When To Use Which')}
      ${useCaseGrid([
        { title:'Use Canvas for', body:'Games, real-time charts with thousands of data points, image manipulation/filters, particle effects — anywhere raw pixel throughput matters more than per-shape interactivity.' },
        { title:'Use SVG for', body:'Icons, logos, diagrams, charts with a manageable number of interactive data points, any graphic that needs CSS styling/animation/hover states per element.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'data-attributes',
  title: 'data-* Attributes',
  dek: 'Attaching custom data to HTML elements without inventing invalid, non-standard attributes.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Any attribute prefixed <code>data-*</code> is guaranteed valid HTML and reserved specifically for custom data your application needs — the browser will never assign it built-in meaning, so there's no risk of colliding with a future standard attribute. JavaScript accesses these via the element's <code>.dataset</code> property, which auto-converts <code>data-user-id</code> (kebab-case in HTML) to <code>dataset.userId</code> (camelCase in JS).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<button data-user-id="482" data-role="admin" data-confirm="Delete this user?">
  Delete
</button>

<script>
  const btn = document.querySelector('button');
  console.log(btn.dataset.userId);  // "482" — kebab-case → camelCase automatically
  console.log(btn.dataset.role);    // "admin"

  btn.addEventListener('click', () => {
    if (confirm(btn.dataset.confirm)) {
      deleteUser(btn.dataset.userId);
    }
  });
</script>

/* also directly selectable/stylable in CSS */
<style>
  [data-role="admin"] { border: 1px solid gold; }
</style>`, 'data-attrs.html')}
      ${callout('When NOT to use data-*', 'For structured, framework-managed state, prefer the framework\'s own binding mechanism (Angular\'s property binding, React props) — data-* is best for lightweight metadata that plain JS/CSS needs to read, like test-automation hooks (data-testid) or analytics tracking IDs.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Test automation', body:'data-testid attributes give QA/E2E tests (Cypress, Playwright) stable selectors that don\'t break when CSS classes or text content change.' },
        { title:'Analytics tracking', body:'data-analytics-event attributes let a generic click-tracking script capture structured event data without per-element JS wiring.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'iframes-embedding',
  title: 'iframes & Embedding Third-Party Content',
  dek: 'Sandboxing untrusted or third-party content, and the security attributes that matter.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>An <code>&lt;iframe&gt;</code> embeds an entire separate browsing context (its own DOM, JS execution, navigation history) inside your page — used for embedding maps, videos, payment widgets, or genuinely untrusted content. The <b>same-origin policy</b> prevents your page and the iframe's content from reading each other's DOM/JS unless they share the exact same origin (protocol + domain + port); cross-origin communication must go through <code>postMessage</code>.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<!-- sandbox restricts what the embedded content can do, even if it's malicious -->
<iframe
  src="https://widget.example.com/embed"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  title="Payment widget"
  referrerpolicy="no-referrer">
</iframe>
<!-- sandbox with NO value blocks everything (scripts, forms, popups, top navigation) —
     each "allow-*" token opts back into one specific capability -->`, 'iframe.html')}
      ${codeBlock('js', `
// Safe cross-origin communication with an embedded iframe
const iframe = document.querySelector('iframe');

iframe.contentWindow.postMessage({ type: 'resize', height: 400 }, 'https://widget.example.com');

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://widget.example.com') return; // ALWAYS verify origin
  console.log('Received from iframe:', event.data);
});`, 'postmessage.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Embedded third-party widgets', body:'Payment forms (Stripe Elements), maps, video embeds — sandboxed iframes isolate third-party code from your page\'s full DOM/cookies access.' },
        { title:'Micro-frontend isolation', body:'Some micro-frontend architectures use iframes specifically for the hard isolation guarantee — no shared global state or CSS collision risk, at the cost of communication overhead.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'pwa-basics',
  title: 'Progressive Web App Essentials',
  dek: 'The handful of files that turn a website into an installable, offline-capable app.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A PWA is built from three ingredients layered on top of a normal website: a <b>Web App Manifest</b> (JSON describing the app's name, icons, and display mode, letting browsers offer "Add to Home Screen"), a <b>Service Worker</b> (a background script that can intercept network requests, enabling offline support and caching), and HTTPS (required for service workers to register at all, for security reasons).</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0a0e14">`, 'index.html')}
      ${codeBlock('js', `
// manifest.json
{
  "name": "Acme Dashboard",
  "short_name": "Acme",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0e14",
  "theme_color": "#0a0e14",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`, 'manifest.json')}
      ${codeBlock('js', `
// Registering a service worker — enables offline caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

// Inside service-worker.js — intercept network requests, serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});`, 'sw-registration.js')}
      ${callout('Angular note', 'The Angular CLI has built-in PWA support: <code>ng add @angular/pwa</code> generates the manifest, icons, and a production-ready service worker configuration automatically — no manual setup needed.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Offline-capable web apps', body:'Apps used in low-connectivity environments (field service tools, note-taking apps) rely on service worker caching to remain functional offline.' },
        { title:'Reducing app-store friction', body:'PWAs let a product offer an "install to home screen" experience without going through native app store review processes.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'drag-drop-api',
  title: 'Drag and Drop API',
  dek: 'Native browser support for dragging elements and dropping files — the foundation most drag-drop libraries build on.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>The native Drag and Drop API works via a sequence of events fired on the <b>source</b> element being dragged (<code>dragstart</code>, <code>drag</code>, <code>dragend</code>) and the <b>target</b> element it might be dropped onto (<code>dragenter</code>, <code>dragover</code>, <code>drop</code>). Critically, <code>dragover</code> must call <code>preventDefault()</code> or the browser will refuse to allow a drop at all — this catches almost everyone the first time.</p>
    </section>
    <section class="block">
      ${h2('Example — Reorderable List')}
      ${codeBlock('html', `
<ul id="list">
  <li draggable="true" data-id="1">Task A</li>
  <li draggable="true" data-id="2">Task B</li>
  <li draggable="true" data-id="3">Task C</li>
</ul>

<script>
  let draggedId = null;

  document.querySelectorAll('li').forEach(li => {
    li.addEventListener('dragstart', (e) => {
      draggedId = li.dataset.id;
      e.dataTransfer.effectAllowed = 'move';
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();          // REQUIRED — without this, drop never fires
      e.dataTransfer.dropEffect = 'move';
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetId = li.dataset.id;
      reorderItems(draggedId, targetId);   // your own reorder logic
    });
  });
</script>

<!-- File drop zone — dataTransfer.files gives real File objects -->
<div id="dropzone">Drop files here</div>
<script>
  const zone = document.getElementById('dropzone');
  zone.addEventListener('dragover', (e) => e.preventDefault());
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    files.forEach(file => console.log(file.name, file.size, file.type));
  });
</script>`, 'drag-drop.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Kanban boards / reorderable lists', body:'Trello-style drag-to-reorder UIs — though most production apps use a library (Angular CDK DragDrop, dnd-kit) built on these same underlying events for better cross-device/touch support.' },
        { title:'File upload drop zones', body:'"Drag a file here to upload" is one of the most common real uses, and works natively with zero libraries.' },
      ])}
      ${callout('Practical note', 'Native drag-and-drop has weak touch/mobile support and some cross-browser quirks. For production reorderable lists, most teams use Angular CDK\'s DragDropModule instead, which handles touch, accessibility, and animation on top of similar underlying concepts.')}
    </section>
  `
},

// ============================================================
{
  id: 'file-api',
  title: 'The File API — Reading & Uploading Files',
  dek: 'Reading file contents in the browser before or instead of uploading them to a server.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>An <code>&lt;input type="file"&gt;</code> or a drag-drop event gives you <code>File</code> objects — each one a <code>Blob</code> with metadata (name, size, type). The <code>FileReader</code> API reads a file's actual contents asynchronously (as text, a data URL for image previews, or raw bytes) entirely client-side, without any upload — useful for instant previews or client-side validation before committing to a network request.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) return;

  // Validate BEFORE uploading — save bandwidth and give instant feedback
  if (file.size > 5_000_000) {
    alert('File too large (max 5MB)');
    return;
  }
  if (!file.type.startsWith('image/')) {
    alert('Only image files allowed');
    return;
  }

  // Read as a data URL for an instant local preview — no upload needed yet
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;   // "data:image/png;base64,..."
  };
  reader.readAsDataURL(file);
});

// Actual upload — multipart form data, the standard approach
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedBy', currentUserId);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  // NOTE: don't set a Content-Type header manually — the browser sets the
  // correct multipart boundary automatically when you pass FormData
  return res.json();
}`, 'file-api.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Avatar/image upload with preview', body:'Showing the selected image immediately (before upload completes) via FileReader is standard UX for any profile picture or document upload flow.' },
        { title:'Client-side validation', body:'Checking file size/type before uploading avoids wasted bandwidth and gives the user instant feedback instead of waiting for a server-side rejection.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'responsive-images',
  title: 'Responsive Images — srcset, sizes & <picture>',
  dek: 'Serving the right image size and format to each device, instead of shipping one large image to everyone.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A single <code>&lt;img src="..."&gt;</code> forces every device to download the exact same file — wasteful for a phone screen displaying an image at a fraction of a desktop's size. <code>srcset</code> gives the browser several image resolutions to choose from, and <code>sizes</code> tells it how large the image will actually render at different viewport widths — the browser then picks the most appropriately-sized file itself, before ever downloading anything. <code>&lt;picture&gt;</code> goes further, letting you serve entirely different <b>image files</b> (not just resolutions) — different art crops for mobile vs. desktop, or a modern format like AVIF/WebP with a JPEG fallback.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<!-- srcset + sizes: same image, browser picks the best-fitting resolution -->
<img
  src="product-800.jpg"
  srcset="product-400.jpg 400w, product-800.jpg 800w, product-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Wireless headphones">
<!-- "sizes" says: below 600px viewport, image renders at 100% viewport width;
     above that, it renders at 50% — the browser uses THIS to pick the right srcset file -->

<!-- <picture>: different FILES per condition — format fallback + art direction -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <source media="(max-width: 600px)" srcset="hero-mobile-crop.jpg">
  <img src="hero.jpg" alt="Team collaborating in an office" loading="lazy">
</picture>
<!-- browser tries each <source> top to bottom, uses the first one it supports/matches,
     falls back to the plain <img> if nothing above applies -->`, 'responsive-images.html')}
      ${callout('Common misconception', 'srcset does NOT make the browser download multiple images "just in case" — it downloads exactly ONE, the one it calculates is the best fit. This is a pure optimization, not extra bandwidth cost.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'E-commerce product images', body:'Serving appropriately-sized images across a huge range of devices is a direct, measurable page-weight and load-time win at scale.' },
        { title:'Modern format adoption', body:'The <picture>-with-fallback pattern is the standard safe way to start serving AVIF/WebP (significantly smaller than JPEG/PNG) without breaking support for older browsers.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'resource-hints',
  title: 'Resource Hints — preload, prefetch, preconnect',
  dek: 'Telling the browser what it\'s going to need before it discovers that from parsing the page normally.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>The browser normally discovers what to download by parsing HTML/CSS/JS as it goes — which means some critical resources (a font referenced deep in a CSS file, an API the app will call the instant JS loads) aren't requested until later than ideal. Resource hints let you get ahead of that discovery process for resources you already know matter.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<head>
  <!-- preconnect: establish the connection (DNS + TCP + TLS) early, for a domain
       you KNOW you'll request from soon — saves a full round-trip later -->
  <link rel="preconnect" href="https://api.acme.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- preload: fetch a specific resource you know is critical, with HIGH priority,
       before the browser would normally discover it while parsing -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/hero-image.avif" as="image">

  <!-- prefetch: LOW priority, fetch something likely needed for the NEXT navigation,
       during idle time — doesn't compete with resources needed for THIS page -->
  <link rel="prefetch" href="/checkout-bundle.js">

  <!-- dns-prefetch: the lightest hint — just resolve DNS early, cheaper than full preconnect -->
  <link rel="dns-prefetch" href="https://analytics.example.com">
</head>`, 'resource-hints.html')}
      ${callout('Don\'t overuse preload', 'preload competes for bandwidth with everything else needed for the current page — marking too many things as preload defeats the purpose, since the browser can\'t prioritize among 10 "critical" resources. Reserve it for the handful of things that are GENUINELY blocking-critical (the LCP image, a critical web font).')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Web font loading', body:'Preloading the primary font file is one of the most common, highest-impact uses — avoids the "flash of invisible/unstyled text" many sites show while a font downloads.' },
        { title:'Third-party API/CDN domains', body:'Preconnecting to a payment provider or analytics domain used early in the page lifecycle shaves real, measurable time off the first request to that domain.' },
        { title:'Predictable next-page navigation', body:'Prefetching the bundle for a checkout page while a user is still browsing products is a common e-commerce performance pattern.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'native-lazy-loading',
  title: 'Native Image/Iframe Lazy Loading',
  dek: 'A single HTML attribute that defers offscreen content without any JavaScript intersection-observer code.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>The <code>loading</code> attribute on <code>&lt;img&gt;</code> and <code>&lt;iframe&gt;</code> lets the browser itself defer loading offscreen content until the user scrolls near it — no JS, no library, no manual IntersectionObserver setup. <code>loading="lazy"</code> defers loading; <code>loading="eager"</code> (the default) loads immediately.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<!-- Above-the-fold hero — load immediately, this likely IS the LCP element -->
<img src="hero.jpg" alt="..." loading="eager" fetchpriority="high">

<!-- Below-the-fold content images — defer until near viewport -->
<img src="product-1.jpg" alt="..." loading="lazy" width="300" height="300">
<img src="product-2.jpg" alt="..." loading="lazy" width="300" height="300">

<!-- Embedded iframes far down the page — same idea -->
<iframe src="https://maps.example.com/embed" loading="lazy" title="Store location"></iframe>`, 'lazy-loading.html')}
      ${callout('Always pair with width/height', 'Just like NgOptimizedImage covered in the Angular track, providing explicit width/height lets the browser reserve the correct space before the image loads, preventing layout shift as lazy images pop in while scrolling.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Long content pages', body:'Blog posts, product listing pages, and image galleries with many images below the fold get a real initial-load speed improvement essentially for free.' },
        { title:'Embedded third-party content', body:'Maps, video embeds, and other heavy iframes further down a page are prime lazy-loading candidates since they\'re rarely needed immediately.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'details-summary',
  title: 'The details & summary Elements',
  dek: 'A native, accessible expand/collapse widget — zero JavaScript, keyboard support and ARIA semantics built in.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>&lt;details&gt;</code> wraps content that starts collapsed; its first child <code>&lt;summary&gt;</code> becomes the clickable toggle. The browser handles the open/close state, keyboard interaction (Enter/Space to toggle, focusable by default), and correct ARIA semantics — all the accordion/disclosure behavior teams often reach for a JS library or custom component to build, available natively.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<details>
  <summary>What's your return policy?</summary>
  <p>You can return any item within 30 days of purchase for a full refund.</p>
</details>

<!-- "open" attribute — starts expanded -->
<details open>
  <summary>Shipping information</summary>
  <p>Orders ship within 2 business days.</p>
</details>

<!-- Styling the marker and adding a transition -->
<style>
  details summary { cursor: pointer; list-style: none; }
  details summary::-webkit-details-marker { display: none; }
  details summary::after { content: '+'; float: right; }
  details[open] summary::after { content: '−'; }
</style>

<script>
  // JS API for programmatic control, if needed
  const el = document.querySelector('details');
  el.addEventListener('toggle', () => console.log('Open:', el.open));
</script>`, 'details-summary.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'FAQ sections', body:'Native details/summary gives correct accessibility and keyboard behavior for free — a very common real substitute for a hand-built accordion component.' },
        { title:'Collapsible code/detail sections', body:'Documentation sites and GitHub itself use this pattern for "click to expand" content blocks, since it works even with JavaScript disabled.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'clipboard-api',
  title: 'The Clipboard API',
  dek: 'Copying text to the user\'s clipboard programmatically — the modern, promise-based replacement for the old execCommand hack.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>The modern <code>navigator.clipboard</code> API provides promise-based, secure clipboard read/write access, replacing the old (and now deprecated) <code>document.execCommand('copy')</code> trick that required creating a hidden textarea, selecting its text, and issuing a copy command. It requires a secure context (HTTPS) and, for write access, is generally allowed without special permission when triggered directly by a user gesture like a click.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('js', `
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch (err) {
    // can fail if not triggered by a direct user gesture, or permission denied
    showToast('Failed to copy — please copy manually.');
  }
}

document.querySelector('.copy-btn').addEventListener('click', () => {
  copyToClipboard(document.querySelector('code').textContent);
});

// Reading from the clipboard (requires explicit permission, used far less often)
async function pasteFromClipboard() {
  const text = await navigator.clipboard.readText();
  console.log('Clipboard contains:', text);
}`, 'clipboard.js')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'"Copy code" buttons', body:'Exactly the mechanism behind the copy button on every code block throughout this very reference site.' },
        { title:'Sharing links/referral codes', body:'"Copy invite link" or "copy coupon code" buttons are one of the most common small UX conveniences built on this API.' },
      ])}
    </section>
  `
},

  ]
};
