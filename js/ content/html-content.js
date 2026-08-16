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

  ]
};
