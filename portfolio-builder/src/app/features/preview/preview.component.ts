import { Component, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Portfolio } from '../../core/models/portfolio.model';
import { renderSite } from '../../core/render/site-renderer';

@Component({
  selector: 'app-preview',
  template: `
    <h2>Live Preview
      <span class="seg">
        <button [class.on]="device() === 'desktop'" (click)="device.set('desktop')">Desktop</button>
        <button [class.on]="device() === 'mobile'" (click)="device.set('mobile')">Mobile</button>
      </span></h2>
    <div class="canvas"><iframe title="Portfolio preview" [class.m]="device() === 'mobile'" [srcdoc]="doc()"></iframe></div>`,
  styles: [`
    :host{display:flex;flex-direction:column;flex:1;min-height:0}
    h2{margin:0;padding:10px 18px;font:700 15px 'Bricolage Grotesque',sans-serif;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;height:52px}
    .seg{width:200px;margin:0;font:500 13px 'Inter',sans-serif}
    .canvas{flex:1;min-height:0;display:flex;justify-content:center;padding:14px}
    iframe{width:100%;height:100%;border:1px solid var(--line);border-radius:12px;background:#fff;transition:width .25s}iframe.m{width:390px}`]
})
export class PreviewComponent {
  portfolio = input.required<Portfolio>();
  device = signal<'desktop' | 'mobile'>('desktop');
  doc = signal<SafeHtml>('');
  private san = inject(DomSanitizer);
  private tm: ReturnType<typeof setTimeout> | undefined;
  private ready = false;

  constructor() {
    effect(() => {
      const html = renderSite(this.portfolio());
      clearTimeout(this.tm); // debounce so typing does not reload the frame on every key
      this.tm = setTimeout(() => this.doc.set(this.san.bypassSecurityTrustHtml(html)), this.ready ? 250 : 0);
      this.ready = true;
    });
  }
}
