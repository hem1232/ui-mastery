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
      <p>Angular is a full, opinionated framework (not a library) — it ships with routing, forms, HTTP, dependency injection, and testing tools built in, all TypeScript-first. The building blocks:</p>
      <ul>
        <li><b>Components</b> — UI + logic + template, the fundamental unit</li>
        <li><b>Services</b> — injectable classes for logic/state shared across components (API calls, auth state)</li>
        <li><b>Directives</b> — attach behavior to existing DOM elements (structural like <code>*ngIf</code>, or attribute like custom validators)</li>
        <li><b>Pipes</b> — transform data for display (<code>{{ price | currency }}</code>)</li>
        <li><b>Dependency Injection</b> — Angular's hierarchical DI system wires services into components automatically</li>
      </ul>
      ${callout('Modern shift (v14+)', 'NgModules used to be mandatory glue holding all of this together. As of Angular 14+, <b>standalone components</b> let a component declare its own dependencies directly — NgModules are now optional, and new apps (Angular 17+ default) skip them entirely.')}
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

// ============================================================
{
  id: 'ng-components-lifecycle',
  title: 'Components & Lifecycle Hooks',
  dek: 'The class + template pair that makes up every piece of UI, and the hooks that let you run code at the right moment.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A component is a TypeScript class decorated with <code>@Component</code>, pairing a template (HTML) with logic. Angular calls specific <b>lifecycle hooks</b> at defined points as a component is created, updated, and destroyed — implementing these lets you hook into exactly the right moment instead of guessing with timers.</p>
    </section>
    <section class="block">
      ${h2('Lifecycle Order Diagram')}
      ${diagram(`
        <svg viewBox="0 0 640 130" width="100%" style="max-width:640px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="10.5">
            ${['ngOnChanges','ngOnInit','ngDoCheck','ngAfterViewInit','ngOnDestroy'].map((n,i)=>{
              const x = 10 + i*128;
              const color = i===4 ? '#ff4b55' : '#ff4b55';
              return `<rect x="${x}" y="40" width="118" height="46" rx="6" fill="${color}14" stroke="${color}"/>
                <text x="${x+59}" y="68" text-anchor="middle" fill="#f1f5f9" font-size="10">${n}</text>
                ${i<4 ? `<line x1="${x+118}" y1="63" x2="${x+128}" y2="63" stroke="#7c8798" marker-end="url(#lc)"/>` : ''}`;
            }).join('')}
          </g>
          <defs><marker id="lc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'Simplified order — ngOnChanges/ngDoCheck can re-fire many times; ngOnInit and ngAfterViewInit fire once')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-user-card',
  standalone: true,
  template: \`<div #cardRef>{{ user.name }}</div>\`
})
export class UserCardComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() user!: User;
  @ViewChild('cardRef') cardRef!: ElementRef;
  private sub?: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    // fires on EVERY @Input change, including the first — before ngOnInit
    if (changes['user']) console.log('user input changed');
  }

  ngOnInit() {
    // fires ONCE, after first ngOnChanges — ideal for initial API calls
    this.sub = this.userService.activity$.subscribe(a => this.log(a));
  }

  ngAfterViewInit() {
    // fires ONCE, after the template + child views are fully rendered
    // safe to read this.cardRef.nativeElement dimensions here
  }

  ngOnDestroy() {
    // ALWAYS clean up subscriptions/timers here to prevent memory leaks
    this.sub?.unsubscribe();
  }
}`, 'user-card.component.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'ngOnInit', body:'The standard place to fetch initial data — Angular guarantees @Input values are set before it runs.' },
        { title:'ngOnDestroy', body:'Non-negotiable for unsubscribing from long-lived Observables and clearing intervals — the #1 cause of memory leaks in Angular apps.' },
        { title:'ngAfterViewInit', body:'Needed for third-party libraries (charts, maps) that require a real DOM node to mount into.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-data-binding',
  title: 'Data Binding',
  dek: 'Interpolation, property binding, event binding, and two-way binding — how template and class stay in sync.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Four binding directions, each with distinct syntax:</p>
      <ul>
        <li><b>Interpolation</b> <code>{{ value }}</code> — class → template, text content</li>
        <li><b>Property binding</b> <code>[prop]="value"</code> — class → template, DOM property or @Input</li>
        <li><b>Event binding</b> <code>(event)="handler()"</code> — template → class</li>
        <li><b>Two-way binding</b> <code>[(ngModel)]="value"</code> — both directions at once, sugar over <code>[value]</code> + <code>(valueChange)</code></li>
      </ul>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<!-- Interpolation -->
<h1>{{ product.name }}</h1>

<!-- Property binding: DOM property, not HTML attribute -->
<img [src]="product.imageUrl" [class.out-of-stock]="product.qty === 0">
<button [disabled]="isSubmitting">Save</button>

<!-- Event binding -->
<button (click)="addToCart(product)">Add to cart</button>
<input (keyup.enter)="search()">

<!-- Two-way binding: sugar for [value] + (valueChange) -->
<input [(ngModel)]="searchTerm">
<!-- equivalent to: -->
<input [value]="searchTerm" (input)="searchTerm = $event.target.value">

<!-- Custom two-way binding on a child component -->
<app-quantity-picker [(quantity)]="cartItem.qty" />`, 'binding.component.html')}

      ${codeBlock('typescript', `
// A component supporting [(quantity)] two-way binding needs BOTH:
@Input() quantity = 1;
@Output() quantityChange = new EventEmitter<number>();   // MUST be named "xChange"

increment() {
  this.quantity++;
  this.quantityChange.emit(this.quantity);
}`, 'quantity-picker.component.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Form inputs', body:'ngModel two-way binding is the fastest way to wire a simple input to component state for small forms.' },
        { title:'Conditional CSS classes', body:'<code>[class.active]="isActive"</code> is the standard way to toggle a single class based on state.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-directives',
  title: 'Directives (Structural & Attribute)',
  dek: 'The mechanism behind *ngIf, *ngFor, and how to build your own reusable DOM behavior.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Two kinds of directive:</p>
      <ul>
        <li><b>Structural</b> — add/remove elements from the DOM (<code>*ngIf</code>, <code>*ngFor</code>, or the newer <code>@if</code>/<code>@for</code> block syntax)</li>
        <li><b>Attribute</b> — change the appearance/behavior of an existing element without adding/removing it (<code>ngClass</code>, <code>ngStyle</code>, or a custom directive like a tooltip)</li>
      </ul>
    </section>
    <section class="block">
      ${h2('Example — Custom Attribute Directive')}
      ${codeBlock('typescript', `
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  private el = inject(ElementRef);

  @Input() appHighlight = 'yellow';

  @HostListener('mouseenter')
  onEnter() { this.el.nativeElement.style.backgroundColor = this.appHighlight; }

  @HostListener('mouseleave')
  onLeave() { this.el.nativeElement.style.backgroundColor = ''; }
}`, 'highlight.directive.ts')}
      ${codeBlock('html', `<p [appHighlight]="'lightblue'">Hover over me</p>`, 'usage.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Permission-based rendering', body:'A custom <code>*appHasRole="\'admin\'"</code> structural directive hides UI elements based on user permissions app-wide.' },
        { title:'Reusable DOM behavior', body:'Auto-focus, click-outside-to-close, drag handles — small, composable behaviors attached via attribute directives.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-services-di',
  title: 'Services & Dependency Injection',
  dek: 'Angular\'s hierarchical injector system — how a service instance gets created and shared.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A <b>service</b> is a plain class marked <code>@Injectable()</code> that holds logic/state you want to share. <b>Dependency Injection</b> means Angular constructs and provides these instances for you rather than components manually instantiating them — this makes testing trivial (swap in a mock) and centralizes shared state/logic.</p>
      <p>Angular's injector is <b>hierarchical</b>: <code>providedIn: 'root'</code> creates one singleton for the whole app; providing a service in a specific component's <code>providers</code> array creates a new instance scoped to that component and its children.</p>
    </section>
    <section class="block">
      ${h2('Injector Hierarchy Diagram')}
      ${diagram(`
        <svg viewBox="0 0 500 190" width="100%" style="max-width:500px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="11">
            <rect x="150" y="10" width="200" height="42" rx="6" fill="#4fa8ff14" stroke="#4fa8ff"/>
            <text x="250" y="36" text-anchor="middle" fill="#f1f5f9">Root Injector (singleton)</text>
            <line x1="250" y1="52" x2="150" y2="90" stroke="#7c8798" marker-end="url(#di)"/>
            <line x1="250" y1="52" x2="350" y2="90" stroke="#7c8798" marker-end="url(#di)"/>
            <rect x="50" y="90" width="200" height="42" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="150" y="116" text-anchor="middle" fill="#f1f5f9">FeatureComponent</text>
            <rect x="270" y="90" width="200" height="42" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="370" y="112" text-anchor="middle" fill="#f1f5f9">providers: [CartService]</text>
            <text x="370" y="126" text-anchor="middle" fill="#7c8798" font-size="9.5">new instance for this subtree</text>
          </g>
          <defs><marker id="di" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'A component-level provider shadows root — only that subtree gets the new instance')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Injectable({ providedIn: 'root' })   // one shared instance app-wide
export class AuthService {
  private currentUser = signal<User | null>(null);
  user = this.currentUser.asReadonly();

  login(credentials: Credentials) {
    return this.http.post<User>('/api/login', credentials)
      .pipe(tap(user => this.currentUser.set(user)));
  }
}

@Component({ selector: 'app-profile', standalone: true })
export class ProfileComponent {
  // modern inject() function — preferred over constructor injection since v14
  private auth = inject(AuthService);
  user = this.auth.user;
}`, 'auth.service.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Shared app state', body:'Auth state, cart contents, feature flags — anything multiple unrelated components need reads from a root-provided service.' },
        { title:'Testing', body:'DI lets tests provide a mock <code>AuthService</code> instead of a real HTTP-backed one — core to Angular\'s testability story.' },
        { title:'Scoped instances', body:'A wizard with multiple steps might provide a <code>WizardStateService</code> at the wizard component level so it resets automatically when the wizard unmounts.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-rxjs',
  title: 'RxJS in Angular',
  dek: 'Observables as the async primitive — operators, subscription management, and the async pipe.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>An <b>Observable</b> is a stream of values over time — unlike a Promise (single future value), an Observable can emit zero, one, or many values, and is lazy (nothing happens until you <code>.subscribe()</code>). Angular's <code>HttpClient</code>, reactive forms, and router all return Observables.</p>
      ${callout('Memory-leak rule', 'Every manual <code>.subscribe()</code> must eventually be unsubscribed, or the subscription (and everything it references) leaks. Prefer the <code>async</code> pipe in templates — Angular auto-subscribes and auto-unsubscribes — or the <code>takeUntilDestroyed()</code> operator in class code.')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  standalone: true,
  template: \`
    @if (user$ | async; as user) {
      <h1>{{ user.name }}</h1>
    }
  \`
})
export class ProfileComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  // async pipe subscribes/unsubscribes automatically — no manual cleanup
  user$ = this.route.paramMap.pipe(
    map(params => params.get('id')!),
    switchMap(id => this.userService.getUser(id)),   // cancels previous request if id changes
    catchError(() => of(null))
  );
}

// Manual subscription — needs explicit cleanup
export class SearchComponent {
  private destroyRef = inject(DestroyRef);
  results: Product[] = [];

  ngOnInit() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.api.search(term)),
      takeUntilDestroyed(this.destroyRef)     // auto-unsubscribes on component destroy
    ).subscribe(results => this.results = results);
  }
}`, 'rxjs-usage.ts')}
    </section>
    <section class="block">
      ${h2('Key Operators Cheat Sheet')}
      ${useCaseGrid([
        { title:'switchMap', body:'Cancels the previous inner request when a new value arrives — the standard choice for typeahead search and route-param-driven fetches.' },
        { title:'debounceTime + distinctUntilChanged', body:'Wait for typing to pause, skip duplicate consecutive values — the RxJS way to build search-as-you-type.' },
        { title:'combineLatest', body:'Combine several streams (e.g. filters + sort order) and re-emit whenever any one of them changes.' },
        { title:'catchError', body:'Handle a stream error without killing the whole subscription — returns a fallback observable.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-routing',
  title: 'Routing & Navigation',
  dek: 'Client-side navigation, route guards, resolvers, and lazy-loaded feature modules.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Angular's Router swaps components in and out of a <code>&lt;router-outlet&gt;</code> based on the URL, without a full page reload. Modern route config (v15+) uses functional guards/resolvers and standalone <code>loadComponent</code> for automatic code-splitting.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'products/:id',
    loadComponent: () => import('./product-detail.component')
      .then(m => m.ProductDetailComponent),      // lazy-loaded chunk
    resolve: { product: productResolver },        // pre-fetch data before navigating
  },
  {
    path: 'admin',
    canActivate: [authGuard],                      // functional guard
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  { path: '**', component: NotFoundComponent },     // wildcard fallback
];

// Functional guard (modern style — replaces class-based CanActivate)
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};

// Reading route params in a component
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  product = toSignal(
    this.route.data.pipe(map(data => data['product']))
  );
}`, 'routing.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Auth-protected routes', body:'Guards redirect unauthenticated users to login before a protected route\'s component even loads.' },
        { title:'Bundle size', body:'<code>loadChildren</code>/<code>loadComponent</code> lazy loading is the primary lever for keeping initial bundle size small in large apps.' },
        { title:'Data pre-fetching', body:'Resolvers avoid a loading-spinner flash inside a component by fetching data before the route activates.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-forms',
  title: 'Forms — Template-Driven & Reactive',
  dek: 'Two philosophies for handling user input: simple ngModel forms vs. explicit, testable FormGroup objects.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><b>Template-driven forms</b> use <code>ngModel</code> directly in the template — Angular builds the form model behind the scenes. Fast for simple forms, harder to unit test. <b>Reactive forms</b> define the form structure explicitly in the component class as a tree of <code>FormControl</code>/<code>FormGroup</code>/<code>FormArray</code> objects — more verbose, but fully synchronous, unit-testable, and better for complex validation logic.</p>
      ${callout('Rule of thumb', 'Use template-driven for a simple login/contact form. Use reactive forms for anything with dynamic fields, cross-field validation, or that needs thorough unit testing — most real production forms.')}
    </section>
    <section class="block">
      ${h2('Example — Reactive Form with Cross-Field Validation')}
      ${codeBlock('typescript', `
export class SignupComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: [''],
  }, { validators: passwordsMatchValidator });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();     // surface all validation errors
      return;
    }
    this.authService.signup(this.form.getRawValue());
  }
}

// Custom cross-field validator
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}`, 'signup.component.ts')}
      ${codeBlock('html', `
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" type="email">
  @if (form.get('email')?.invalid && form.get('email')?.touched) {
    <span class="error">Enter a valid email</span>
  }
  <input formControlName="password" type="password">
  <input formControlName="confirmPassword" type="password">
  @if (form.errors?.['mismatch']) {
    <span class="error">Passwords don't match</span>
  }
  <button [disabled]="form.invalid">Sign up</button>
</form>`, 'signup.component.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Multi-step wizards', body:'FormArray handles dynamically added/removed fields — e.g. "add another team member" rows.' },
        { title:'Checkout flows', body:'Cross-field validation (card expiry vs. today\'s date, password confirmation) is far cleaner with reactive forms\' group-level validators.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-change-detection',
  title: 'Change Detection',
  dek: 'How Angular knows when to re-check the DOM — Zone.js, OnPush, and the shift toward zoneless.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>By default, Angular uses <b>Zone.js</b> to monkey-patch async browser APIs (setTimeout, promises, DOM events, XHR) so it knows exactly when "something might have changed" — then it walks the <i>entire</i> component tree checking every binding, top to bottom. This is simple but can be wasteful in large trees.</p>
      <p><code>ChangeDetectionStrategy.OnPush</code> tells Angular to skip a component's subtree unless: (1) an <code>@Input</code> reference changes, (2) an event originates from inside it, or (3) it's manually marked dirty (or, with signals, a signal it reads changes) — a major performance lever in large apps.</p>
    </section>
    <section class="block">
      ${h2('Default vs OnPush Diagram')}
      ${diagram(`
        <svg viewBox="0 0 620 150" width="100%" style="max-width:620px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="10.5">
            <text x="10" y="20" fill="#7c8798">Default strategy: checks EVERY component, every CD cycle</text>
            ${[0,1,2,3,4].map(i=>`<rect x="${10+i*115}" y="30" width="100" height="34" rx="5" fill="#ff4b5514" stroke="#ff4b55"/>`).join('')}

            <text x="10" y="100" fill="#7c8798">OnPush: only checked if inputs/events/signals changed</text>
            <rect x="10" y="110" width="100" height="34" rx="5" fill="#3fd97714" stroke="#3fd977"/>
            <text x="60" y="132" text-anchor="middle" fill="#f1f5f9" font-size="9">checked ✓</text>
            <rect x="125" y="110" width="100" height="34" rx="5" fill="#0a0e14" stroke="#7c8798" stroke-dasharray="3,3"/>
            <text x="175" y="132" text-anchor="middle" fill="#7c8798" font-size="9">skipped</text>
            <rect x="240" y="110" width="100" height="34" rx="5" fill="#0a0e14" stroke="#7c8798" stroke-dasharray="3,3"/>
            <text x="290" y="132" text-anchor="middle" fill="#7c8798" font-size="9">skipped</text>
            <rect x="355" y="110" width="100" height="34" rx="5" fill="#3fd97714" stroke="#3fd977"/>
            <text x="405" y="132" text-anchor="middle" fill="#f1f5f9" font-size="9">checked ✓</text>
          </g>
        </svg>
      `, 'OnPush prunes large parts of the tree from every check — the biggest lever for CD performance')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-product-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: \`<span>{{ product().name }} — {{ product().price | currency }}</span>\`
})
export class ProductRowComponent {
  product = input.required<Product>();   // signal input — OnPush-friendly by design
}

// Mutating an object in place WON'T trigger OnPush re-check:
this.product.qty++;                      // ❌ same reference, OnPush misses it

// Must create a new reference:
this.product = { ...this.product, qty: this.product.qty + 1 };  // ✅`, 'onpush.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Large lists/tables', body:'OnPush on row components is standard practice to keep a 1000-row table from re-checking on every unrelated state change.' },
        { title:'Zoneless Angular (v18+)', body:'New apps can opt out of Zone.js entirely, relying purely on Signals to know what changed — smaller bundle, more predictable performance.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-standalone',
  title: 'Standalone Components (No More NgModules)',
  dek: 'The default since Angular 17 — components declare their own imports directly, removing an entire layer of boilerplate.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>For years, every component had to be declared in exactly one <code>NgModule</code>, and any directive/pipe it used had to be imported into that module. <b>Standalone components</b> (stable since v14, default since v17) remove this indirection: a component lists its own dependencies directly in an <code>imports</code> array on the <code>@Component</code> decorator.</p>
      ${callout('Why it matters', 'This simplifies mental model (no more "why isn\'t this pipe available" module-import debugging), makes lazy-loading individual components trivial, and is a prerequisite for Angular\'s newer, leaner build tooling.')}
    </section>
    <section class="block">
      ${h2('Example — Before vs After')}
      ${codeBlock('typescript', `
// ❌ Old: NgModule-based
@NgModule({
  declarations: [ProductCardComponent],
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [ProductCardComponent],
})
export class ProductCardModule {}

// ✅ New: standalone — self-contained, no module needed
@Component({
  selector: 'app-product-card',
  standalone: true,          // implicit default in Angular 17+, shown for clarity
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: \`
    <a [routerLink]="['/product', product().id]">
      {{ product().name }} — {{ product().price | currency }}
    </a>
  \`
})
export class ProductCardComponent {
  product = input.required<Product>();
}

// bootstrapping without any root module:
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
});`, 'standalone.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'New app scaffolding', body:'The Angular CLI generates standalone components/apps by default since v17 — this is now the mainstream way to build Angular.' },
        { title:'Incremental migration', body:'Existing NgModule apps can migrate component-by-component using the <code>ng generate @angular/core:standalone</code> schematic.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-signals',
  title: 'Signals — Fine-Grained Reactivity',
  dek: 'Angular\'s newest reactive primitive: synchronous, glitch-free state that the framework can track precisely.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A <b>Signal</b> is a wrapper around a value that notifies interested consumers when it changes. Unlike Observables, signals are <b>synchronous</b> (read the value immediately, no subscribe needed) and <b>self-tracking</b> — Angular automatically knows exactly which parts of a template depend on which signal, enabling far more precise, granular updates than tree-wide change detection.</p>
      <p>Three core primitives:</p>
      <ul>
        <li><code>signal(initialValue)</code> — a writable signal, updated via <code>.set()</code> or <code>.update()</code></li>
        <li><code>computed(() => ...)</code> — a derived, read-only signal that recalculates automatically when its dependencies change</li>
        <li><code>effect(() => ...)</code> — runs a side effect whenever any signal it reads changes</li>
      </ul>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  standalone: true,
  template: \`
    <p>{{ count() }} × \${{ price() }} = \${{ total() }}</p>
    <button (click)="increment()">+</button>
  \`
})
export class CartItemComponent {
  count = signal(1);
  price = signal(29.99);

  // computed: auto-recalculates ONLY when count or price actually change
  total = computed(() => this.count() * this.price());

  constructor() {
    // effect: runs whenever a read signal changes — good for logging, syncing to localStorage
    effect(() => {
      console.log(\`Total updated: \${this.total()}\`);
    });
  }

  increment() {
    this.count.update(c => c + 1);   // triggers only the parts of the DOM that read count()/total()
  }
}

// Signal inputs (v17.1+) — replaces @Input() for standalone components
export class ProductCardComponent {
  product = input.required<Product>();
  discount = input(0);               // default value
  finalPrice = computed(() => this.product().price * (1 - this.discount()));
}`, 'signals.ts')}
    </section>
    <section class="block">
      ${h2('Signals vs RxJS — When To Use Which')}
      ${useCaseGrid([
        { title:'Use Signals for', body:'Synchronous component/UI state — form values, toggles, derived display values. Simpler mental model, less boilerplate.' },
        { title:'Use RxJS for', body:'Async event streams — HTTP requests, WebSocket messages, complex operator chains (debounce, switchMap, retry logic).' },
        { title:'Bridge between them', body:'<code>toSignal()</code> converts an Observable to a signal for template use; <code>toObservable()</code> goes the other way — common at the boundary between HTTP calls and UI state.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-control-flow',
  title: 'New Control Flow: @if / @for / @switch',
  dek: 'Built-in template syntax (v17+) replacing *ngIf/*ngFor — faster, and with none of the CommonModule import overhead.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Angular 17 introduced block syntax built directly into the template compiler, replacing the old structural directives. Benefits: no <code>CommonModule</code> import needed, better type-narrowing in templates, built-in <code>@empty</code> blocks for lists, and measurably faster rendering since it doesn't go through the general-purpose directive mechanism.</p>
    </section>
    <section class="block">
      ${h2('Example — Old vs New')}
      ${codeBlock('html', `
<!-- ❌ Old structural directives -->
<div *ngIf="user; else loading">{{ user.name }}</div>
<ng-template #loading>Loading...</ng-template>

<ul>
  <li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
</ul>

<!-- ✅ New built-in control flow (Angular 17+) -->
@if (user(); as u) {
  <div>{{ u.name }}</div>
} @else {
  <p>Loading...</p>
}

@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items found.</li>
}

@switch (status()) {
  @case ('loading') { <spinner /> }
  @case ('error')   { <error-banner /> }
  @default          { <content /> }
}`, 'control-flow.html')}
      ${callout('Migration note', '<code>track</code> is required in <code>@for</code> (unlike optional trackBy before) — Angular forces you to opt into performant list diffing rather than defaulting to identity comparison.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Every new template', body:'This is now the default/recommended syntax for all new Angular code — the CLI and official docs use it exclusively.' },
        { title:'Large list performance', body:'Mandatory <code>track</code> keys prevent an entire class of "list re-renders everything" bugs common with unkeyed *ngFor.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-ssr-hydration',
  title: 'SSR, Hydration & Angular Universal',
  dek: 'Rendering Angular on the server for faster first paint and SEO, then seamlessly handing off to the client.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><b>Server-side rendering (SSR)</b> — via Angular Universal, first-class in the CLI since v17 — renders the initial HTML on the server so users (and crawlers) see real content immediately instead of a blank page waiting for JS. <b>Hydration</b> is the process of the client-side app "waking up" that server-rendered HTML — attaching event listeners and reconciling state — without destroying and re-creating the DOM (non-destructive hydration, stable since v17).</p>
    </section>
    <section class="block">
      ${h2('SSR Flow Diagram')}
      ${diagram(`
        <svg viewBox="0 0 640 160" width="100%" style="max-width:640px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="10.5">
            <rect x="10" y="15" width="140" height="46" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="80" y="43" text-anchor="middle" fill="#f1f5f9">Browser requests /</text>
            <line x1="150" y1="38" x2="200" y2="38" stroke="#7c8798" marker-end="url(#ssr)"/>
            <rect x="200" y="15" width="180" height="46" rx="6" fill="#4fa8ff14" stroke="#4fa8ff"/>
            <text x="290" y="35" text-anchor="middle" fill="#f1f5f9">Server renders</text>
            <text x="290" y="50" text-anchor="middle" fill="#f1f5f9">full HTML + data</text>
            <line x1="380" y1="38" x2="430" y2="38" stroke="#7c8798" marker-end="url(#ssr)"/>
            <rect x="430" y="15" width="200" height="46" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="530" y="35" text-anchor="middle" fill="#f1f5f9">Browser paints instantly</text>
            <text x="530" y="50" text-anchor="middle" fill="#f1f5f9">(visible before JS loads)</text>

            <line x1="530" y1="61" x2="530" y2="95" stroke="#7c8798" marker-end="url(#ssr)"/>
            <rect x="380" y="95" width="250" height="46" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
            <text x="505" y="115" text-anchor="middle" fill="#f1f5f9">Client JS hydrates —</text>
            <text x="505" y="130" text-anchor="middle" fill="#f1f5f9">reuses existing DOM, attaches events</text>
          </g>
          <defs><marker id="ssr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'Non-destructive hydration reuses the server-rendered DOM instead of re-creating it')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),   // enables non-destructive hydration
    provideRouter(routes),
  ]
};

// Deferrable views (v17+) — defer loading heavy components until needed,
// pairs naturally with SSR for fast initial paint
@Component({
  template: \`
    @defer (on viewport) {
      <heavy-chart [data]="chartData()" />
    } @placeholder {
      <div class="skeleton"></div>
    } @loading (minimum 200ms) {
      <spinner />
    }
  \`
})
export class DashboardComponent {}`, 'ssr-defer.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'SEO-critical marketing pages', body:'Product pages, blog content — crawlers need real HTML in the initial response, not a JS-rendered shell.' },
        { title:'Core Web Vitals', body:'SSR directly improves Largest Contentful Paint (LCP), a ranking + UX metric Google measures.' },
        { title:'@defer blocks', body:'Below-the-fold widgets (comments, related products) can be deferred to keep the critical path lean, independent of SSR.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-performance',
  title: 'Performance Optimization Patterns',
  dek: 'Bundle size, change detection, and rendering strategies that matter at real-world scale.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Performance in Angular apps comes from a handful of well-understood levers, roughly in order of impact:</p>
      <ol>
        <li><b>Lazy loading</b> routes/components — smaller initial bundle</li>
        <li><b>OnPush + Signals</b> — fewer, more targeted change-detection cycles</li>
        <li><b>trackBy / track</b> in lists — avoid destroying and recreating unchanged DOM nodes</li>
        <li><b>Virtual scrolling</b> for long lists — render only visible rows</li>
        <li><b>@defer</b> blocks — postpone loading non-critical components</li>
      </ol>
    </section>
    <section class="block">
      ${h2('Example — Virtual Scroll for a 10,000-row List')}
      ${codeBlock('html', `
<cdk-virtual-scroll-viewport itemSize="48" class="viewport">
  <div *cdkVirtualFor="let item of items; trackBy: trackById" class="row">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>
<!-- Only ~15-20 DOM nodes exist at once, regardless of list length —
     CDK recycles them as the user scrolls -->`, 'virtual-scroll.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Data tables / admin panels', body:'Virtual scrolling is essential for tables with thousands of rows — rendering all of them would freeze the browser.' },
        { title:'E-commerce product grids', body:'Lazy-loaded routes per category page keep the initial JS bundle focused on just the home/landing experience.' },
        { title:'Bundle auditing', body:'<code>ng build --stats-json</code> + webpack-bundle-analyzer is the standard workflow for finding what\'s bloating a production bundle.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-state-management',
  title: 'State Management (NgRx & Signal Stores)',
  dek: 'Centralized, predictable state for complex apps — the Redux pattern in Angular, and its lighter signal-based successors.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><b>NgRx</b> brings the Redux pattern to Angular: a single, immutable <b>store</b> holds app state; components dispatch <b>actions</b> describing "what happened"; pure <b>reducers</b> compute the new state from the old state + action; <b>effects</b> handle side effects (API calls) triggered by actions, dispatching new actions when they resolve. This unidirectional flow makes state changes traceable and testable, at the cost of boilerplate.</p>
      <p>Newer, lighter alternatives (<b>NgRx SignalStore</b>, or hand-rolled signal-based stores) achieve similar centralization with far less ceremony, leaning on Signals instead of the full action/reducer/effect pipeline — increasingly preferred for small-to-mid state needs.</p>
    </section>
    <section class="block">
      ${h2('Unidirectional Flow Diagram')}
      ${diagram(`
        <svg viewBox="0 0 640 160" width="100%" style="max-width:640px;display:block;margin:0 auto;">
          <g font-family="JetBrains Mono" font-size="10.5">
            <rect x="10" y="15" width="140" height="44" rx="6" fill="#ff4b5514" stroke="#ff4b55"/>
            <text x="80" y="42" text-anchor="middle" fill="#f1f5f9">Component dispatches Action</text>
            <line x1="150" y1="37" x2="200" y2="37" stroke="#7c8798" marker-end="url(#ngrx)"/>
            <rect x="200" y="15" width="140" height="44" rx="6" fill="#e3a53f14" stroke="#e3a53f"/>
            <text x="270" y="42" text-anchor="middle" fill="#f1f5f9">Reducer computes state</text>
            <line x1="340" y1="37" x2="390" y2="37" stroke="#7c8798" marker-end="url(#ngrx)"/>
            <rect x="390" y="15" width="140" height="44" rx="6" fill="#4fa8ff14" stroke="#4fa8ff"/>
            <text x="460" y="42" text-anchor="middle" fill="#f1f5f9">Store updates</text>
            <line x1="460" y1="59" x2="460" y2="90" stroke="#7c8798" marker-end="url(#ngrx)"/>
            <rect x="390" y="90" width="140" height="44" rx="6" fill="#3fd97714" stroke="#3fd977"/>
            <text x="460" y="117" text-anchor="middle" fill="#f1f5f9">Component re-renders</text>
            <line x1="270" y1="59" x2="270" y2="90" stroke="#7c8798" stroke-dasharray="3,3" marker-end="url(#ngrx)"/>
            <rect x="60" y="90" width="180" height="44" rx="6" fill="#ff4b5514" stroke="#ff4b55" stroke-dasharray="3,3"/>
            <text x="150" y="112" text-anchor="middle" fill="#f1f5f9">Effect: side effect</text>
            <text x="150" y="126" text-anchor="middle" fill="#7c8798" font-size="9">(API call) → new action</text>
          </g>
          <defs><marker id="ngrx" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#7c8798"/></marker></defs>
        </svg>
      `, 'State only ever changes through this one-way loop — never mutated directly by a component')}
    </section>
    <section class="block">
      ${h2('Example — NgRx SignalStore (modern, lighter API)')}
      ${codeBlock('typescript', `
export const CartStore = signalStore(
  { providedIn: 'root' },
  withState({ items: [] as CartItem[], loading: false }),
  withComputed(({ items }) => ({
    total: computed(() => items().reduce((sum, i) => sum + i.price * i.qty, 0)),
    itemCount: computed(() => items().length),
  })),
  withMethods((store, api = inject(CartApiService)) => ({
    addItem(item: CartItem) {
      patchState(store, { items: [...store.items(), item] });
    },
    async loadCart() {
      patchState(store, { loading: true });
      const items = await api.fetchCart();
      patchState(store, { items, loading: false });
    },
  }))
);

@Component({ standalone: true, template: \`<p>Total: {{ store.total() }}</p>\` })
export class CartSummaryComponent {
  store = inject(CartStore);
}`, 'cart.store.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Complex, cross-cutting state', body:'Shopping carts, multi-step wizards, real-time dashboards — state that many unrelated components read and write.' },
        { title:'Time-travel debugging', body:'NgRx DevTools lets you replay every dispatched action, invaluable for reproducing hard-to-catch bugs in QA/support.' },
        { title:'When NOT to reach for it', body:'Simple component-local state (a toggle, a form value) doesn\'t need a store — plain Signals are simpler and sufficient.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-testing',
  title: 'Testing Angular Apps',
  dek: 'Unit testing components/services with TestBed, and the modern shift toward simpler, DOM-focused tests.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Angular's <code>TestBed</code> creates an isolated testing module so components/services can be instantiated with mocked dependencies. Two broad testing styles: <b>shallow/unit tests</b> mock everything the component depends on and assert on its class logic directly; <b>DOM-focused tests</b> query the rendered template (via <code>fixture.nativeElement</code>) and assert on what a user would actually see — increasingly preferred since it tests behavior, not implementation detail.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
describe('CartSummaryComponent', () => {
  let fixture: ComponentFixture<CartSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],          // standalone components import directly
      providers: [
        { provide: CartApiService, useValue: { fetchCart: () => Promise.resolve([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    fixture.detectChanges();                     // triggers ngOnInit + initial render
  });

  it('renders the total from the store', () => {
    const store = TestBed.inject(CartStore);
    store.addItem({ id: 1, price: 10, qty: 2, name: 'Widget' });
    fixture.detectChanges();

    const totalEl = fixture.nativeElement.querySelector('.total');
    expect(totalEl.textContent).toContain('20');   // asserts on rendered DOM, not internal state
  });

  it('calls addItem when button clicked', () => {
    const store = TestBed.inject(CartStore);
    spyOn(store, 'addItem');

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(store.addItem).toHaveBeenCalled();
  });
});`, 'cart-summary.component.spec.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'CI/CD pipelines', body:'Test suites gate every pull request — a component that silently breaks is caught before merge, not in production.' },
        { title:'Refactoring safety net', body:'DOM-focused tests keep passing through internal refactors as long as user-facing behavior is unchanged — implementation-detail tests break unnecessarily.' },
        { title:'Mocking HTTP', body:'<code>HttpTestingController</code> intercepts real HttpClient calls in tests, letting you assert exact requests were made without hitting a real API.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-interceptors',
  title: 'HTTP Interceptors',
  dek: 'Middleware for every outgoing request/incoming response — auth headers, error handling, and loading state in one place.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>An interceptor sits between your code and the actual network call, able to inspect/modify every outgoing <code>HttpRequest</code> and incoming <code>HttpResponse</code> that passes through <code>HttpClient</code>. Multiple interceptors chain together, each calling <code>next(req)</code> to pass control along — this avoids repeating the same header-attaching or error-handling logic in every single service.</p>
    </section>
    <section class="block">
      ${h2('Example — Modern Functional Interceptors (v15+)')}
      ${codeBlock('typescript', `
// auth.interceptor.ts — attach a token to every outgoing request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
    : req;

  return next(authReq);
};

// error.interceptor.ts — centralized error handling + auto-retry on 401
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) router.navigate(['/login']);
      return throwError(() => err);
    })
  );
};

// app.config.ts — register in order (they run in the order listed)
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ]
};`, 'interceptors.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Auth token injection', body:'Every API call automatically gets the right Authorization header — services never need to know about tokens at all.' },
        { title:'Global loading spinner', body:'An interceptor can increment/decrement a shared "pending requests" counter to drive a single app-wide loading indicator.' },
        { title:'Centralized error toasts', body:'Show a consistent error notification for any failed request without repeating try/catch in every component.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-content-projection',
  title: 'Content Projection (ng-content)',
  dek: 'Letting a parent inject markup into a child component\'s template — Angular\'s answer to "slots" / React children.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>&lt;ng-content&gt;</code> marks a spot in a component's template where the parent's markup gets projected in, letting you build generic wrapper components (cards, modals, layouts) that don't know their content in advance. Named slots via the <code>select</code> attribute allow multiple distinct projection points.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-card',
  standalone: true,
  template: \`
    <div class="card">
      <header><ng-content select="[card-title]"></ng-content></header>
      <div class="card-body"><ng-content></ng-content></div>
      <footer><ng-content select="[card-actions]"></ng-content></footer>
    </div>
  \`
})
export class CardComponent {}`, 'card.component.ts')}
      ${codeBlock('html', `
<app-card>
  <h2 card-title>Order #1234</h2>

  <!-- unmarked content lands in the default (unnamed) slot -->
  <p>Shipped on Aug 12. Estimated delivery: Aug 16.</p>

  <div card-actions>
    <button>Track package</button>
  </div>
</app-card>`, 'usage.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Design system primitives', body:'Card, Modal, Accordion, Tabs — any generic layout/chrome component that wraps arbitrary caller-supplied content.' },
        { title:'Modal/dialog components', body:'A reusable modal shell projects a title, body, and footer-actions slot so every dialog in the app looks consistent.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-host-binding',
  title: '@HostBinding & @HostListener',
  dek: 'Controlling and reacting to the component/directive\'s own host element, without touching the DOM directly.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Every component/directive has a <b>host element</b> — the actual DOM tag it's applied to. <code>@HostBinding</code> binds a class property to a host element property/attribute/class (declarative, reactive to change detection). <code>@HostListener</code> subscribes to an event on the host element and runs a method when it fires — both avoid manually reaching into <code>ElementRef.nativeElement</code>, which is safer (works with SSR, no direct DOM manipulation) and more testable.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Directive({
  selector: '[appDraggable]',
  standalone: true,
})
export class DraggableDirective {
  @HostBinding('class.dragging') isDragging = false;
  @HostBinding('style.cursor') get cursor() {
    return this.isDragging ? 'grabbing' : 'grab';
  }

  @HostListener('mousedown')
  onMouseDown() { this.isDragging = true; }

  @HostListener('document:mouseup')
  onMouseUp() { this.isDragging = false; }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) { /* recalculate drag bounds */ }
}

// Modern equivalent using the "host" property on the decorator directly:
@Component({
  selector: 'app-tooltip-trigger',
  standalone: true,
  host: {
    '[class.active]': 'isActive()',
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
  }
})
export class TooltipTriggerComponent {
  isActive = signal(false);
  show() { this.isActive.set(true); }
  hide() { this.isActive.set(false); }
}`, 'host-binding.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Custom form controls', body:'Binding focus/invalid/disabled classes onto the host element to match native input styling conventions.' },
        { title:'Drag-and-drop, tooltips, click-outside', body:'Any directive that needs to react to events on its own host element and reflect state back onto it as classes/styles.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-i18n',
  title: 'Internationalization (i18n)',
  dek: 'Shipping the same app in multiple languages/locales — built-in i18n vs. runtime translation libraries.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Angular ships a built-in i18n system that extracts marked text at <b>build time</b> and produces a separate compiled bundle per locale — fast at runtime (no translation lookup overhead) but requires a rebuild/redeploy to change language. The alternative, widely used in practice, is a <b>runtime</b> library (e.g. ngx-translate or Transloco) that loads translation JSON files and swaps text live — slightly slower, but lets users switch language without a page reload or separate build.</p>
    </section>
    <section class="block">
      ${h2('Example — Built-in i18n')}
      ${codeBlock('html', `
<h1 i18n="@@welcomeHeading">Welcome back, {{ userName }}!</h1>

<p i18n="@@itemCount">
  {itemCount, plural,
    =0 {No items}
    =1 {One item}
    other {{{itemCount}} items}
  }
</p>`, 'app.component.html')}
      ${codeBlock('bash', `
# extract marked strings into a translation source file
ng extract-i18n --output-path src/locale

# build produces a separate, fully-compiled bundle per locale
ng build --localize`, 'terminal')}
      ${codeBlock('typescript', `
// Runtime alternative (Transloco/ngx-translate) — swap language without rebuilding
@Component({
  standalone: true,
  imports: [TranslocoModule],
  template: \`<h1>{{ 'welcome.heading' | transloco: { name: userName } }}</h1>\`
})
export class HomeComponent {
  translocoService = inject(TranslocoService);
  switchLanguage(lang: string) { this.translocoService.setActiveLang(lang); }
}`, 'runtime-i18n.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Global SaaS products', body:'Any product sold across regions needs this — built-in i18n suits apps with a known, fixed set of locales users don\'t switch between often.' },
        { title:'User-switchable language in-app', body:'A runtime library is the right fit when users pick their language from a live in-app dropdown rather than via URL/subdomain.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-pipes',
  title: 'Pipes — Pure vs Impure, and Custom Pipes',
  dek: 'Transforming data for display in templates, and the performance implications of getting purity wrong.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A pipe transforms a value for display: <code>{{ value | pipeName:arg }}</code>. By default pipes are <b>pure</b> — Angular only re-runs them when the input reference changes, which is cheap and usually correct. An <b>impure</b> pipe (<code>pure: false</code>) re-runs on <i>every</i> change detection cycle regardless of whether the input changed — necessary for pipes that need to react to internal mutation (like filtering an array that's mutated in place) but a common, serious performance trap if used carelessly on large lists.</p>
    </section>
    <section class="block">
      ${h2('Example — Custom Pure Pipe')}
      ${codeBlock('typescript', `
@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true,             // default — only re-runs when input reference changes
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return \`\${minutes}m ago\`;
    const hours = Math.floor(minutes / 60);
    return \`\${hours}h ago\`;
  }
}`, 'time-ago.pipe.ts')}
      ${codeBlock('html', `<span>{{ comment.createdAt | timeAgo }}</span>`, 'usage.html')}
      ${callout('The impure pipe trap', 'An impure pipe filtering a 500-row table re-runs on EVERY keystroke or unrelated state change anywhere in the app, not just when the underlying data actually changes — this is a top cause of "why is my app slow" bugs. Prefer computing filtered results in the component (or a computed signal) over an impure pipe wherever possible.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Consistent formatting', body:'Currency, date, and custom domain-specific pipes (like timeAgo above) keep formatting logic in one reusable place instead of duplicated in every component.' },
        { title:'Built-in pipes', body:'<code>| async</code>, <code>| json</code> (debugging), <code>| titlecase</code>, <code>| slice</code> cover the vast majority of everyday display-transform needs.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-animations',
  title: 'Angular Animations',
  dek: 'Declarative, state-driven animations wired directly into component logic.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Angular's animation system (built on the Web Animations API) lets you define animations as part of a component's metadata, triggered by binding a template expression to named animation <b>states</b> — Angular animates the transition between states automatically. This keeps animation logic co-located with the component instead of scattered across a stylesheet with manually toggled classes.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-toast',
  standalone: true,
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('*', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('void => *', animate('250ms ease-out')),
      transition('* => void', animate('200ms ease-in')),
    ]),
  ],
  template: \`
    <div [@slideIn] class="toast">{{ message() }}</div>
  \`
})
export class ToastComponent {
  message = input.required<string>();
  // 'void' state = not yet in the DOM / about to leave —
  // Angular automatically animates entry AND exit
}`, 'toast.component.ts')}
      ${callout('Modern alternative', 'For simple cases, native CSS transitions triggered by a class binding are often simpler and avoid pulling in the animations module at all — reach for Angular\'s animation API when you need enter/leave (void state) choreography that CSS alone can\'t express cleanly.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'List enter/leave animations', body:'Items animating in/out of a list (toast notifications, deleted rows) rely on the "void" state to animate elements as they\'re added/removed from the DOM.' },
        { title:'Route transitions', body:'Animating between routed pages (slide, fade) uses the same trigger/state/transition API tied to the router outlet.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-custom-validators',
  title: 'Custom Validators (Sync & Async)',
  dek: 'Writing reusable, composable validation logic beyond Angular\'s built-in Validators.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>A validator is just a function: <code>(control: AbstractControl) => ValidationErrors | null</code>. A <b>sync validator</b> runs immediately and returns synchronously. An <b>async validator</b> returns an Observable or Promise — used when validation requires a network call (e.g. "is this username already taken?") — and Angular automatically marks the control as <code>PENDING</code> while it resolves, debouncing re-runs appropriately when combined with RxJS operators.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
// Sync validator factory — configurable, reusable
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasWhitespace = /\\s/.test(control.value ?? '');
    return hasWhitespace ? { whitespace: true } : null;
  };
}

// Async validator — checks username availability against the server
export function uniqueUsernameValidator(api: UserApiService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return control.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(() => api.checkUsername(control.value)),
      map(isTaken => (isTaken ? { usernameTaken: true } : null)),
      first(),
    );
  };
}

// Usage
this.form = this.fb.group({
  username: ['', {
    validators: [Validators.required, noWhitespaceValidator()],
    asyncValidators: [uniqueUsernameValidator(this.userApi)],
    updateOn: 'blur',       // only run (especially async) validators when field loses focus
  }],
});`, 'custom-validators.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Signup/registration forms', body:'Username/email-uniqueness checks against the backend are the textbook async validator use case.' },
        { title:'Domain-specific rules', body:'Business rules like "end date must be after start date" or "discount can\'t exceed price" are expressed as custom (often cross-field, group-level) validators.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-di-tokens',
  title: 'InjectionToken, Multi-Providers & DI Configuration',
  dek: 'Injecting values that aren\'t classes, and providing multiple implementations for the same token.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>DI isn't limited to classes — an <code>InjectionToken</code> lets you inject configuration objects, primitives, or interfaces (which don't exist at runtime in TS, so can't be used as tokens directly). <code>multi: true</code> providers let multiple values register against the <i>same</i> token, all collected into an array when injected — this is exactly how Angular's own <code>HTTP_INTERCEPTORS</code> mechanism works internally.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
// Define a strongly-typed token for app-wide config
export interface AppConfig {
  apiUrl: string;
  featureFlags: Record<string, boolean>;
}
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

// Provide a value for it (often environment-specific)
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: { apiUrl: 'https://api.acme.com', featureFlags: {} } },
  ]
};

// Inject it anywhere, fully typed
export class ApiService {
  private config = inject(APP_CONFIG);
  private baseUrl = this.config.apiUrl;
}

// Multi-provider — multiple validators registered under ONE token
export const VALIDATION_RULES = new InjectionToken<ValidatorFn[]>('VALIDATION_RULES');

providers: [
  { provide: VALIDATION_RULES, useValue: requiredRule, multi: true },
  { provide: VALIDATION_RULES, useValue: noWhitespaceValidator(), multi: true },
]
// injecting VALIDATION_RULES anywhere returns an ARRAY of both rules combined`, 'di-tokens.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Environment configuration', body:'Injecting API base URLs, feature flags, or build-specific constants without hardcoding environment.ts imports everywhere.' },
        { title:'Plugin-style extensibility', body:'Multi-providers let different feature modules each contribute their own interceptor, guard, or validator without knowing about each other.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-template-outlet',
  title: 'ng-template, ngTemplateOutlet & Dynamic Components',
  dek: 'Rendering templates and components whose type isn\'t known until runtime.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p><code>&lt;ng-template&gt;</code> defines a chunk of markup that is <b>not rendered</b> until explicitly instantiated — this underlies <code>*ngIf</code>/<code>*ngFor</code>/<code>@if</code> internally, and can also be used directly with <code>ngTemplateOutlet</code> to render the same template in multiple places, or pass a template as an input to a child component. For truly dynamic scenarios (component type only known at runtime — e.g. a plugin/widget system), <code>ViewContainerRef.createComponent()</code> instantiates a component imperatively.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<!-- Define once, reuse via ngTemplateOutlet with different context -->
<ng-template #rowTemplate let-item="item" let-index="i">
  <tr><td>{{ index }}</td><td>{{ item.name }}</td></tr>
</ng-template>

@for (item of items(); track item.id; let i = $index) {
  <ng-container [ngTemplateOutlet]="rowTemplate"
                [ngTemplateOutletContext]="{ item: item, i: i }">
  </ng-container>
}`, 'template-outlet.html')}
      ${codeBlock('typescript', `
// Fully dynamic component instantiation — type decided at runtime
@Component({
  selector: 'app-widget-host',
  standalone: true,
  template: \`<ng-container #host></ng-container>\`
})
export class WidgetHostComponent {
  @ViewChild('host', { read: ViewContainerRef }) host!: ViewContainerRef;

  loadWidget(widgetType: Type<unknown>, inputs: Record<string, unknown>) {
    this.host.clear();
    const ref = this.host.createComponent(widgetType);
    Object.assign(ref.instance as object, inputs);   // set @Input()s programmatically
  }
}`, 'dynamic-component.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Generic table/list components', body:'A reusable table component accepts a row template as an @Input() so callers control cell rendering without the table needing to know column structure.' },
        { title:'Dashboard/widget systems', body:'A user-configurable dashboard renders different widget components based on saved layout data — the exact component type is only known at runtime.' },
        { title:'Modal service', body:'A programmatic modal service (open(SomeComponent, data)) uses createComponent to mount arbitrary content into an overlay.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-security-sanitization',
  title: 'Security: DomSanitizer & XSS Protection',
  dek: 'How Angular protects against injection attacks by default, and the escape hatches that can defeat that protection.',
  content: `
    <section class="block">
      ${h2('The Concept')}
      <p>Angular treats all values bound into templates as untrusted by default and automatically sanitizes them based on context (HTML, style, URL, resource URL) to strip anything that could execute as a script — this is why <code>{{ userInput }}</code> is safe from XSS out of the box. <code>DomSanitizer</code> exposes escape hatches (<code>bypassSecurityTrustHtml</code>, etc.) for the rare legitimate case where you need to render content Angular would otherwise strip — but every use is a deliberate opt-out of a safety net, and must only be used with content you fully control or have independently sanitized.</p>
      ${callout('Critical rule', 'Never call bypassSecurityTrust*() on raw user-supplied content. Doing so re-opens exactly the XSS vulnerability Angular\'s default sanitization exists to prevent.')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-article',
  standalone: true,
  template: \`<div [innerHTML]="safeContent"></div>\`
})
export class ArticleComponent {
  private sanitizer = inject(DomSanitizer);

  // Angular sanitizes [innerHTML] bindings by default —
  // <script> tags and on* event attributes are stripped automatically
  rawHtmlFromCms = '<p>Hello <script>alert("xss")</script></p>';

  // If you trust the SOURCE (e.g. content from your own CMS, already
  // sanitized server-side) and need to preserve markup Angular would strip:
  safeContent = this.sanitizer.bypassSecurityTrustHtml(this.rawHtmlFromCms);
  // ⚠️ only ever do this for content from a trusted, controlled source
}`, 'sanitization.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Rendering CMS/rich-text content', body:'Blog posts or CMS-authored HTML often need bypassSecurityTrustHtml — but only after the backend has already sanitized it (e.g. via a library like DOMPurify) as well.' },
        { title:'Embedding trusted iframes', body:'bypassSecurityTrustResourceUrl is needed for dynamically-set iframe src URLs (e.g. embedding a YouTube video by ID) since Angular blocks arbitrary resource URLs by default.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-inputs-outputs',
  title: 'Inputs & Outputs — The Component Contract',
  dek: 'How data flows into a component and events flow out — in plain terms: a component\'s "settings" and its "announcements."',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>Think of a component like a small appliance. <b>Inputs</b> are the knobs and settings someone else can adjust from outside (<code>&lt;app-button [label]="'Save'"&gt;</code>). <b>Outputs</b> are the lights and beeps it uses to tell the outside world something happened (<code>(click)="onSave()"</code>). The component itself never reaches out and changes its parent — it only exposes inputs to receive data and outputs to announce events, keeping data flow predictable in one direction.</p>
      <p>Angular 17.1+ introduced <b>signal-based inputs</b> (<code>input()</code>) as the modern replacement for the <code>@Input()</code> decorator — same idea, but the value is a signal, so reading it in a template or computed automatically keeps things in sync.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-rating',
  standalone: true,
  template: \`
    <div>
      @for (star of stars(); track $index) {
        <span (click)="select($index + 1)">{{ star ? '★' : '☆' }}</span>
      }
    </div>
  \`
})
export class RatingComponent {
  // Modern signal input — required, must be provided by the parent
  value = input.required<number>();

  // Signal input with a default and a transform (runs on every value set)
  max = input(5, { transform: (v: number) => Math.max(1, v) });

  // computed derived directly from the input signal
  stars = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i < this.value())
  );

  // Output — a component's way of "announcing" something happened
  ratingChange = output<number>();

  select(newValue: number) {
    this.ratingChange.emit(newValue);   // parent listens via (ratingChange)="..."
  }
}`, 'rating.component.ts')}
      ${codeBlock('html', `<app-rating [value]="product.rating" (ratingChange)="updateRating($event)" />`, 'usage.html')}
      ${callout('Old vs new, side by side', 'The decorator style (<code>@Input() value!: number; @Output() ratingChange = new EventEmitter&lt;number&gt;();</code>) still works and you\'ll see it in most existing codebases — the signal-based <code>input()</code>/<code>output()</code> functions are the newer, terser equivalent, recommended for new code.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Every reusable component', body:'Buttons, cards, form fields — any component meant to be dropped into multiple places is configured entirely through its inputs/outputs contract.' },
        { title:'Component library APIs', body:'Well-designed inputs/outputs ARE the public API of a component library — getting this contract right is what makes a component genuinely reusable.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-component-styles-encapsulation',
  title: 'Component Styles & View Encapsulation',
  dek: 'In plain terms: how Angular keeps one component\'s CSS from leaking out and messing with everything else on the page.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>Normally in plain CSS, a rule like <code>.title { color: red; }</code> applies to <i>every</i> <code>.title</code> anywhere on the page — styles have no natural boundaries. Angular's default <b>View Encapsulation</b> fixes this automatically: it adds a unique, invisible attribute (like <code>_ngcontent-xyz</code>) to every element a component renders, and rewrites that component's CSS selectors to only match elements carrying that same attribute. The practical effect: a component's <code>styles</code> only ever affect that component's own template, by default, with zero extra effort from you.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-card',
  standalone: true,
  template: \`<div class="title">Card Title</div>\`,
  styles: \`.title { color: blue; font-weight: 600; }\`,
  // encapsulation: ViewEncapsulation.Emulated,  // default — scoped via generated attributes
})
export class CardComponent {}

// Another component can ALSO have a ".title" class with completely
// different styling — no collision, because Angular scopes each one
@Component({
  selector: 'app-modal',
  template: \`<div class="title">Modal Title</div>\`,
  styles: \`.title { color: red; font-size: 24px; }\`,   // totally separate — doesn't leak
})
export class ModalComponent {}

// The three encapsulation modes:
// ViewEncapsulation.Emulated (default) — scoped via attribute selectors, as above
// ViewEncapsulation.None — NO scoping, styles become truly global (rarely desired)
// ViewEncapsulation.ShadowDom — uses REAL browser Shadow DOM for true isolation`, 'card.component.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Avoiding style collisions', body:'Large apps built by many teams never have to coordinate class-naming conventions across components to avoid accidental style overrides — encapsulation handles it.' },
        { title:'Global theming exceptions', body:'ViewEncapsulation.None is occasionally used deliberately for a "theme" component whose entire purpose is applying page-wide styles.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-custom-structural-directive',
  title: 'Building a Custom Structural Directive',
  dek: 'In plain terms: how *ngIf and @if actually add/remove elements from the page under the hood — and how to build your own.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>A structural directive works with two things: a <code>TemplateRef</code> (a reference to the chunk of HTML marked by the directive — think of it as "the blueprint, not yet built") and a <code>ViewContainerRef</code> (the actual spot in the page where content can be inserted or removed). Calling <code>viewContainer.createEmbeddedView(templateRef)</code> is literally "build the blueprint and place it here"; calling <code>viewContainer.clear()</code> is "remove it." <code>*ngIf</code> is built from exactly this pattern — nothing magic, just template + container.</p>
    </section>
    <section class="block">
      ${h2('Example — A Simple Permission-Based Directive')}
      ${codeBlock('typescript', `
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private auth = inject(AuthService);
  private hasView = false;

  @Input() set appHasRole(role: string) {
    const allowed = this.auth.currentUser()?.roles.includes(role);

    if (allowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef); // "build it and show it"
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.viewContainer.clear();                                // "remove it"
      this.hasView = false;
    }
  }
}`, 'has-role.directive.ts')}
      ${codeBlock('html', `
<button *appHasRole="'admin'">Delete User</button>
<!-- Angular desugars *appHasRole into an <ng-template> under the hood,
     exactly the same way it does for *ngIf -->`, 'usage.html')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Permission/feature-flag gating', body:'A reusable *appHasRole or *appFeatureFlag directive is a common way to hide UI across an entire app without repeating @if logic everywhere.' },
        { title:'Understanding the framework', body:'Knowing this is what demystifies *ngIf/*ngFor internals — useful for debugging tricky change-detection or rendering issues.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-httpclient',
  title: 'HttpClient — Making HTTP Requests',
  dek: 'In plain terms: Angular\'s built-in tool for talking to a backend API, and the handful of methods that cover 95% of real needs.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p><code>HttpClient</code> is Angular's wrapper around the browser's networking, tailored to fit neatly with the rest of the framework — it returns Observables (so it plugs directly into RxJS operators and the async pipe), automatically parses JSON responses, and integrates with interceptors for cross-cutting concerns like auth headers. In simple terms: instead of using the raw <code>fetch()</code> API, Angular apps use this because it's more testable and composes better with the rest of Angular's reactive patterns.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = '/api/products';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(\`\${this.baseUrl}/\${id}\`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: string, changes: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(\`\${this.baseUrl}/\${id}\`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.baseUrl}/\${id}\`);
  }

  // Query params + custom headers, expressed declaratively (no manual string building)
  search(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, {
      params: new HttpParams().set('q', term),
      headers: new HttpHeaders({ 'X-Client': 'web' }),
    });
  }
}

// Consuming it, converted to a signal for the template
export class ProductListComponent {
  private productService = inject(ProductService);
  products = toSignal(this.productService.getAll(), { initialValue: [] as Product[] });
}`, 'product.service.ts')}
      ${callout('Nothing fires until you subscribe', 'HttpClient methods are lazy Observables — calling <code>this.http.get(...)</code> does NOT send the request. It only happens once something subscribes (directly, via the async pipe, or via toSignal). Forgetting this is a common early confusion.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Literally every API-driven feature', body:'Every screen that loads or saves data goes through HttpClient — this is the single most-used Angular service in any real app.' },
        { title:'Testing', body:'HttpTestingController lets tests assert exactly which requests were made and mock their responses, without touching a real network.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-router-advanced',
  title: 'Router — Nested Routes, Params & Preloading',
  dek: 'In plain terms: building multi-level page hierarchies and controlling exactly when route code gets downloaded.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>Real apps aren't flat — a settings page might have its own sub-tabs, each with their own URL. <b>Child routes</b> nest a second <code>&lt;router-outlet&gt;</code> inside a parent component, so a parent "shell" stays mounted while its children swap. <b>Route parameters</b> (<code>:id</code> in the path) and <b>query parameters</b> (<code>?sort=price</code>) both flow into a component as Observables via <code>ActivatedRoute</code>, so a component reacts automatically if the URL changes without a full re-navigation. <b>Preloading strategies</b> control when lazy-loaded route code actually downloads — the default is "never until visited," but <code>PreloadAllModules</code> quietly downloads everything in the background after the initial page loads, trading a bit of extra bandwidth for instant subsequent navigations.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
export const routes: Routes = [
  {
    path: 'settings',
    component: SettingsShellComponent,          // stays mounted for all children
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileSettingsComponent },
      { path: 'billing', component: BillingSettingsComponent },
    ],
  },
];

// Reacting to param changes WITHOUT losing component state
// (e.g. navigating from /products/1 to /products/2 reuses the same component instance)
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);

  productId = toSignal(this.route.paramMap.pipe(map(p => p.get('id'))));
  sortOrder = toSignal(this.route.queryParamMap.pipe(map(p => p.get('sort') ?? 'default')));
}

// Preloading — background-download lazy chunks after initial load, not on-demand
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ]
};`, 'router-advanced.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Settings/admin panels', body:'A shell layout with a persistent sidebar and swapping content area is the classic nested-route use case.' },
        { title:'Filterable/sortable lists', body:'Query params are the standard way to make filter/sort state shareable via URL and survive a page refresh.' },
        { title:'Preloading for perceived speed', body:'PreloadAllModules is common in apps where most users eventually visit most routes — the initial bundle stays small, but navigation later feels instant.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-optimized-image',
  title: 'NgOptimizedImage',
  dek: 'In plain terms: a built-in directive that applies image performance best practices automatically, so you don\'t have to remember them.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>Unoptimized images are one of the most common causes of poor page-load performance (specifically hurting Largest Contentful Paint). <code>NgOptimizedImage</code> is a directive you apply to an <code>&lt;img&gt;</code> tag that automatically applies a checklist of image best practices — prioritizing the loading of the most important above-the-fold image, lazy-loading offscreen images, warning you in dev mode if width/height are missing (which causes layout shift), and integrating with image CDNs.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('html', `
<!-- Add the directive by swapping src for ngSrc -->
<img ngSrc="hero-banner.jpg" width="1200" height="600" priority>
<!-- priority: tells Angular this is the LCP image — loads it eagerly,
     with high fetch priority, instead of the default lazy behavior -->

<img ngSrc="product-thumbnail.jpg" width="300" height="300">
<!-- non-priority images are automatically lazy-loaded (loading="lazy") -->`, 'optimized-image.html')}
      ${codeBlock('typescript', `
@Component({
  standalone: true,
  imports: [NgOptimizedImage],   // import the directive to use ngSrc
  template: \`<img ngSrc="avatar.jpg" width="48" height="48">\`
})
export class AvatarComponent {}`, 'usage.ts')}
      ${callout('Why width/height matter', 'Providing width/height lets the browser reserve the correct space for the image before it loads, preventing content from jumping around as images pop in — a direct Core Web Vitals (CLS) improvement.')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Marketing/content-heavy pages', body:'Hero images, product galleries, blog post images — anywhere image loading directly affects perceived and measured page speed.' },
        { title:'Core Web Vitals compliance', body:'Teams tracking LCP/CLS scores (which affect SEO ranking) adopt this directive as a low-effort, high-impact fix across an entire app.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-cli-workspace',
  title: 'Angular CLI & Workspace Structure',
  dek: 'In plain terms: the command-line tool that scaffolds, builds, and serves your app, and what all those generated files actually do.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>The Angular CLI (<code>ng</code>) handles the parts of a project that used to require manual webpack/build configuration: scaffolding new components/services with consistent structure, running a dev server with hot reload, building an optimized production bundle, and running tests — all through simple commands. Understanding the generated file structure removes a lot of "where does this go" confusion for anyone new to the framework.</p>
    </section>
    <section class="block">
      ${h2('Common Commands')}
      ${codeBlock('bash', `
ng new my-app                          # scaffold a new project
ng serve                               # dev server with hot reload, http://localhost:4200
ng generate component product-card     # scaffold a new component (shorthand: ng g c)
ng generate service cart               # scaffold a new service     (shorthand: ng g s)
ng build                               # production build, output to dist/
ng test                                # run unit tests
ng add @angular/material               # install + auto-configure a compatible library`, 'cli-commands.sh')}
    </section>
    <section class="block">
      ${h2('Key Files, Explained Simply')}
      ${useCaseGrid([
        { title:'angular.json', body:'The project\'s build configuration — which files to bundle, build targets (dev/prod), asset paths. Rarely hand-edited directly.' },
        { title:'app.config.ts', body:'Where app-wide providers (router, HttpClient, hydration) are registered for a standalone app — the modern replacement for AppModule.' },
        { title:'main.ts', body:'The actual entry point — calls bootstrapApplication(AppComponent, appConfig) to start the app.' },
        { title:'environment.ts / environment.prod.ts', body:'Environment-specific config (API URLs, feature flags) swapped automatically based on build target.' },
      ])}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Every single Angular project', body:'The CLI is the standard, officially supported way to work with Angular — virtually no production app bypasses it for a hand-rolled build setup.' },
        { title:'Consistent team conventions', body:'ng generate ensures every developer on a team scaffolds components/services the same way, reducing structural inconsistency across a codebase.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-zoneless',
  title: 'Zoneless Angular',
  dek: 'In plain terms: running Angular without the "magic" background library that used to watch for changes automatically.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>By default, Angular relies on <b>Zone.js</b> — a library that patches browser APIs (timers, promises, DOM events) so Angular is automatically notified "something might have changed, go check the whole page." This works well but adds bundle size and can trigger more change-detection checks than strictly necessary. <b>Zoneless Angular</b> (stable as of Angular 18-20's rollout) removes Zone.js entirely — instead, Angular relies purely on <b>Signals</b> to know precisely what changed and where, since a signal read is explicitly trackable, unlike "some async thing happened somewhere."</p>
      ${callout('Why this matters for your code', 'Going zoneless means state that drives the UI MUST be signals (or manually trigger change detection) — a plain mutated object property with no signal wrapper won\'t be noticed. This pushes the whole app toward the modern signal-based style covered earlier.')}
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
// app.config.ts — opting into zoneless change detection
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),   // no Zone.js polyfill loaded at all
    provideRouter(routes),
  ]
};

// This component works identically whether zone-based or zoneless —
// because it's built entirely on signals, which Angular can track directly
@Component({
  standalone: true,
  template: \`<button (click)="increment()">{{ count() }}</button>\`
})
export class CounterComponent {
  count = signal(0);
  increment() { this.count.update(c => c + 1); }
}`, 'zoneless.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Performance-critical apps', body:'Removing Zone.js reduces bundle size and eliminates a class of "why did change detection run" performance mysteries entirely.' },
        { title:'New signal-first codebases', body:'Teams starting fresh with Angular 18+ increasingly build signal-first from day one, making the eventual move to zoneless a non-event rather than a migration.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-accessibility-cdk',
  title: 'Accessibility with the Angular CDK',
  dek: 'In plain terms: pre-built, battle-tested tools for the fiddly accessibility behaviors (focus trapping, live announcements) so you don\'t build them from scratch.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p>The Angular <b>CDK</b> (Component Dev Kit) is a set of low-level, unstyled behavior primitives that Angular Material itself is built on. For accessibility specifically, it ships utilities that are genuinely tricky to get right by hand: trapping keyboard focus inside an open modal so Tab doesn't escape to the page behind it, announcing dynamic content changes to screen readers, and managing focus properly when a component like an overlay opens/closes.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('typescript', `
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [A11yModule],   // provides cdkTrapFocus
  template: \`
    <div class="modal" cdkTrapFocus cdkTrapFocusAutoCapture role="dialog" aria-modal="true">
      <ng-content></ng-content>
      <button (click)="close.emit()">Close</button>
    </div>
  \`
})
export class ModalComponent {
  close = output<void>();
  // cdkTrapFocus: Tab/Shift+Tab cycle ONLY within this element while it's open —
  // keyboard focus can never silently "escape" behind the modal
}

// Announcing dynamic updates to screen reader users
export class SearchResultsComponent {
  private liveAnnouncer = inject(LiveAnnouncer);

  onResultsLoaded(count: number) {
    this.liveAnnouncer.announce(\`\${count} results found\`, 'polite');
    // screen reader speaks this without moving visual focus — same idea as aria-live
  }
}`, 'a11y-cdk.ts')}
    </section>
    <section class="block">
      ${h2('Where This Is Used In Real Projects')}
      ${useCaseGrid([
        { title:'Modals, dropdowns, overlays', body:'cdkTrapFocus is close to mandatory for any custom overlay component — building correct focus trapping by hand is easy to get subtly wrong.' },
        { title:'Legal/enterprise accessibility compliance', body:'WCAG-driven audits specifically check focus management and live-region announcements — CDK utilities cover these requirements directly.' },
      ])}
    </section>
  `
},

// ============================================================
{
  id: 'ng-material-cdk-overview',
  title: 'Angular Material & the CDK — Overview',
  dek: 'In plain terms: Google\'s official, ready-made component library for Angular, and the "headless" toolkit underneath it.',
  content: `
    <section class="block">
      ${h2('The Concept, In Plain Language')}
      <p><b>Angular Material</b> is a full, styled component library implementing Google's Material Design — buttons, tables, dialogs, form fields, date pickers — that installs and configures itself with <code>ng add @angular/material</code>. Underneath it sits the <b>CDK</b>, the unstyled "headless" behavior layer (drag-and-drop, virtual scrolling, overlays, focus trapping — some of which we've already covered) that you can use directly even if you don't want Material's visual design, to build a fully custom-styled component library on solid behavioral foundations.</p>
    </section>
    <section class="block">
      ${h2('Example')}
      ${codeBlock('bash', `ng add @angular/material   # installs, configures theme, adds Material to angular.json`, 'terminal')}
      ${codeBlock('typescript', `
@Component({
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatTableModule],
  template: \`
    <button mat-raised-button color="primary" (click)="openDialog()">
      Open Dialog
    </button>
    <table mat-table [dataSource]="products">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let p">{{ p.name }}</td>
      </ng-container>
      <!-- ...column definitions... -->
    </table>
  \`
})
export class CatalogComponent {
  private dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(ConfirmDialogComponent, { data: { message: 'Are you sure?' } });
  }
}`, 'catalog.component.ts')}
    </section>
    <section class="block">
      ${h2('Material vs Raw CDK — When To Use Which')}
      ${useCaseGrid([
        { title:'Use Angular Material when', body:'You want a complete, accessible, well-tested design system out of the box and Material Design\'s visual style fits (or can be themed to fit) your product.' },
        { title:'Use raw CDK when', body:'You need fully custom visual design but still want battle-tested behavior (overlays, drag-drop, virtual scroll, focus trapping) instead of building it from zero.' },
        { title:'Common in practice', body:'Many production apps use CDK primitives directly with a custom design system, skipping Material\'s styling entirely while keeping its accessibility guarantees.' },
      ])}
    </section>
  `
},

  ]
};
