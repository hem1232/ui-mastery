window.NG_CONTENT = {
  label: 'Angular',
  topics: [

// ============================================================
{
  id: 'ng-architecture',
  title: 'Angular Architecture Overview',
  dek: 'How components, services, modules, and the router fit together — and how that shape has changed with standalone APIs.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Angular is a full, opinionated framework (not a library) — it ships with routing, forms, HTTP, dependency injection, and testing tools built in, all TypeScript-first. The building block[...]
      <ul>
        <li><b>Components</b> — UI + logic + template, the fundamental unit</li>
        <li><b>Services</b> — injectable classes for logic/state shared across components (API calls, auth state)</li>
        <li><b>Directives</b> — attach behavior to existing DOM elements (structural like <code>*ngIf</code>, or attribute like custom validators)</li>
        <li><b>Pipes</b> — transform data for display (<code>{{ price | currency }}</code>)</li>
        <li><b>Dependency Injection</b> — Angular's hierarchical DI system wires services into components automatically</li>
      </ul>
      ${callout('Modern shift (v14+)', 'NgModules used to be mandatory glue holding all of this together. As of Angular 14+, <b>standalone components</b> let a component declare its own dependenci[...]
    </section>
    <section class="block">
      ${h2('Architecture Diagram')}
      ${diagram(`
        <svg viewBox="0 0 640 260" width="100%" style="max-width:640px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="11.5">
            <rect x="230" y="10" width="180" height="46" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="320" y="38" text-anchor="middle" fill="#f1f5f9">AppComponent (root)</text>

            <line x1="320" y1="56" x2="150" y2="100" stroke="#7c8798" marker-end="url(#na)"/>
            <line x1="320" y1="56" x2="490" y2="100" stroke="#7c8798" marker-end="url(#na)"/>
            <rect x="60" y="100" width="180" height="46" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="150" y="128" text-anchor="middle" fill="#f1f5f9">HeaderComponent</text>
            <rect x="400" y="100" width="180" height="46" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="490" y="128" text-anchor="middle" fill="#f1f5f9">RouterOutlet → Page</text>

            <line x1="490" y1="146" x2="490" y2="180" stroke="#7c8798" marker-end="url(#na)"/>
            <rect x="400" y="180" width="180" height="46" rx="6" fill="#4fa8ff14" stroke="#4fa8ff"/>
            <text x="490" y="208" text-anchor="middle" fill="#f1f5f9">inject(UserService)</text>

            <line x1="150" y1="146" x2="150" y2="180" stroke="#7c8798" stroke-dasharray="3,3" marker-end="url(#na)"/>
            <rect x="60" y="180" width="180" height="46" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="150" y="200" text-anchor="middle" fill="#f1f5f9">*ngIf / @if directive</text>
            <text x="150" y="216" text-anchor="middle" fill="#7c8798" font-size="10">conditionally renders</text>
          </g>
          <defs><marker id="na" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'Component tree + injected services form the two axes of a real Angular app')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Enterprise dashboards', body:'Angular\'s strong opinions (DI, RxJS, TypeScript-first) suit large teams building long-lived, multi-year internal tools.' },
        { title:'Design-system-heavy apps', body:'Angular\'s component + module structure maps naturally onto large, standardized component libraries.' },
      ])}
    </section>
  `
},

  ]
};
