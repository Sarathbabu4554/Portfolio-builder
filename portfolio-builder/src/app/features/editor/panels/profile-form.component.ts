import { Component, input, output } from '@angular/core';
import { Portfolio } from '../../../core/models/portfolio.model';
import { squareImage } from '../../../core/utils/image.util';

type Field = 'name' | 'title' | 'bio' | 'email' | 'links' | 'skills';

@Component({
  selector: 'app-profile-form',
  template: `
    @for (f of fields; track f.k) {
      <label>{{ f.label }} @if (f.hint) { <small>{{ f.hint }}</small> }
        @if (f.rows) { <textarea [rows]="f.rows" [value]="p()[f.k]" (input)="edit(f.k, val($event))"></textarea> }
        @else { <input [value]="p()[f.k]" (input)="edit(f.k, val($event))"> }
      </label>
    }
    <div class="photo">
      @if (p().photo) { <img [src]="p().photo" alt="Profile picture"> } @else { <span class="empty">No photo</span> }
      <button class="btn" (click)="pic.click()">Upload picture</button>
      @if (p().photo) { <button class="btn" (click)="patch.emit({ photo: '' })">Remove</button> }
      <input #pic type="file" accept="image/*" hidden (change)="upload($event)">
    </div>`,
  styles: [`.photo{display:flex;align-items:center;gap:10px}.photo img,.empty{width:64px;height:64px;border-radius:50%;object-fit:cover}.empty{display:grid;place-items:center;background:var(--soft);font-size:11px;color:var(--mute)}`]
})
export class ProfileFormComponent {
  p = input.required<Portfolio>();
  patch = output<Partial<Portfolio>>();
  fields: { k: Field; label: string; hint?: string; rows?: number }[] = [
    { k: 'name', label: 'Name' }, { k: 'title', label: 'Professional title' }, { k: 'email', label: 'Email' },
    { k: 'links', label: 'Links', hint: 'Label | URL, one per line', rows: 3 }
  ];
  val(e: Event) { return (e.target as HTMLInputElement).value; }
  edit(k: Field, v: string) { this.patch.emit({ [k]: v } as Partial<Portfolio>); }
  async upload(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.patch.emit({ photo: await squareImage(f) });
  }
}
