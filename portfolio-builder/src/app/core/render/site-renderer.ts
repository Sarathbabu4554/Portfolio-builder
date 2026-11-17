import { Item, Portfolio, SECTION_LABELS, SectionKey } from '../models/portfolio.model';
import { getTemplate } from '../templates';

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const safe = (u: string) => (/^(https?:\/\/|mailto:)/i.test((u || '').trim()) ? u.trim() : '');
const md = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
const FONTS = { serif: "'Fraunces',Georgia,serif", sans: "'Inter',system-ui,sans-serif", mono: "'JetBrains Mono',ui-monospace,monospace" };
const GF = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap';

const BASE = (A: string, font: string) => `*{box-sizing:border-box}body{--a:${A};margin:0;font:17px/1.65 ${font};-webkit-font-smoothing:antialiased}a{color:var(--a)}
.w{max-width:880px;margin:0 auto;padding:0 28px}.hero{padding:88px 0 56px}h1{margin:0;line-height:1.02;letter-spacing:-.03em;font-size:clamp(2.6rem,8vw,4.8rem)}
.t{font-size:1.25rem;margin:10px 0 0;opacity:.75}.bio{max-width:58ch;margin:22px 0 0}.lk{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:24px;font-weight:600}
h2{font-size:1rem;margin:0 0 20px}section{padding:34px 0}.sk{display:flex;flex-wrap:wrap;gap:10px;margin:0;padding:0;list-style:none}.sk li{padding:5px 14px;border-radius:999px;font-size:.9rem;font-weight:600}
.it b{display:block}.it small{opacity:.65;display:block}.it p{margin:6px 0 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px}
.ph{width:116px;height:116px;object-fit:cover}.hw{display:flex;align-items:center;justify-content:space-between;gap:32px}.ht{flex:1;min-width:0}@media(max-width:640px){.hw{flex-direction:column-reverse;align-items:flex-start}}footer{padding:40px 0 56px;opacity:.5;font-size:.85rem}`;

const it = (i: Item, proj = false) => {
  const u = proj ? safe(i.s) : '';
  const sub = i.s ? `<small>${u ? `<a href="${esc(u)}">${esc(i.s)}</a>` : esc(i.s)}</small>` : '';
  return `<div class="it"><b>${esc(i.t)}</b>${sub}${i.x ? `<p>${esc(i.x)}</p>` : ''}</div>`;
};
const tl = (a: Item[]) => `<div class="tl">${a.map(i => it(i)).join('')}</div>`;
const sec = (k: SectionKey, body: string) => `<section><h2>${SECTION_LABELS[k]}</h2><div>${body}</div></section>`;

/** One renderer per section: add a section = add a key to SectionKey + an entry here. */
const SECTIONS: Record<SectionKey, (p: Portfolio) => string> = {
  skills: p => { const s = p.skills.split(',').map(x => x.trim()).filter(Boolean); return s.length ? sec('skills', `<ul class="sk">${s.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`) : ''; },
  exp: p => (p.exp.length ? sec('exp', tl(p.exp)) : ''),
  proj: p => (p.proj.length ? sec('proj', `<div class="grid">${p.proj.map(i => `<div class="card">${it(i, true)}</div>`).join('')}</div>`) : ''),
  edu: p => (p.edu.length ? sec('edu', tl(p.edu)) : '')
};

export function renderSite(p: Portfolio): string {
  const A = /^#[0-9a-f]{6}$/i.test(p.accent) ? p.accent : '#7c6cff';
  const links = p.links.split('\n').map(l => { const [a, b] = l.split('|'); const u = safe(b || ''); return u && a.trim() ? `<a href="${esc(u)}">${esc(a.trim())}</a>` : ''; }).join('');
  const mail = p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : '';
  const photo = p.photo ? `<img class="ph" src="${esc(p.photo)}" alt="">` : '';
  const hero = `<header class="hero"><div class="w hw"><div class="ht"><h1>${esc(p.name)}</h1><p class="t">${esc(p.title)}</p>${p.bio ? `<p class="bio">${md(p.bio)}</p>` : ''}<div class="lk">${mail}${links}</div></div>${photo}</div></header>`;
  const body = p.order.filter(k => !p.hidden.includes(k)).map(k => SECTIONS[k](p)).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.name)} – ${esc(p.title)}</title><link rel="stylesheet" href="${GF}"><style>${BASE(A, FONTS[p.font])}${getTemplate(p.tpl).css(A)}</style></head><body>${hero}<main class="w">${body}</main><footer class="w">© ${new Date().getFullYear()} ${esc(p.name)}</footer></body></html>`;
}
