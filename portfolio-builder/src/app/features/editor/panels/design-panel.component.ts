import { Component, input, output } from '@angular/core';
import { FontKey, Portfolio } from '../../../core/models/portfolio.model';
import { TEMPLATES } from '../../../core/templates';

@Component({
  selector: 'app-design-panel',
  template: `
    <h3>Template</h3>
    <div class="tpls">
      @for (t of templates; track t.id) {
        <button class="btn" [class.on]="p().tpl === t.id" (click)="patch.emit({ tpl: t.id })">
          <span class="thumb" [style.background]="t.thumbBg" [style.color]="t.thumbFg">Aa</span>
          <strong>{{ t.name }}</strong><small>{{ t.note }}</small>
        </button>
      }
    </div>
    <h3>Accent colour</h3>
    <div class="sw">
      @for (c of colors; track c) {
        <button class="dot" [class.on]="p().accent === c" [style.background]="c" (click)="patch.emit({ accent: c })" [attr.aria-label]="c"></button>
      }
      <input type="color" [value]="p().accent" (input)="patch.emit({ accent: val($event) })" aria-label="Custom colour">
    </div>
    <h3>Typeface</h3>
    <div class="seg">
      @for (f of fonts; track f.id) { <button [class.on]="p().font === f.id" (click)="patch.emit({ font: f.id })">{{ f.label }}</button> }
    </div>`,
  styles: [`
    .tpls{display:grid;gap:10px}.tpls .btn{display:grid;grid-template-columns:84px 1fr;column-gap:14px;text-align:left;padding:10px}
    .tpls .btn.on{border-color:var(--acc);box-shadow:0 0 0 2px #5b4bf533}.thumb{grid-row:1/3;height:60px;border-radius:8px;display:grid;place-items:center;font:700 22px Georgia,serif}.tpls small{color:var(--mute)}
    .sw{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.dot{width:30px;height:30px;border-radius:50%;padding:0;cursor:pointer;border:3px solid var(--panel);box-shadow:0 0 0 1px var(--line)}.dot.on{box-shadow:0 0 0 2px var(--ink)}
    input[type=color]{height:36px;width:44px;padding:2px;border:1px solid var(--line);border-radius:8px;background:var(--panel2)}`]
})
export class DesignPanelComponent {
  p = input.required<Portfolio>();
  patch = output<Partial<Portfolio>>();
  templates = TEMPLATES;
  colors = ['#7c6cff', '#ff7a59', '#10b981', '#0ea5e9', '#e11d48', '#f59e0b'];
  fonts: { id: FontKey; label: string }[] = [{ id: 'sans', label: 'Inter' }, { id: 'serif', label: 'Fraunces' }, { id: 'mono', label: 'Mono' }];
  val(e: Event) { return (e.target as HTMLInputElement).value; }
}
