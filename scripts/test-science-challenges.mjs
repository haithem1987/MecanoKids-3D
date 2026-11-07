import {canvasFraming} from './canvas-geometry.mjs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { PerspectiveCamera, Vector3 } from 'three';

// Supply a Playwright installation and the URL of the local admin server.
const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] ?? 'playwright');
const url = process.argv[3] ?? 'http://127.0.0.1:7302/?admin=1';
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
const solutions = { close: [0], open: [0], series: [0, 1, 0], equal: [2], heavy: [4], near: [1], water: [1], repairWater: [1], carbon: [2] };
const activate = (locator, touch) => touch ? locator.tap() : locator.click();

async function seed(page, language, id) {
  await page.goto(url);
  const { storageKey, store } = await page.evaluate(async ({ language, id }) => {
    const storagePath = '/src/utils/storage.ts';
    const blueprintsPath = '/src/data/blueprints.ts';
    const storage = await import(storagePath);
    const progress = storage.createDefaultProgress(language, true);
    if (id) {
      const { VEHICLE_BLUEPRINTS } = await import(blueprintsPath);
      const blueprint = VEHICLE_BLUEPRINTS.find(item => item.id === id);
      progress.currentBlueprintId = id;
      progress.lastStandardBlueprintId = id;
      progress.inProgressStages[id] = { placedPartIds: blueprint.parts.map(part => part.id) };
    }
    const profile = storage.createNewPlayerProfile({ name: 'QA', progressOverride: progress });
    return { storageKey: storage.PROFILES_STORAGE_KEY, store: { activeProfileId: profile.id, profiles: [profile] } };
  }, { language, id });
  await page.addInitScript(({ storageKey, store }) => {
    const marker = `qa-seeded-${store.activeProfileId}`;
    if (sessionStorage.getItem(marker)) return;
    localStorage.setItem(storageKey, JSON.stringify(store));
    sessionStorage.setItem(marker, '1');
  }, { storageKey, store });
  await page.reload();
}

async function play(page, workbench, mission, challenge, t, touch) {
  await activate(mission.locator(`[data-science-start="${challenge.id}"]`), touch);
  const summary = mission.locator(':scope > summary');
  if (await mission.getAttribute('open') !== null) await activate(summary, touch);
  // Let the canvas resize after collapsing the mission before projecting its 3D controls.
  await page.waitForTimeout(200);
  const bounds = await canvasFraming(workbench.locator('canvas'));
  assert.ok(bounds);
  const camera = new PerspectiveCamera(44, bounds.width / bounds.height, 0.1, 100);
  camera.position.set(4.4, 3.2, 4.9).sub(new Vector3(0,.9,0)).multiplyScalar(Math.max(1,1/Math.max(.25,bounds.aspect))).add(new Vector3(0,.9,0));
  camera.setViewOffset(bounds.width,bounds.height,bounds.offset,0,bounds.width,bounds.height);
  camera.lookAt(0, 0.9, 0);
  camera.updateMatrixWorld();
  let setting = challenge.start;
  const useCanvas = async value => {
    let point;
    if (challenge.kind === 'circuit') {
      point = new Vector3(challenge.switches === 1 ? 0 : (value - 0.5) * 0.94, 0.4, 0.62);
      setting ^= 1 << value;
    } else if (challenge.kind === 'lever') {
      const difference = challenge.movingMass * setting - challenge.fixedMass * challenge.fixedDistance;
      const tilt = Math.sign(difference) * -0.18;
      point = new Vector3(value * 0.31, 0.12, 0.11).applyAxisAngle(new Vector3(0, 0, 1), tilt);
      point.y += 0.85;
      setting = value;
    } else {
      point = new Vector3((value - 1) * 0.66, value ? 0.34 : 0.19, 0.79);
      setting = value;
    }
    point.project(camera);
    const x = bounds.x + (1 + point.x) * bounds.width / 2;
    const y = bounds.y + (1 - point.y) * bounds.height / 2;
    if (touch) await page.touchscreen.tap(x, y);
    else await page.mouse.click(x, y);
    await page.waitForFunction(expected => document.querySelector('[data-science-trial]')?.getAttribute('data-science-setting') === String(expected), setting, { timeout: 2500 }).catch(async error => {
      const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.outerHTML.slice(0, 140), { x, y });
      throw new Error(`${challenge.id}/${value}: expected ${setting}, hit ${hit}. ${error.message}`);
    });
  };
  if (challenge.kind === 'molecule') await useCanvas(challenge.target === 1 ? 2 : 1);
  for (const value of solutions[challenge.id]) await useCanvas(value);
  await activate(summary, touch);
  await mission.locator('[data-science-result]').getByText(t.solved, { exact: true }).waitFor();
  await activate(mission.getByRole('button', { name: t.restart, exact: true }), touch);
  await activate(mission.locator('details summary'), touch);
  const values = challenge.id === 'series' ? [1] : solutions[challenge.id];
  for (const value of values) await mission.locator(`[data-science-action="${value}"]`).press('Enter');
  await mission.locator('[data-science-result]').getByText(t.solved, { exact: true }).waitFor();
  await activate(mission.getByRole('button', { name: t.returnToBuild, exact: true }), touch);
  assert.equal(await workbench.getAttribute('data-science-trial'), null);
}

try {
  for (const [language, index] of [['en', 1], ['ar', 2], ['fr', 0]]) {
    const touch = language !== 'fr';
    const page = await browser.newPage({ hasTouch: touch, reducedMotion: 'reduce', viewport: touch ? { width: 430, height: 900 } : { width: 1600, height: 900 } });
    page.setDefaultTimeout(10000);
    try {
      await seed(page, language);
      const { challenges, t, stages } = await page.evaluate(async index => {
        const { SCIENCE_CHALLENGES } = await import('/src/data/scienceChallenges.ts');
        const { SCIENCE_CHALLENGE_TEXT, CATALOG_BROWSE_TEXT } = await import('/src/i18n/translations.ts');
        const { VEHICLE_BLUEPRINTS } = await import('/src/data/blueprints.ts');
        return {
          challenges: SCIENCE_CHALLENGES,
          t: { ...Object.fromEntries(Object.entries(SCIENCE_CHALLENGE_TEXT).map(([key, values]) => [key, values[index]])), returnToBuild: CATALOG_BROWSE_TEXT.resetScience[index] },
          stages: VEHICLE_BLUEPRINTS.map(bp => ({ id: bp.id, category: bp.category, number: bp.stageNumber })),
        };
      }, index);
      const catalog = page.getByRole('dialog');
      assert.equal(await catalog.locator('[data-catalog-stage]').count(), 0);
      if (language === 'fr') {
        await catalog.getByRole('searchbox').fill('molecule');
        await catalog.locator('[data-catalog-stage="chem-water-molecule"]').waitFor();
      }
      for (const [id, games] of Object.entries(challenges)) {
        await seed(page, language, id);
        const dialog = page.getByRole('dialog');
        assert.equal(await dialog.locator('[data-science-start]').count(), 0);
        const stage = stages.find(item => item.id === id);
        await activate(dialog.locator(`[data-catalog-world="${stage.category}"]`), touch);
        await dialog.getByRole('searchbox').fill(String(stage.number));
        await activate(dialog.locator(`[data-catalog-stage="${id}"]`), touch);
        const workbench = page.locator(`[data-workbench="${id}"]`);
        const mission = page.locator(`[data-science-mission="${id}"]`);
        await activate(mission.locator(':scope > summary'), touch);
        for (const game of games) await play(page, workbench, mission, game, t, touch);
      }
      console.log(`${language} : 9 défis joués dans la scène 3D et rejoués au clavier.`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
