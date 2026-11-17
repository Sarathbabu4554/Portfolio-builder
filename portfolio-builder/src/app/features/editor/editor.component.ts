import { Component, HostListener, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ExportService } from '../../core/services/export.service';
import { PortfolioStore } from '../../core/services/portfolio-store.service';
import { SectionCardComponent } from '../../shared/section-card.component';
import { PreviewComponent } from '../preview/preview.component';
import { DesignPanelComponent } from './panels/design-panel.component';
import { ItemListComponent } from './panels/item-list.component';
import { ProfileFormComponent } from './panels/profile-form.component';
import { SectionsPanelComponent } from './panels/sections-panel.component';
import { SkillTagsComponent } from './panels/skill-tags.component';
import { SummaryEditorComponent } from './panels/summary-editor.component';

type View = 'editor' | 'templates' | 'settings';
type Pr = Record<'profile' | 'summary' | 'exp' | 'proj' | 'skills' | 'edu', number>;

/** Layout shell only: it wires the store to the panels and the preview. */
@Component({
  selector: 'app-editor',
  imports: [RouterLink, PreviewComponent, ProfileFormComponent, ItemListComponent, SectionsPanelComponent, DesignPanelComponent, SectionCardComponent, SummaryEditorComponent, SkillTagsComponent],
  template: `
@if (pf(); as p) {
<div class="ed" [class.full]="full()">
  <header class="top pane">
    <span class="brand"><span class="logo"></span>Folio<b>SK</b></span>
    <nav class="nav">
      <a routerLink="/">Dashboard</a>
      @for (v of views; track v.id) { <button [class.on]="view() === v.id" (click)="view.set(v.id); full.set(false)">{{ v.label }}</button> }
    </nav>
    <span class="grow"></span>
    <button class="btn" [disabled]="!store.canUndo()" (click)="store.undo()">Undo</button>
    <button class="btn" [disabled]="!store.canRedo()" (click)="store.redo()">Redo</button>
    <button class="btn ghost" (click)="io.draft(p)">Draft Preview</button>
    <button class="btn ghost" (click)="full.set(!full())">{{ full() ? 'Back to Editor' : 'Live Preview' }}</button>
    <button class="btn primary" (click)="publish.set(true)">Publish</button>
  </header>

  <div class="cols">
    <section class="pane editor">
      <h2>{{ view() === 'editor' ? 'Editor' : view() === 'templates' ? 'Templates' : 'Settings' }}</h2>
      <div class="scroll">
        @switch (view()) {
          @case ('editor') {
            <app-section-card title="Profile" icon="☺" [progress]="pr().profile"><app-profile-form [p]="p" (patch)="store.patch($event)" /></app-section-card>
            <app-section-card title="Summary" icon="≡" [progress]="pr().summary"><app-summary-editor [value]="p.bio" (changed)="store.patch({ bio: $event })" /></app-section-card>
            <app-section-card title="Experience" icon="▤" [progress]="pr().exp">
              <app-item-list [items]="p.exp" one="position" icon="▤" [ph]="ph.exp" (changed)="store.patch({ exp: $event })" />
            </app-section-card>
            <app-section-card title="Projects" icon="▣" [progress]="pr().proj">
              <app-item-list [items]="p.proj" one="project" icon="▣" layout="cards" [ph]="ph.proj" (changed)="store.patch({ proj: $event })" />
            </app-section-card>
            <app-section-card title="Skills" icon="◈" [progress]="pr().skills"><app-skill-tags [value]="p.skills" (changed)="store.patch({ skills: $event })" /></app-section-card>
            <app-section-card title="Education" icon="✦" [progress]="pr().edu">
              <app-item-list [items]="p.edu" one="degree" icon="✦" [ph]="ph.edu" (changed)="store.patch({ edu: $event })" />
            </app-section-card>
          }
          @case ('templates') { <app-design-panel [p]="p" (patch)="store.patch($event)" /> }
          @case ('settings') {
            <app-sections-panel [p]="p" (patch)="store.patch($event)" />
            <h3>Data</h3>
            <button class="btn" (click)="io.backup(p)">Download backup (.json)</button>
          }
        }
      </div>
    </section>
    <section class="pane"><app-preview [portfolio]="p" /></section>
  </div>
</div>

@if (publish()) {
  <div class="ov" (click)="publish.set(false)">
    <div class="dlg" (click)="$event.stopPropagation()" role="dialog" aria-label="Publish">
      <h3>Publish your website</h3>
      <ol>
        <li>Download <b>index.html</b>.</li>
        <li>Upload it to Netlify Drop, Cloudflare Pages, or a GitHub repository with Pages turned on.</li>
        <li>Your site goes live at the address that service gives you.</li>
      </ol>
      <div class="acts"><button class="btn" (click)="publish.set(false)">Close</button><button class="btn primary" (click)="io.website(p)">Download index.html</button></div>
    </div>
  </div>
}
}`,
  styles: [`
    .ed{height:100vh;display:flex;flex-direction:column;padding:14px;gap:14px}
    .pane{border:1px solid var(--line);border-radius:18px;background:var(--panel);display:flex;flex-direction:column;min-height:0;min-width:0}
    .top{flex:none;flex-direction:row;align-items:center;height:60px;overflow:hidden}.nav{display:flex;margin-left:18px;height:100%}
    .nav a,.nav button{background:none;border:0;color:var(--mute);padding:0 14px;font:inherit;cursor:pointer;height:100%;border-bottom:2px solid transparent;text-decoration:none;display:flex;align-items:center}
    .nav .on{color:var(--ink);border-color:var(--acc)}.nav a:hover,.nav button:hover{color:var(--ink)}
    .cols{flex:1;min-height:0;display:grid;grid-template-columns:minmax(360px,1fr) 1.2fr;gap:14px}
    .editor>h2{margin:0;padding:0 18px;height:52px;display:flex;align-items:center;font:700 15px 'Bricolage Grotesque',sans-serif;border-bottom:1px solid var(--line)}
    .scroll{flex:1;overflow-y:auto;padding:14px}
    .full .cols{grid-template-columns:1fr}.full .editor{display:none}
    .ov{position:fixed;inset:0;background:#000a;display:grid;place-items:center;z-index:10}
    .dlg{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:22px;max-width:440px;width:calc(100% - 32px)}.dlg ol{color:var(--mute);padding-left:20px}.acts{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
    @media (max-width:900px){.cols{grid-template-columns:1fr}.cols .pane:last-child{display:none}.full .cols .pane:last-child{display:flex}.top .btn:not(.primary):not(.ghost),.brand{display:none}.nav{margin:0;overflow-x:auto}}`]
})
export class EditorComponent {
  id = input.required<string>(); // bound from the :id route param
  store = inject(PortfolioStore);
  io = inject(ExportService);
  private router = inject(Router);
  pf = computed(() => this.store.active());
  view = signal<View>('editor');
  full = signal(false);
  publish = signal(false);
  views: { id: View; label: string }[] = [{ id: 'editor', label: 'Editor' }, { id: 'templates', label: 'Templates' }, { id: 'settings', label: 'Settings' }];
  ph = {
    exp: ['Position', 'Company · dates', 'What you did'],
    proj: ['Project name', 'Link (https://…)', 'Description'],
    edu: ['Degree', 'School · dates', 'Notes']
  };
  pr = computed<Pr>(() => {
    const p = this.pf();
    if (!p) return { profile: 0, summary: 0, exp: 0, proj: 0, skills: 0, edu: 0 };
    const f = [p.name, p.title, p.email, p.photo, p.links.trim()];
    return {
      profile: Math.round(100 * f.filter(Boolean).length / f.length),
      summary: Math.min(100, Math.round(p.bio.length / 1.5)),
      exp: Math.min(100, p.exp.length * 50), proj: Math.min(100, p.proj.length * 34),
      skills: Math.min(100, p.skills.split(',').filter(s => s.trim()).length * 16), edu: p.edu.length ? 100 : 0
    };
  });

  constructor() {
    effect(() => {
      if (!this.store.all().some(p => p.id === this.id())) { this.router.navigateByUrl('/'); return; }
      this.store.open(this.id());
    });
  }

  @HostListener('window:keydown', ['$event'])
  keys(e: KeyboardEvent) {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); this.store.undo(); }
    else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); this.store.redo(); }
  }
}
