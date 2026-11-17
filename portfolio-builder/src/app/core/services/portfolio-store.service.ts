import { Injectable, computed, effect, signal } from '@angular/core';
import { Portfolio, normalize, samplePortfolio, uid } from '../models/portfolio.model';

const KEY = 'folioSK-v3';
function load(): Portfolio[] {
  try { const r = JSON.parse(localStorage.getItem(KEY) || 'null'); if (Array.isArray(r) && r.length) return r.map(normalize); } catch {}
  return [samplePortfolio()];
}

/** Single source of truth: all portfolios, the open one, persistence and undo/redo. */
@Injectable({ providedIn: 'root' })
export class PortfolioStore {
  readonly all = signal<Portfolio[]>(load());
  readonly activeId = signal<string | null>(null);
  readonly active = computed(() => this.all().find(p => p.id === this.activeId()) ?? null);
  readonly canUndo = signal(false);
  readonly canRedo = signal(false);
  private past: Portfolio[] = []; private future: Portfolio[] = []; private last = 0;

  constructor() { effect(() => { try { localStorage.setItem(KEY, JSON.stringify(this.all())); } catch {} }); }

  open(id: string) { this.activeId.set(id); this.past = []; this.future = []; this.flags(); }

  patch(change: Partial<Portfolio>) {
    const cur = this.active(); if (!cur) return;
    const now = Date.now();
    if (now - this.last > 800) { this.past.push(cur); if (this.past.length > 50) this.past.shift(); } // typing bursts = one undo step
    this.last = now; this.future = [];
    this.replace({ ...cur, ...change, updatedAt: now }); this.flags();
  }
  undo() { const p = this.past.pop(), c = this.active(); if (!p || !c) return; this.future.push(c); this.replace(p); this.last = 0; this.flags(); }
  redo() { const n = this.future.pop(), c = this.active(); if (!n || !c) return; this.past.push(c); this.replace(n); this.last = 0; this.flags(); }

  create(): string { const p = samplePortfolio(); this.all.update(a => [p, ...a]); return p.id; }
  duplicate(id: string) {
    const src = this.all().find(p => p.id === id); if (!src) return;
    this.all.update(a => [{ ...src, id: uid(), name: src.name + ' (copy)', updatedAt: Date.now() }, ...a]);
  }
  remove(id: string) { this.all.update(a => { const r = a.filter(p => p.id !== id); return r.length ? r : [samplePortfolio()]; }); }
  import(text: string): string {
    const p = { ...normalize(JSON.parse(text)), id: uid(), updatedAt: Date.now() };
    this.all.update(a => [p, ...a]); return p.id;
  }

  private replace(p: Portfolio) { this.all.update(a => a.map(x => (x.id === p.id ? p : x))); }
  private flags() { this.canUndo.set(this.past.length > 0); this.canRedo.set(this.future.length > 0); }
}
