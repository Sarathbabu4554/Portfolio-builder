import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-summary-editor',
  template: `
    <div class="tb">
      <button (click)="wrap(ta, '**', '**')" aria-label="Bold"><b>B</b></button>
      <button (click)="wrap(ta, '*', '*')" aria-label="Italic"><i>I</i></button>
      <button (click)="link(ta)" aria-label="Link">🔗</button>
      <span class="mute">{{ value().length }} characters</span>
    </div>
    <textarea #ta rows="5" [value]="value()" (input)="changed.emit(ta.value)" placeholder="Write a short introduction about yourself"></textarea>
    <small class="mute">Supports **bold**, *italic* and [links](https://example.com)</small>`,
  styles: [`.tb{display:flex;gap:4px;align-items:center;background:var(--field);border:1px solid var(--line);border-bottom:0;border-radius:10px 10px 0 0;padding:4px 6px}
    .tb button{background:none;border:0;color:var(--ink);cursor:pointer;width:28px;height:28px;border-radius:6px}.tb button:hover{background:var(--panel2)}.tb span{margin-left:auto;font-size:12px}
    textarea{margin:0!important;border-radius:0 0 10px 10px!important}small{display:block;margin-top:6px}`]
})
export class SummaryEditorComponent {
  value = input.required<string>();
  changed = output<string>();
  wrap(ta: HTMLTextAreaElement, a: string, b: string) {
    const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || 'text';
    ta.value = ta.value.slice(0, s) + a + sel + b + ta.value.slice(e);
    this.changed.emit(ta.value); ta.focus(); ta.setSelectionRange(s + a.length, s + a.length + sel.length);
  }
  link(ta: HTMLTextAreaElement) { const u = prompt('Link address (https://…)'); if (u) this.wrap(ta, '[', `](${u})`); }
}
