import { Component, computed, input, output } from '@angular/core';

/** Skills as chips: add with Enter, remove with ×, reorder by drag and drop. */
@Component({
  selector: 'app-skill-tags',
  template: `
    <p class="mute">Drag tags to reorder. Press Enter to add a skill.</p>
    <div class="box">
      @for (s of tags(); track $index; let i = $index) {
        <span class="chip" draggable="true" (dragstart)="from = i" (dragover)="$event.preventDefault()" (drop)="drop(i)">
          {{ s }} <button (click)="remove(i)" [attr.aria-label]="'Remove ' + s">×</button>
        </span>
      }
      <input #inp placeholder="Add skill" (keydown.enter)="add(inp)">
    </div>`,
  styles: [`p{margin:0 0 8px}.box{display:flex;flex-wrap:wrap;gap:8px;padding:10px;border:1px solid var(--line);border-radius:12px;background:var(--field)}
    .chip{display:inline-flex;gap:6px;align-items:center;padding:4px 6px 4px 12px;border-radius:999px;background:var(--soft);border:1px solid #4a3d8f;cursor:grab}
    .chip button{background:none;border:0;color:var(--mute);cursor:pointer;padding:0 4px}.chip button:hover{color:var(--ink)}
    input{width:120px!important;margin:0!important;border:0!important;background:transparent!important;padding:4px!important}`]
})
export class SkillTagsComponent {
  value = input.required<string>();
  changed = output<string>();
  tags = computed(() => this.value().split(',').map(s => s.trim()).filter(Boolean));
  from = -1;
  private emit(a: string[]) { this.changed.emit(a.join(', ')); }
  add(el: HTMLInputElement) { const n = el.value.split(',').map(s => s.trim()).filter(Boolean); if (n.length) this.emit([...this.tags(), ...n]); el.value = ''; }
  remove(i: number) { this.emit(this.tags().filter((_, n) => n !== i)); }
  drop(to: number) {
    if (this.from < 0 || this.from === to) return;
    const a = [...this.tags()]; const [m] = a.splice(this.from, 1); a.splice(to, 0, m); this.from = -1; this.emit(a);
  }
}
