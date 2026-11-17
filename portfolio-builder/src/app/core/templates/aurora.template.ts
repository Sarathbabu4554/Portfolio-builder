import { TemplateDef } from './template';
export const AURORA: TemplateDef = {
  id: 'aurora', name: 'Aurora', note: 'Dark with a soft glow', thumbBg: 'radial-gradient(circle at 80% 0,#7c6cff,#070914 70%)', thumbFg: '#fff',
  css: A => `body{background:#070914;color:#e9ebf8}.hero{background:radial-gradient(70% 90% at 85% 0,${A}55,transparent 70%)}h1{font-weight:800}
.ph{width:230px;height:270px;border-radius:26px;box-shadow:0 20px 60px ${A}44}.t{color:${A};opacity:1;font-weight:600}h2{color:${A}}.sk li{background:${A}22;border:1px solid ${A}55}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:22px}
.tl .it{border-left:2px solid ${A}66;padding:0 0 22px 22px;position:relative}.tl .it:before{content:"";position:absolute;left:-6px;top:7px;width:10px;height:10px;border-radius:50%;background:${A}}`
};
