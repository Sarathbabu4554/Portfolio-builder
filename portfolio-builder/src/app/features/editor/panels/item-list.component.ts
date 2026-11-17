import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { Item, uid } from '../../../core/models/portfolio.model';

/** Compact tiles (rows or horizontal cards); selecting one opens its edit form. */
@Component({
  selector: 'app-item-list',
  imports: [NgTemplateOutlet],
  template: `
    <div class="tiles" [class.cards]="layout() === 'cards'">
      @for (it of items(); track it.id) {
        <div class="tile" tabindex="0" [class.sel]="sel() === it.id" (click)="toggle(it.id)" (keydown.enter)="toggle(it.id)">
          <span class="ic">{{ icon() }}</span>
          <span class="tx"><b>{{ it.t || 'Untitled' }}</b><small>{{ it.s }}</small>@if (layout() === 'cards') { <small class="d">{{ it.x }}</small> }</span>
          @if (layout() === 'rows') { <span class="chev">{{ sel() === it.id ? '⌄' : '›' }}</span> }
        </div>
        @if (layout() === 'rows' && sel() === it.id) { <ng-container *ngTemplateOutlet="form; context: { $implicit: it }" /> }
      }
    </div>
    @if (layout() === 'cards' && selected(); as it) { <ng-container *ngTemplateOutlet="form; context: { $implicit: it }" /> }
    <button class="btn add" (click)="add()">+ Add {{ one() }}</button>

    <ng-template #form let-it>
      <div class="form">
        <div class="tools">
          <button class="ib" (click)="move(it, -1)" aria-label="Move up">↑</button>
          <button class="ib" (click)="move(it, 1)" aria-label="Move down">↓</button>
          <button class="ib" (click)="remove(it)" aria-label="Remove">✕</button>
        </div>
        <input [placeholder]="ph()[0]" [value]="it.t" (input)="edit(it, 't', val($event))">
        <input [placeholder]="ph()[1]" [value]="it.s" (input)="edit(it, 's', val($event))">
        <textarea rows="3" [placeholder]="ph()[2]" [value]="it.x" (input)="edit(it, 'x', val($event))"></textarea>
      </div>
    </ng-template>`,
  styles: [`
    .tiles{display:flex;flex-direction:column;gap:8px}.tiles.cards{flex-direction:row;overflow-x:auto;padding-bottom:6px}
    .tile{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--line);background:var(--panel);border-radius:12px;cursor:pointer;min-width:0}
    .cards .tile{flex:none;width:200px;flex-direction:column;align-items:flex-start}.tile.sel{border-color:var(--acc)}
    .ic{width:34px;height:34px;display:grid;place-items:center;border-radius:9px;background:var(--soft);color:var(--accl);flex:none}
    .tx{flex:1;min-width:0;width:100%}.tx b,.tx small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tx small{color:var(--mute)}.tx .d{white-space:normal;max-height:3em;margin-top:4px}.chev{color:var(--mute)}
    .form{margin:6px 0 4px;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}.tools{display:flex;justify-content:flex-end}
    .form input,.form textarea{margin:0 0 8px}`]
})
export class ItemListComponent {
  items = input.required<Item[]>();
  one = input('item');
  icon = input('▣');
  layout = input<'rows' | 'cards'>('rows');
  ph = input<string[]>(['Title', 'Subtitle', 'Description']);
  changed = output<Item[]>();
  sel = signal<string | null>(null);
  selected = computed(() => this.items().find(i => i.id === this.sel()));

  val(e: Event) { return (e.target as HTMLInputElement).value; }
  toggle(id: string) { this.sel.set(this.sel() === id ? null : id); }
  edit(it: Item, f: 't' | 's' | 'x', v: string) { this.changed.emit(this.items().map(i => (i.id === it.id ? { ...i, [f]: v } : i))); }
  add() { const n = { id: uid(), t: '', s: '', x: '' }; this.changed.emit([...this.items(), n]); this.sel.set(n.id); }
  remove(it: Item) { this.changed.emit(this.items().filter(i => i.id !== it.id)); this.sel.set(null); }
  move(it: Item, d: number) {
    const a = [...this.items()], i = a.findIndex(x => x.id === it.id), j = i + d;
    if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; this.changed.emit(a);
  }
}
