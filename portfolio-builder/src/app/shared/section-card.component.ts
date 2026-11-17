import { Component, input, signal } from '@angular/core';

/** Collapsible card with an icon, title and completion bar. Content is projected. */
@Component({
  selector: 'app-section-card',
  template: `
    <section>
      <button class="head" (click)="open.set(!open())" [attr.aria-expanded]="open()">
        <span class="ic">{{ icon() }}</span><strong>{{ title() }}</strong>
        <span class="bar"><i [style.width.%]="progress()"></i></span>
        <span class="chev">{{ open() ? '⌃' : '⌄' }}</span>
      </button>
      @if (open()) { <div class="body"><ng-content /></div> }
    </section>`,
  styles: [`
    section{border:1px solid var(--line);border-radius:16px;background:var(--panel2);margin-bottom:14px}
    .head{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;cursor:pointer}
    .head:focus-visible{outline:2px solid var(--accl);border-radius:16px}
    .ic{width:32px;height:32px;display:grid;place-items:center;border-radius:9px;background:var(--soft);color:var(--accl)}
    strong{font:700 16px 'Bricolage Grotesque',sans-serif;flex:none}
    .bar{flex:1;height:5px;border-radius:9px;background:var(--line);overflow:hidden;max-width:110px;margin-left:auto}
    .bar i{display:block;height:100%;background:var(--acc);transition:width .3s}.chev{color:var(--mute);width:16px;text-align:center}
    .body{padding:0 16px 16px}`]
})
export class SectionCardComponent {
  title = input.required<string>();
  icon = input('◆');
  progress = input(0);
  open = signal(true);
}
