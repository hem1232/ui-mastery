/* ============================================================
   APP — routing, rendering, search, sidebar interactions
   ============================================================ */

const TRACKS = [
  { key:'html', label:'HTML',       icon:'◆', color:'html', tagline:'Structure & Semantics' },
  { key:'css',  label:'CSS',        icon:'◆', color:'css',  tagline:'Layout & Design' },
  { key:'js',   label:'JavaScript', icon:'◆', color:'js',   tagline:'Behavior & Logic' },
  { key:'ng',   label:'Angular',    icon:'◆', color:'ng',   tagline:'Framework & Architecture' },
];

function getAllTopicsFlat(){
  const flat = [];
  TRACKS.forEach(t => {
    (window.CONTENT[t.key]?.topics || []).forEach((topic, i) => {
      flat.push({ ...topic, trackKey:t.key, trackLabel:t.label });
    });
  });
  return flat;
}

function findTopic(trackKey, topicId){
  const track = window.CONTENT[trackKey];
  if(!track) return null;
  return track.topics.find(t => t.id === topicId) || null;
}

function renderSidebar(){
  const nav = document.getElementById('navScroll');
  nav.innerHTML = TRACKS.map(t => {
    const topics = window.CONTENT[t.key]?.topics || [];
    return `
    <div class="track" data-track="${t.key}">
      <div class="track-head">
        <span class="track-dot"></span>${t.label}
        <span class="track-count">${topics.length}</span>
      </div>
      <ul class="topic-list">
        ${topics.map(topic => `
          <li>
            <a class="topic-link" data-track="${t.key}" data-id="${topic.id}" href="#/${t.key}/${topic.id}">
              ${esc(topic.title)}
            </a>
          </li>`).join('')}
      </ul>
    </div>`;
  }).join('');

  nav.querySelectorAll('.topic-link').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarOverlay').classList.remove('show');
    });
  });
}

function renderHome(){
  const content = document.getElementById('content');
  const totalTopics = getAllTopicsFlat().length;

  content.innerHTML = `
    <section class="hero">
      <div class="hero-eyebrow">UI Developer Reference · ${totalTopics}+ concepts</div>
      <h1>Master the <span class="glow">entire front-end stack</span><br>from first tag to last signal.</h1>
      <p class="lead">A deep, example-driven reference covering HTML, CSS, JavaScript and Angular — every core concept, modern feature, flow diagram and real-project use case a UI developer needs.</p>
      <div class="stack-diagram">${homeStackDiagram()}</div>
    </section>
    <div class="track-grid">
      ${TRACKS.map(t => `
        <div class="track-card" data-track="${t.key}" data-nav="${t.key}">
          <div class="icon" style="color:var(--${t.color})">${t.icon}</div>
          <h3>${t.label}</h3>
          <p>${t.tagline}</p>
          <div class="count">${(window.CONTENT[t.key]?.topics||[]).length} topics →</div>
        </div>`).join('')}
    </div>
  `;

  content.querySelectorAll('.track-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.nav;
      const first = window.CONTENT[key]?.topics?.[0];
      if(first) location.hash = `#/${key}/${first.id}`;
    });
  });
}

function homeStackDiagram(){
  const layers = [
    { label:'ANGULAR', sub:'Components · DI · Signals · Routing', color:'var(--ng)'},
    { label:'JAVASCRIPT', sub:'Logic · Async · DOM · Events', color:'var(--js)'},
    { label:'CSS', sub:'Layout · Design · Motion', color:'var(--css)'},
    { label:'HTML', sub:'Structure · Semantics · Accessibility', color:'var(--html)'},
  ];
  const w = 720, rowH = 62, gap = 10;
  let svg = `<svg viewBox="0 0 ${w} ${layers.length*(rowH+gap)}" width="100%" style="max-width:720px;display:block;margin:0 auto;">`;
  layers.forEach((l, i) => {
    const y = i*(rowH+gap);
    const inset = i * 22;
    svg += `
      <rect x="${inset}" y="${y}" width="${w-inset*2}" height="${rowH}" rx="8"
        fill="none" stroke="${l.color}" stroke-width="1.5" opacity="0.9"/>
      <rect x="${inset}" y="${y}" width="${w-inset*2}" height="${rowH}" rx="8" fill="${l.color}" opacity="0.06"/>
      <text x="${w/2}" y="${y+26}" text-anchor="middle" fill="${l.color}" font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">${l.label}</text>
      <text x="${w/2}" y="${y+44}" text-anchor="middle" fill="#7c8798" font-family="Inter, sans-serif" font-size="11">${l.sub}</text>
    `;
  });
  svg += `</svg>`;
  return svg;
}

function renderTopicNotFound(){
  document.getElementById('content').innerHTML = `
    <div class="topic-page">
      <h1 style="font-family:var(--mono);color:var(--text-bright)">404 — Topic not found</h1>
      <p style="color:var(--text-dim)">Pick a topic from the sidebar to get started.</p>
    </div>`;
}

function renderTopic(trackKey, topicId){
  const track = window.CONTENT[trackKey];
  const topic = findTopic(trackKey, topicId);
  if(!track || !topic) return renderTopicNotFound();

  const trackMeta = TRACKS.find(t => t.key === trackKey);
  const topics = track.topics;
  const idx = topics.findIndex(t => t.id === topicId);
  const prev = idx > 0 ? topics[idx-1] : null;
  const next = idx < topics.length-1 ? topics[idx+1] : null;

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="topic-page" style="--track-color:var(--${trackMeta.color})">
      <div class="topic-header">
        <div class="topic-kicker" style="color:var(--${trackMeta.color})">${trackMeta.label} · ${idx+1} / ${topics.length}</div>
        <h1>${esc(topic.title)}</h1>
        <p class="topic-dek">${topic.dek || ''}</p>
      </div>
      ${topic.content}
      <div class="topic-footer">
        ${prev ? `<div class="nav-btn prev" data-nav="#/${trackKey}/${prev.id}">
            <div class="dir">← Previous</div><div class="title">${esc(prev.title)}</div>
          </div>` : `<div></div>`}
        ${next ? `<div class="nav-btn next" data-nav="#/${trackKey}/${next.id}">
            <div class="dir">Next →</div><div class="title">${esc(next.title)}</div>
          </div>` : `<div></div>`}
      </div>
    </div>
  `;

  content.querySelectorAll('.nav-btn[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => { location.hash = btn.dataset.nav; });
  });

  content.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = document.getElementById(btn.dataset.copyTarget);
      const raw = decodeURIComponent(code.dataset.raw);
      navigator.clipboard.writeText(raw).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied ✓';
        setTimeout(() => btn.textContent = original, 1400);
      });
    });
  });

  document.getElementById('breadcrumb').innerHTML =
    `${trackMeta.label} <span style="opacity:.4">/</span> <b>${esc(topic.title)}</b>`;

  document.querySelectorAll('.topic-link').forEach(a => {
    a.classList.toggle('active', a.dataset.track === trackKey && a.dataset.id === topicId);
  });

  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
}

function router(){
  const hash = location.hash.replace(/^#\/?/, '');
  document.getElementById('breadcrumb').textContent = 'Home';
  if(!hash){
    renderHome();
    document.querySelectorAll('.topic-link').forEach(a => a.classList.remove('active'));
    return;
  }
  const [trackKey, topicId] = hash.split('/');
  if(TRACKS.some(t => t.key === trackKey) && topicId){
    renderTopic(trackKey, topicId);
  } else {
    renderTopicNotFound();
  }
}

function initSearch(){
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('.topic-link').forEach(a => {
      const match = !q || a.textContent.toLowerCase().includes(q);
      a.hidden = !match;
    });
    document.querySelectorAll('.track').forEach(trackEl => {
      const anyVisible = [...trackEl.querySelectorAll('.topic-link')].some(a => !a.hidden);
      trackEl.style.display = anyVisible ? '' : 'none';
    });
  });
}

function initSidebarToggle(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  document.getElementById('menuBtn').addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  initSearch();
  initSidebarToggle();
  router();
});
window.addEventListener('hashchange', router);
