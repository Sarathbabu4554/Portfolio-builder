import { TemplateDef } from './template';
export const EDITORIAL: TemplateDef = {
  id: 'editorial', name: 'Editorial', note: 'Big type, thin rules', thumbBg: '#fff', thumbFg: '#16161a',
  css: A => `body{background:#fff;color:#16161a}h1{font-weight:400;font-size:clamp(3rem,11vw,7.5rem);line-height:.92}.t{font-style:italic}
.hero{border-bottom:1px solid #16161a}section{display:grid;grid-template-columns:150px 1fr;gap:20px;border-bottom:1px solid #e5e5ea}h2{margin:0;font-size:.95rem;color:${A}}
.sk li{border:1px solid #16161a;border-radius:0}.card{border-top:2px solid ${A};padding-top:12px}.it{margin-bottom:20px}@media(max-width:640px){section{display:block}h2{margin-bottom:14px}}`
};
