export interface MissionI18n {
  fr: string;
  en: string;
  ar: string;
}

export interface Mission {
  readonly schemaVersion: 1;
  id: string;
  atelier: string;
  ages: [number, number];
  niveau: 1 | 2 | 3 | 4 | 5;
  vehicule: string;
  objectifs: MissionI18n[];
  etapes: MissionI18n[];
  conditionsReussite: MissionI18n[];
  explication: MissionI18n;
  defiTransfert?: MissionI18n;
}

export function isMissionI18n(v: unknown): v is MissionI18n {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.fr === 'string' && typeof o.en === 'string' && typeof o.ar === 'string';
}

export function validateMission(m: unknown): asserts m is Mission {
  if (typeof m !== 'object' || m === null) throw new Error('Mission must be an object');
  const o = m as Record<string, unknown>;
  if (o.schemaVersion !== 1) throw new Error(`${o.id}: schemaVersion must be 1`);
  if (typeof o.id !== 'string' || !o.id) throw new Error('Mission id must be a non-empty string');
  if (typeof o.atelier !== 'string') throw new Error(`${o.id}: atelier must be a string`);
  if (!Array.isArray(o.ages) || o.ages.length !== 2) throw new Error(`${o.id}: ages must be [min, max]`);
  if (![1, 2, 3, 4, 5].includes(o.niveau as number)) throw new Error(`${o.id}: niveau must be 1–5`);
  if (typeof o.vehicule !== 'string' || !o.vehicule) throw new Error(`${o.id}: vehicule must be a string`);
  if (!Array.isArray(o.objectifs)) throw new Error(`${o.id}: objectifs must be an array`);
  if (!Array.isArray(o.etapes)) throw new Error(`${o.id}: etapes must be an array`);
  if (!Array.isArray(o.conditionsReussite)) throw new Error(`${o.id}: conditionsReussite must be an array`);
  if (!isMissionI18n(o.explication)) throw new Error(`${o.id}: explication must be {fr,en,ar}`);
  if (o.defiTransfert !== undefined && !isMissionI18n(o.defiTransfert))
    throw new Error(`${o.id}: defiTransfert must be {fr,en,ar}`);
}
