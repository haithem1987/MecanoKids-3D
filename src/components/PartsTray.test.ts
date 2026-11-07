import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PartsTray, TrayPosition } from './PartsTray';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { getLocalizedBlueprint, UI_TRANSLATIONS } from '../i18n/translations';
import { LanguageCode, VehicleBlueprint } from '../types/game';

const noop = () => {};
const water = VEHICLE_BLUEPRINTS.find((bp) => bp.id === 'chem-water-molecule')!;

function renderTray(language: LanguageCode, position: TrayPosition, blueprint: VehicleBlueprint = water): string {
  return renderToStaticMarkup(React.createElement(PartsTray, {
    language, position, blueprint: getLocalizedBlueprint(blueprint, language), placedPartIds: [], faultyPartIds: [],
    liveryPreset: 'original', stagedPartId: null, activeDragPartId: null, hintPartId: null,
    onStartPartDrag: noop, onClickPartCard: noop,
  }));
}

function decodeHtml(value: string): string {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

describe('palette persistante : cibles tactiles et consignes accessibles', () => {
  it.each(['fr', 'en', 'ar'] as const)('%s : chaque commande a un nom traduit et une cible de 64 px au minimum', (language) => {
    const t = UI_TRANSLATIONS[language];
    for (const position of ['bottom', 'left', 'right'] as const) {
      const markup = renderTray(language, position);
      const buttons = markup.match(/<button\b[^>]*>/g) ?? [];
      expect(buttons.length).toBe(water.parts.length + 1);
      for (const button of buttons) {
        expect(button).toMatch(/min-h-\[(64|80)px\]/);
        expect(button).toMatch(/min-w-\[(64|80)px\]/);
        expect(button).toMatch(/aria-label="[^"]+"/);
      }
      const labels = buttons.map((button) => decodeHtml(/aria-label="([^"]+)"/.exec(button)![1]));
      expect(labels).toContain(t.trayShowAll);
      expect(markup).not.toContain(t.collapseWorkbench);
      expect(markup).not.toContain('aria-expanded=');
      for (const untranslated of ['bottom', 'left', 'right']) expect(labels).not.toContain(untranslated);
      expect(buttons.filter((button) => button.includes('aria-pressed="true"'))).toHaveLength(1);
    }
  });

  it.each(VEHICLE_BLUEPRINTS.filter((bp) => bp.experiment))('$id : nom, rôle et dépendances accessibles en FR/EN/AR', (bp) => {
    for (const language of ['fr', 'en', 'ar'] as const) {
      const localized = getLocalizedBlueprint(bp, language);
      const markup = renderTray(language, 'bottom', bp);
      const labels = [...markup.matchAll(/aria-label="([^"]+)"/g)].map((match) => decodeHtml(match[1]));
      for (const [index, part] of localized.parts.entries()) {
        const label = labels.find((name) => name.startsWith(`${String(index + 1).padStart(2, '0')} ${part.name}.`));
        expect(label).toContain(part.roleHint);
        if (part.dependsOn.length) {
          const dependency = localized.parts.find((candidate) => candidate.id === part.dependsOn[0])!;
          expect(label).toContain(UI_TRANSLATIONS[language].partStatusLockedAfter(dependency.name));
        }
      }
    }
  });
});
