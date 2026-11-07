import { describe, expect, it } from 'vitest';
import { Euler, Vector3 } from 'three';
import { VEHICLE_BLUEPRINTS } from './blueprints';
import { PartShapeKind as S } from '../types/game';
import { getLocalizedBlueprint } from '../i18n/translations';

const get = (id: string) => VEHICLE_BLUEPRINTS.find((bp) => bp.id === id)!;
const count = (id: string, shape: S) => get(id).parts.filter((p) => p.shape === shape).length;

describe('identité pédagogique des expériences', () => {
  it('garde la formule H₂O et l’angle de 104,5° dès le premier niveau', () => {
    expect(count('chem-water-molecule', S.ATOM_OXYGEN)).toBe(1);
    expect(count('chem-water-molecule', S.ATOM_HYDROGEN)).toBe(2);
    expect(count('chem-water-molecule', S.BOND_SINGLE)).toBe(2);
    const atoms = get('chem-water-molecule').parts.filter((p) => p.shape === S.ATOM_HYDROGEN);
    const origin = new Vector3(...get('chem-water-molecule').parts[0].targetPos);
    const angle = new Vector3(...atoms[0].targetPos).sub(origin).angleTo(new Vector3(...atoms[1].targetPos).sub(origin));
    expect(angle * 180 / Math.PI).toBeCloseTo(104.5, 5);
  });
  it('CO₂ contient un carbone, deux oxygènes et deux liaisons doubles', () => {
    expect(count('chem-co2-molecule', S.ATOM_CARBON)).toBe(1);
    expect(count('chem-co2-molecule', S.ATOM_OXYGEN)).toBe(2);
    expect(count('chem-co2-molecule', S.BOND_DOUBLE)).toBe(2);
    expect(count('chem-co2-molecule', S.ATOM_HYDROGEN)).toBe(0);
  });
  it('le sel contient des ions Na⁺/Cl⁻ alternés, sans liaisons covalentes', () => {
    const bp = get('chem-salt-crystal');
    expect(count(bp.id, S.ATOM_SODIUM)).toBe(4);
    expect(count(bp.id, S.ATOM_CHLORINE)).toBe(4);
    expect(bp.parts.some((p) => p.bond)).toBe(false);
    for (const a of bp.parts) for (const b of bp.parts) {
      if (new Vector3(...a.targetPos).distanceTo(new Vector3(...b.targetPos)) === 0.5) expect(a.shape).not.toBe(b.shape);
    }
  });
  it.each([
    ['elec-led-circuit', S.RESISTOR], ['elec-motor-fan', S.MICRO_MOTOR], ['elec-motor-fan', S.FAN_BLADES],
    ['elec-alarm-buzzer', S.LIGHT_SENSOR], ['elec-alarm-buzzer', S.BUZZER], ['elec-solar-toy', S.SOLAR_PANEL],
    ['elec-radio-receiver', S.ANTENNA], ['elec-radio-receiver', S.DEMODULATOR], ['elec-radio-receiver', S.SPEAKER],
    ['chem-beaker-setup', S.LAB_BEAKER], ['chem-balance-scale', S.LEVER_ARM], ['chem-balance-scale', S.BALANCE_PAN],
    ['phys-lever-class1', S.LEVER_ARM], ['phys-inclined-plane', S.RAMP_SURFACE], ['phys-magnet-compass', S.COMPASS_NEEDLE],
    ['phys-prism-light', S.OPTICAL_PRISM],
  ] as const)('%s contient son composant essentiel %s', (id, shape) => {
    expect(count(id, shape)).toBeGreaterThan(0);
    expect(count(id, S.PENDULUM_BOB)).toBe(0);
  });
  it.each(['chem-water-molecule', 'chem-co2-molecule'])('%s : chaque liaison rejoint les centres de ses deux atomes', (id) => {
    const bp = get(id);
    for (const bond of bp.parts.filter((p) => p.bond)) {
      const ends = [-1, 1].map((sign) => new Vector3(0, sign * bond.scale[2] / 2, 0)
        .applyEuler(new Euler(...(bond.targetRot ?? [0, 0, 0]))).add(new Vector3(...bond.targetPos)));
      for (const atomId of bond.bond!.atoms) {
        const atom = bp.parts.find((p) => p.id === atomId)!;
        expect(Math.min(...ends.map((end) => end.distanceTo(new Vector3(...atom.targetPos))))).toBeLessThan(1e-6);
      }
    }
  });
  it.each(VEHICLE_BLUEPRINTS.filter((bp) => bp.experiment || bp.category === 'aerospatiale'))('$id : métadonnées et pièces traduites sans fallback', (bp) => {
    expect(bp.nameEn).toBeTruthy(); expect(bp.subtitleEn).toBeTruthy(); expect(bp.discoveryEn).toBeTruthy();
    for (const p of bp.parts) {
      const en = getLocalizedBlueprint(bp, 'en').parts.find((entry) => entry.id === p.id)!;
      expect(en.name).toBeTruthy(); expect(en.roleHint).toBeTruthy();
      if (bp.experiment) { expect(p.nameEn).toBeTruthy(); expect(p.roleHintEn).toBeTruthy(); }
      expect(p.nameAr).toBeTruthy(); expect(p.roleHintAr).toBeTruthy();
    }
  });
});
