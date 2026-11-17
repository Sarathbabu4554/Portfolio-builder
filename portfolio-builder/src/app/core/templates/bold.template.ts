import { TemplateDef } from './template';
export const BOLD: TemplateDef = {
  id: 'bold', name: 'Bold', note: 'Colour block, hard shadows', thumbBg: '#ff7a59', thumbFg: '#111',
  css: A => `body{background:#fff;color:#111}.hero{background:${A};color:#fff;padding:80px 0 64px;margin-bottom:24px}.hero a{color:#fff}h1{font-weight:800}
.ph{border-radius:20px;border:3px solid #111;box-shadow:5px 5px 0 #111}h2{display:inline-block;background:#111;color:#fff;padding:3px 12px;border-radius:6px}
.sk li{background:#fff;border:2px solid #111;box-shadow:3px 3px 0 #111}.card{border:2px solid #111;border-radius:16px;padding:20px;box-shadow:6px 6px 0 #111}
.tl .it{border:2px solid #111;border-radius:14px;padding:14px 18px;margin-bottom:14px}`
};
