export const VIRTUAL_LAB_GROUPS = {
  physics: ['newton', 'venturi', 'rocket', 'balance'],
  chemistry: ['phase', 'dna', 'slime', 'ph'],
  electronics: ['conductivity', 'resistance', 'logic'],
  nature: ['capillary', 'erosion'],
} as const;

export type VirtualLabId = (typeof VIRTUAL_LAB_GROUPS)[keyof typeof VIRTUAL_LAB_GROUPS][number];
export type VirtualLabTrial = { id: VirtualLabId; settings: readonly number[]; outcome: number };
type Model = { start: readonly number[]; sizes: readonly number[]; success: number };
export const VIRTUAL_LAB_MODELS = {
  newton: { start: [0], sizes: [3], success: 2 },
  venturi: { start: [0, 0, 0, 0], sizes: [3, 2, 2, 2], success: 2 },
  rocket: { start: [0, 0], sizes: [3, 3], success: 3 },
  balance: { start: [2, 1], sizes: [3, 2], success: 2 },
  phase: { start: [0], sizes: [3], success: 1 },
  dna: { start: [0], sizes: [4], success: 4 },
  slime: { start: [0], sizes: [3], success: 1 },
  ph: { start: [0, 1], sizes: [3, 3], success: 3 },
  conductivity: { start: [0], sizes: [4], success: 1 },
  resistance: { start: [2], sizes: [3], success: 1 },
  logic: { start: [0, 0, 0], sizes: [3, 2, 2], success: 3 },
  capillary: { start: [0, 0], sizes: [2, 2], success: 2 },
  erosion: { start: [0, 0], sizes: [3, 2], success: 2 },
} as const satisfies Record<VirtualLabId, Model>;

/** Outcomes of simplified qualitative models, not measurements of real equipment. */
export function runVirtualLab(id: VirtualLabId, settings: readonly number[], previous = 0): number {
  const a = settings[0] ?? 0;
  const b = settings[1] ?? 0;
  const c = settings[2] ?? 0;
  switch (id) {
    case 'newton': return a;
    case 'venturi': return c === 1 ? 3 + (settings[3] ?? 0) : a === 0 ? 0 : b === 0 || a === 1 ? 1 : 2;
    case 'rocket': return a === 0 ? 0 : b !== 1 ? 1 : a === 2 ? 2 : 3;
    case 'balance': return a === 2 ? 0 : b === 1 || a === 1 ? 1 : 2;
    case 'phase':
    case 'slime': return a;
    case 'dna': return a === previous && previous < 4 ? previous + 1 : previous;
    case 'ph': return a === 2 && b === 2 ? 3 : a;
    case 'conductivity': return a === 2 ? 1 : 0;
    case 'resistance': return a;
    case 'logic': {
      const on = a === 0 ? Boolean(b && c) : a === 1 ? Boolean(b || c) : !b;
      return on ? a + 1 : 0;
    }
    case 'capillary': return a === 0 ? 0 : b === 0 ? 1 : 2;
    case 'erosion': return a === 0 && b === 0 ? 0 : a === 1 || b === 0 ? 1 : 2;
  }
}
