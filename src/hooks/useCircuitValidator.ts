import { VehicleBlueprint, VehicleCategory } from '../types/game';

export interface CircuitValidationResult {
  isComplete: boolean;
  missingConnections: string[];
}

/**
 * Validates that an electronics blueprint has a complete circuit:
 * all components must be placed, and experiments must close their declared
 * terminal loop. Assembly prerequisites alone are not electrical connections.
 *
 * For non-electronics blueprints, always returns complete (positional snap
 * logic handles validation instead).
 */
export function validateCircuit(
  blueprint: VehicleBlueprint,
  placedPartIds: Set<string>,
): CircuitValidationResult {
  if (blueprint.category !== VehicleCategory.ELECTRONICS) {
    return { isComplete: true, missingConnections: [] };
  }

  const missing: string[] = blueprint.parts.filter((p) => !placedPartIds.has(p.id)).map((p) => p.id);

  for (const part of blueprint.parts) {
    if (!placedPartIds.has(part.id)) continue;
    for (const dep of part.dependsOn) {
      if (!placedPartIds.has(dep)) {
        missing.push(dep);
      }
    }
  }

  const loop = blueprint.experiment?.circuit;
  if (blueprint.experiment?.kind === 'circuit') {
    if (!loop || loop.length < 2 || new Set(loop).size !== loop.length) missing.push('circuit');
    else {
      const wires = blueprint.parts.filter((p) => p.electrical && placedPartIds.has(p.id));
      for (let i = 0; i < loop.length; i++) {
        const from = loop[i], to = loop[(i + 1) % loop.length];
        if (!wires.some((p) => p.electrical?.[0] === from && p.electrical[1] === to)) missing.push(`${from}:${to}`);
      }
      const reachable = new Set([loop[0]]);
      for (let round = 0; round < blueprint.parts.length; round++) {
        for (const wire of wires) {
          const [from, to] = wire.electrical!;
          if (reachable.has(from) || reachable.has(to)) { reachable.add(from); reachable.add(to); }
        }
      }
      for (const wire of wires) for (const id of wire.electrical!) {
        if (!blueprint.parts.some((p) => p.id === id) || !reachable.has(id)) missing.push(id);
      }
      for (const p of blueprint.parts) {
        if (p.id !== 'board' && p.id !== 'fan' && !p.electrical && !reachable.has(p.id)) missing.push(p.id);
      }
    }
  }

  return {
    isComplete: missing.length === 0,
    missingConnections: [...new Set(missing)],
  };
}

export function useCircuitValidator(
  blueprint: VehicleBlueprint | null,
  placedPartIds: Set<string>,
): CircuitValidationResult {
  if (!blueprint) return { isComplete: false, missingConnections: [] };
  return validateCircuit(blueprint, placedPartIds);
}
