# FolioSK – portfolio builder (Angular 20, no backend)

    npm install
    npm start          # http://localhost:4200
    npm run build      # static site in dist/portfolio-builder/browser

## Architecture
    src/app
    ├─ core/                      # no UI, reusable anywhere
    │  ├─ models/                 # Portfolio, Item, defaults, normalize()
    │  ├─ services/               # PortfolioStore (signals, undo/redo, persistence), ExportService
    │  ├─ render/site-renderer.ts # Portfolio -> standalone HTML string
    │  ├─ templates/              # one file per template + registry (index.ts)
    │  └─ utils/                  # image resize
    └─ features/                  # lazy-loaded screens, one folder each
       ├─ dashboard/              # list, create, duplicate, delete, import
       ├─ editor/                 # shell + panels/ (profile, item-list, sections, design)
       └─ preview/                # live iframe, desktop/mobile

## Extending
- New template: add `core/templates/x.template.ts`, register it in `templates/index.ts`.
- New section: add a key to `SectionKey`, a label, and a renderer in `site-renderer.ts`.
- New backend later: replace persistence inside `PortfolioStore` only (e.g. IndexedDB or an API).
