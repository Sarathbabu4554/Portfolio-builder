import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Portfolio } from '../../core/models/portfolio.model';
import { PortfolioStore } from '../../core/services/portfolio-store.service';
import { getTemplate } from '../../core/templates';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  template: `
<header class="top">
  <span class="brand"><span class="logo"></span>Folio<b>SK</b></span><span class="grow"></span>
  <button class="btn" (click)="file.click()">Import backup</button>
  <input #file type="file" accept=".json" hidden (change)="import($event)">
  <button class="btn primary" (click)="create()">New portfolio</button>
</header>
<main>
  <h1>Your portfolios</h1>
  <p class="mute">Saved in this browser. Make one version for each audience.</p>
  <div class="grid">
    @for (p of store.all(); track p.id) {
      <article class="card">
        <div class="thumb" [style.background]="tpl(p).thumbBg" [style.color]="tpl(p).thumbFg"><i [style.background]="p.accent"></i>{{ p.name }}</div>
        <h2>{{ p.name }}</h2>
        <p class="mute">{{ p.title }} · {{ tpl(p).name }}</p>
        <small class="mute">Edited {{ p.updatedAt | date: 'mediumDate' }}</small>
        <div class="acts">
          <a class="btn primary" [routerLink]="['/edit', p.id]">Open</a>
          <button class="btn" (click)="store.duplicate(p.id)">Duplicate</button>
          <button class="btn" (click)="remove(p)">Delete</button>
        </div>
      </article>
    }
  </div>
</main>`,
  styles: [`
    main{max-width:1000px;margin:0 auto;padding:36px 24px}h1{font:800 30px 'Bricolage Grotesque',sans-serif;margin:0 0 4px;letter-spacing:-.02em}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:18px;margin-top:24px}
    .card{padding:14px;background:var(--panel2);border-radius:18px}.card h2{font-size:17px;margin:14px 0 2px}.card p{margin:0}
    .thumb{height:110px;border-radius:12px;display:flex;align-items:flex-end;padding:12px;font:700 18px 'Bricolage Grotesque',sans-serif;position:relative}
    .thumb i{position:absolute;top:12px;right:12px;width:14px;height:14px;border-radius:50%}
    .acts{display:flex;gap:8px;margin-top:14px}.acts .btn{padding:6px 12px}`]
})
export class DashboardComponent {
  store = inject(PortfolioStore);
  private router = inject(Router);
  tpl = (p: Portfolio) => getTemplate(p.tpl);
  create() { this.router.navigate(['/edit', this.store.create()]); }
  remove(p: Portfolio) { if (confirm(`Delete "${p.name}"? This cannot be undone.`)) this.store.remove(p.id); }
  async import(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    try { this.router.navigate(['/edit', this.store.import(await f.text())]); }
    catch { alert('That file is not a valid backup.'); }
  }
}
