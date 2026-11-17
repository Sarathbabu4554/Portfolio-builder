import { AURORA } from './aurora.template';
import { BOLD } from './bold.template';
import { EDITORIAL } from './editorial.template';
import { TemplateDef } from './template';

export const TEMPLATES: TemplateDef[] = [AURORA, EDITORIAL, BOLD];
export const getTemplate = (id: string): TemplateDef => TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0];
