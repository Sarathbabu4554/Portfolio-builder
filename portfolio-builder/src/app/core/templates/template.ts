/** A template is only a name, a thumbnail and a CSS function. Add one file + one line in index.ts. */
export interface TemplateDef {
  id: string; name: string; note: string; thumbBg: string; thumbFg: string;
  css: (accent: string) => string;
}
