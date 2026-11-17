import { Injectable } from '@angular/core';
import { Portfolio } from '../models/portfolio.model';
import { renderSite } from '../render/site-renderer';

@Injectable({ providedIn: 'root' })
export class ExportService {
  website(p: Portfolio) { this.save('index.html', renderSite(p), 'text/html'); }
  draft(p: Portfolio) { window.open(URL.createObjectURL(new Blob([renderSite(p)], { type: 'text/html' })), '_blank'); }
  backup(p: Portfolio) { this.save(`${p.name.toLowerCase().replace(/\W+/g, '-') || 'portfolio'}-backup.json`, JSON.stringify(p, null, 2), 'application/json'); }
  private save(name: string, text: string, type: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href);
  }
}
