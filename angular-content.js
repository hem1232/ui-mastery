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

  ]
};
