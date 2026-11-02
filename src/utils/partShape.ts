/** Returns an inline SVG string (40×40) for a part's roleHint and primary color. */
export function getPartShapeSvg(roleHint: string, color: string): string {
  const r = roleHint.toLowerCase();
  const fill = color;
  const stroke = 'rgba(0,0,0,0.18)';

  if (r.includes('roue') || r.includes('wheel') || r.includes('tire') || r.includes('pneu')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><circle cx="20" cy="20" r="8" fill="white" stroke="${stroke}" stroke-width="1.5"/></svg>`;
  }
  if (r.includes('châssis') || r.includes('chassis') || r.includes('frame') || r.includes('cadre')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="2" y="13" width="36" height="14" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><ellipse cx="11" cy="20" rx="4" ry="4" fill="white" stroke="${stroke}" stroke-width="1"/><ellipse cx="29" cy="20" rx="4" ry="4" fill="white" stroke="${stroke}" stroke-width="1"/></svg>`;
  }
  if (r.includes('moteur') || r.includes('engine') || r.includes('motor')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="8" y="10" width="24" height="20" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><rect x="2" y="14" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/><rect x="2" y="21" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/><rect x="32" y="14" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/><rect x="32" y="21" width="6" height="5" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/></svg>`;
  }
  if (r.includes('habitacle') || r.includes('cab') || r.includes('cockpit') || r.includes('cabine')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="8,30 32,30 28,12 12,12" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/></svg>`;
  }
  if (r.includes('hélice') || r.includes('helice') || r.includes('propeller') || r.includes('propulseur')) {
    return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="20" cy="11" rx="5" ry="9" fill="${fill}" stroke="${stroke}" stroke-width="1.2" transform="rotate(0 20 20)"/><ellipse cx="20" cy="11" rx="5" ry="9" fill="${fill}" stroke="${stroke}" stroke-width="1.2" transform="rotate(120 20 20)"/><ellipse cx="20" cy="11" rx="5" ry="9" fill="${fill}" stroke="${stroke}" stroke-width="1.2" transform="rotate(240 20 20)"/><circle cx="20" cy="20" r="3.5" fill="white" stroke="${stroke}" stroke-width="1"/></svg>`;
  }
  return `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="20,3 37,20 20,37 3,20" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/></svg>`;
}
