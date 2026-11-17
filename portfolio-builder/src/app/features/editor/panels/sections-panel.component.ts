import { Component, input, output } from '@angular/core';
import { Portfolio, SECTION_LABELS, SectionKey } from '../../../core/models/portfolio.model';

@Component({
  selector: 'app-sections-panel',
  template: `
    <h3>Page sections</h3>
    <p class="mute">Show, hide and reorder the sections of your website.</p>
    @for (k of p().order; track k; let i = $index; let first = $first; let last = $last) {
      <div class="card row">
        <label><input type="checkbox" [checked]="!p().hidden.includes(k)" (change)="toggle(k)"> {{ labels[k] }}</label>
        <span><button class="ib" [disabled]="first" (click)="move(i, -1)" aria-label="Move up">↑</button>
        <button class="ib" [disabled]="last" (click)="move(i, 1)" aria-label="Move down">↓</button></span>
      </div>
    }`,
  styles: [`.row{display:flex;justify-content:space-between;align-items:center;padding:8px 12px}.row label{margin:0;display:flex;gap:8px;align-items:center}`]
})
export class SectionsPanelComponent {
  p = input.required<Portfolio>();
  patch = output<Partial<Portfolio>>();
  labels = SECTION_LABELS;
  toggle(k: SectionKey) {
    const h = this.p().hidden;
    this.patch.emit({ hidden: h.includes(k) ? h.filter(x => x !== k) : [...h, k] });
  }
  move(i: number, d: number) {
    const a = [...this.p().order]; [a[i], a[i + d]] = [a[i + d], a[i]]; this.patch.emit({ order: a });
  }
}
