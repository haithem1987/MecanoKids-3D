import {canvasTarget} from './canvas-geometry.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] ?? 'playwright');
const url = process.argv[3] ?? 'http://127.0.0.1:7302/?admin=1';
const solutions = {
  newton: [2], venturi: [2, 1], rocket: [1, 1], balance: [0, 0], phase: [1],
  dna: [0, 1, 2, 3], slime: [1], ph: [2, 2], conductivity: [2], resistance: [1],
  logic: [2, 0, 0], capillary: [1, 1], erosion: [2, 1],
};
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
try {
  for (const [locale, language] of ['fr', 'en', 'ar'].entries()) {
    if (process.env.OCTO_QA_LANGUAGE && process.env.OCTO_QA_LANGUAGE !== language) continue;
    const touch = locale > 0;
    const page = await browser.newPage({ hasTouch: touch, viewport: touch ? { width: 430, height: 900 } : { width: 1500, height: 900 } });
    page.setDefaultTimeout(10000);
    try {
      await page.goto(url);
      const { store, key, labs, ui, listen } = await page.evaluate(async ({ language, locale }) => {
        const storage = await import('/src/utils/storage.ts');
        const { VIRTUAL_LAB_BLUEPRINTS } = await import('/src/data/virtualLabBlueprints.ts');
        const { VIRTUAL_LAB_UI, SCIENCE_CHALLENGE_TEXT } = await import('/src/i18n/translations.ts');
        const profile = storage.createNewPlayerProfile({ name: 'QA', progressOverride: storage.createDefaultProgress(language, true) });
        return {
          key: storage.PROFILES_STORAGE_KEY, store: JSON.stringify({ activeProfileId: profile.id, profiles: [profile] }),
          labs: VIRTUAL_LAB_BLUEPRINTS.map(bp => ({ id: bp.virtualLab, stageId: bp.id, category: bp.category, parts: bp.parts.map(part => part.id) })),
          ui: VIRTUAL_LAB_UI, listen: SCIENCE_CHALLENGE_TEXT.listen[locale],
        };
      }, { language, locale });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(({ key, store }) => {
        if (!sessionStorage.getItem('qa-labs-seed')) {
          localStorage.setItem(key, store);
          sessionStorage.setItem('qa-labs-seed', '1');
        }
        Object.defineProperty(window.speechSynthesis, 'getVoices', { value: () => [] });
        window.narrationPlayed = 0;
        const start = AudioBufferSourceNode.prototype.start;
        AudioBufferSourceNode.prototype.start = function (...args) {
          if (this.buffer?.getChannelData(0).some(value => Math.abs(value) > 0.001) && this.context.state === 'running') {
            window.narrationPlayed++;
          }
          return start.apply(this, args);
        };
      }, { key, store });
      await page.reload();
      const activate = locator => touch ? locator.tap() : locator.click();
      for (const { id, stageId, category, parts } of labs) {
          await activate(page.locator(`[data-catalog-world="${category}"]`));
          await activate(page.locator(`[data-catalog-stage="${stageId}"]`));
          const workbench = page.locator(`[data-workbench="${stageId}"]`);
          const canvas = workbench.locator('canvas');
          const lab = page.locator(`[data-virtual-lab="${id}"]`);
          const run = () => activate(lab.locator('[data-virtual-lab-run]'));
          const pick = (index, value) => activate(lab.locator(`[data-lab-control="${index}"] button`).nth(value));
          await canvas.waitFor();
          for (const part of parts) {
            const card = page.locator(`[data-part-id="${part}"]:visible`);
            await activate(card);
            const bounds = await canvas.boundingBox();
            const target=await canvasTarget(canvas);
            await page.waitForTimeout(190);
            const click = touch ? page.touchscreen.tap.bind(page.touchscreen) : page.mouse.click.bind(page.mouse);
            // The target of a frame or a hollow vessel may be between its solid surfaces.
            const offsets = [[0, 0], [0, -0.17], [0, 0.08], [-0.16, 0], [0.16, 0], [0, -0.2], [-0.12, -0.12], [0.12, -0.12], [-0.15, 0.08], [0.15, -0.08], [-0.2, 0.08], [0.2, -0.08]];
            for (const [x, y] of offsets) {
              if (await workbench.getAttribute('data-assembly-complete') === 'true' || await card.count() && await card.isDisabled()) break;
              await click(target.x + x * bounds.height, target.y + y * bounds.height);
            }
            if (await workbench.getAttribute('data-assembly-complete') !== 'true' && (!await card.count() || !await card.isDisabled())) throw new Error(`${language}/${id}/${part}: la pièce ne s’est pas emboîtée.`);
          }
          await activate(lab.locator('summary'));
          if (id === 'newton' && process.env.OCTO_SKIP_AUDIO_TEST !== '1') {
            const before = await page.evaluate(() => window.narrationPlayed);
            await activate(lab.getByRole('button', { name: listen, exact: true }));
            await page.waitForFunction(before => window.narrationPlayed > before, before);
          }
          await run();
          await page.locator(`[data-workbench="${stageId}"][data-lab-outcome]`).waitFor();
          await activate(lab.getByRole('button', { name: ui.reset[locale], exact: true }));
          if (id === 'dna') {
            await pick(0, 3);
            await run();
            await lab.getByText(ui.nextStep[locale], { exact: true }).waitFor();
            for (const value of solutions.dna) {
              await pick(0, value);
              await run();
            }
          } else {
            if (id === 'ph') {
              for (const value of [0, 1]) {
                await pick(0, value);
                await run();
              }
            }
            if (id === 'venturi') {
              await pick(2, 1);
              await run();
              await pick(3, 1);
              await run();
              await pick(2, 0);
            }
            for (const [index, value] of solutions[id].entries()) await pick(index, value);
            await run();
          }
          await lab.getByText(ui.goalReached[locale], { exact: true }).waitFor();
          await page.reload();
      }
      console.log(`${language} : 13 laboratoires assemblés et réussis sur l’établi 3D.`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
