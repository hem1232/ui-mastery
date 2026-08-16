/* ============================================================
   Content authoring helpers — used inside data/*.js files to
   build consistent markup (code blocks, callouts, diagrams...)
   ============================================================ */

function esc(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

/** very small, dependency-free syntax highlighter (token-based, best-effort) */
function highlight(code, lang){
  let c = esc(code);
  const kw = {
    js:  /\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|extends|new|this|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|of|in|null|undefined|true|false|static|get|set|yield|super)\b/g,
    ts:  /\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|extends|implements|interface|type|new|this|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|of|in|null|undefined|true|false|static|get|set|readonly|private|public|protected|as|enum|namespace|yield|super)\b/g,
    css: /\b(important|inherit|initial|unset|auto|none|from|to)\b/g,
  };
  const langKey = (lang === 'typescript' || lang === 'ts' || lang === 'html-ng') ? 'ts' : (lang === 'css' || lang === 'scss') ? 'css' : 'js';

  if(lang === 'html' || lang === 'markup'){
    c = c.replace(/(&lt;\/?)([a-zA-Z0-9\-]+)/g, '$1<span class="tok-tag">$2</span>');
    c = c.replace(/([a-zA-Z\-]+)(=)(&quot;|")/g, '<span class="tok-attr">$1</span>$2$3');
    c = c.replace(/(&quot;[^&]*?&quot;|"[^"]*")/g, '<span class="tok-str">$1</span>');
    c = c.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-com">$1</span>');
    return c;
  }

  // comments first (protect from further replace by using placeholders)
  const comments = [];
  c = c.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (m)=>{ comments.push(m); return `\u0001${comments.length-1}\u0001`; });

  const strings = [];
  c = c.replace(/(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, (m)=>{ strings.push(m); return `\u0002${strings.length-1}\u0002`; });

  c = c.replace(kw[langKey], '<span class="tok-kw">$1</span>');
  c = c.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');
  c = c.replace(/([a-zA-Z_$][\w$]*)(?=\()/g, '<span class="tok-fn">$1</span>');

  c = c.replace(/\u0002(\d+)\u0002/g, (_,i)=> `<span class="tok-str">${strings[i]}</span>`);
  c = c.replace(/\u0001(\d+)\u0001/g, (_,i)=> `<span class="tok-com">${comments[i]}</span>`);

  return c;
}

let __codeBlockId = 0;
function codeBlock(lang, code, label){
  __codeBlockId++;
  const id = `code-${__codeBlockId}`;
  const raw = code.trim();
  return `
  <div class="code-block">
    <div class="code-head">
      <span class="code-dots"><span></span><span></span><span></span> ${esc(label || lang)}</span>
      <button class="copy-btn" data-copy-target="${id}">Copy</button>
    </div>
    <pre><code id="${id}" data-raw="${encodeURIComponent(raw)}">${highlight(raw, lang)}</code></pre>
  </div>`;
}

function callout(tag, html){
  return `<div class="callout"><span class="callout-tag">${esc(tag)}</span>${html}</div>`;
}

function useCaseGrid(items){
  return `<div class="usecase-grid">${items.map(it => `
    <div class="usecase">
      <div class="uc-title">${esc(it.title)}</div>
      <div class="uc-body">${it.body}</div>
    </div>`).join('')}</div>`;
}

function diagram(svg, caption){
  return `<div class="diagram">${svg}${caption ? `<div class="diagram-cap">${esc(caption)}</div>` : ''}</div>`;
}

function h2(text){
  return `<h2>${esc(text)}</h2>`;
}
