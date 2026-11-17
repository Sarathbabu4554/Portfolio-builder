export interface Item { id: string; t: string; s: string; x: string; }
export type SectionKey = 'skills' | 'exp' | 'proj' | 'edu';
export type FontKey = 'serif' | 'sans' | 'mono';

export interface Portfolio {
  id: string; updatedAt: number;
  tpl: string; accent: string; font: FontKey;
  name: string; title: string; bio: string; email: string;
  links: string; photo: string; skills: string;
  exp: Item[]; edu: Item[]; proj: Item[];
  order: SectionKey[]; hidden: SectionKey[];
}

export const SECTION_LABELS: Record<SectionKey, string> = { skills: 'Skills', exp: 'Experience', proj: 'Projects', edu: 'Education' };
export const uid = () => crypto.randomUUID();
const item = (t: string, s = '', x = ''): Item => ({ id: uid(), t, s, x });

export function samplePortfolio(over: Partial<Portfolio> = {}): Portfolio {
  return {
    id: uid(), updatedAt: Date.now(), tpl: 'aurora', accent: '#7c6cff', font: 'sans',
    name: 'Alex Rivera', title: 'Frontend Developer',
    bio: 'I build fast, accessible web apps with Angular and TypeScript, and I like turning messy requirements into simple interfaces.',
    email: 'alex@example.com', links: 'GitHub | https://github.com\nLinkedIn | https://linkedin.com', photo: '',
    skills: 'Angular, TypeScript, JavaScript, SQL, RxJS, Tailwind CSS',
    exp: [item('Frontend Developer', 'Acme Corp · 2022 – Present', 'Built the customer dashboard used by 20,000 people every week.')],
    edu: [item('BSc Computer Science', 'State University · 2018 – 2022')],
    proj: [item('Task Board', 'https://github.com', 'A drag-and-drop kanban app built with Angular signals.'),
           item('Budget Tracker', 'https://github.com', 'Tracks spending offline with IndexedDB and charts.')],
    order: ['skills', 'exp', 'proj', 'edu'], hidden: [], ...over
  };
}

/** Accepts stored or imported data of any older shape and returns a complete Portfolio. */
export function normalize(raw: any): Portfolio {
  const base = samplePortfolio();
  const p = { ...base, ...raw } as Portfolio;
  for (const k of ['exp', 'edu', 'proj'] as const) {
    p[k] = (Array.isArray(raw?.[k]) ? raw[k] : base[k]).map((i: Partial<Item>) => ({ t: '', s: '', x: '', ...i, id: i.id || uid() }));
  }
  p.order = [...new Set([...(p.order || []), ...base.order])].filter(k => k in SECTION_LABELS) as SectionKey[];
  p.hidden = (p.hidden || []).filter(k => k in SECTION_LABELS);
  return p;
}
