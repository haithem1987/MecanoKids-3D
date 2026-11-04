/**
 * Palettes vives pour véhicules Octo Gears.
 * Valeurs hex calculées depuis oklch (chroma ≥ 0.20, luminosité 55–75 %).
 * Utilisées dans les BlueprintSeed comme primaryColor / secondaryColor / accentColor.
 */
export interface VividPalette {
  primary: string;
  secondary: string;
  accent: string;
}

// oklch(65% 0.26 25)  → rouge corail
// oklch(30% 0.15 25)  → bordeaux sombre
// oklch(80% 0.18 85)  → jaune doux
export const PALETTE_CORAL: VividPalette = {
  primary: '#f04b2d',
  secondary: '#5c1a0e',
  accent: '#f5c842',
};

// oklch(60% 0.22 185) → teal vif
// oklch(25% 0.12 185) → teal profond
// oklch(75% 0.20 55)  → ambre chaud
export const PALETTE_TEAL: VividPalette = {
  primary: '#1bb89a',
  secondary: '#0a3d35',
  accent: '#f0922b',
};

// oklch(60% 0.28 300) → violet électrique
// oklch(25% 0.15 300) → indigo sombre
// oklch(80% 0.22 90)  → vert lime
export const PALETTE_VIOLET: VividPalette = {
  primary: '#9333ea',
  secondary: '#2e1065',
  accent: '#a3e635',
};

// oklch(70% 0.24 130) → vert lime vif
// oklch(30% 0.12 130) → vert forêt
// oklch(75% 0.20 60)  → orange doux
export const PALETTE_LIME: VividPalette = {
  primary: '#65d526',
  secondary: '#1a3d0a',
  accent: '#fb923c',
};

// oklch(70% 0.20 65)  → ambre solaire
// oklch(30% 0.10 65)  → brun foncé
// oklch(80% 0.22 25)  → rose vif
export const PALETTE_AMBER: VividPalette = {
  primary: '#f59e0b',
  secondary: '#451a03',
  accent: '#f43f5e',
};
