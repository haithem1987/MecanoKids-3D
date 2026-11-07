import { VehicleBlueprint } from '../types/game';

export interface DiagnosticMissionPlan {
  blueprintId: string;
  /** Initial properly assembled parts when the repair starts */
  initialPlacedPartIds: string[];
  /** 1 or 2 mal-mounted / loosened parts rendered on the 3D vehicle to inspect & click to extract */
  initialFaultyPartIds: string[];
  /** Total parts requiring intervention (faulty to extract & re-seat + missing in tray) */
  targetInterventionsCount: number;
}

/**
 * Builds a Diagnostic & Repair scenario for any blueprint:
 * Keeps structural roots intact, flags 1–2 mounted parts as loosened/faulty on the 3D model,
 * and leaves upper/outer parts missing in the workbench tray. Large builds scale up to at least eight interventions.
 */
export function createDiagnosticMission(
  blueprint: VehicleBlueprint,
  seedOffset = 0,
): DiagnosticMissionPlan {
  const parts = blueprint.parts;
  const total = parts.length;

  // Build reverse dependency map so if a part is missing or faulty, none of its dependents stay floating as "validly placed"
  const dependentsOf = new Map<string, string[]>();
  for (const p of parts) {
    dependentsOf.set(p.id, []);
  }
  for (const p of parts) {
    for (const dep of p.dependsOn) {
      const arr = dependentsOf.get(dep);
      if (arr) arr.push(p.id);
    }
  }

  // Leaf parts (parts that nothing else depends on) are ideal candidates for missing & faulty components!
  const leafParts = parts.filter((p) => (dependentsOf.get(p.id)?.length ?? 0) === 0);

  const desiredTotalIssues = Math.min(Math.max(1,total-1), total <= 5 ? 2 : total < 20 ? 3 : total < 40 ? 5 : 8);
  const selectedIssueIds: string[] = [];

  if (leafParts.length >= desiredTotalIssues) {
    // Rotate selection deterministically using seedOffset so replaying varies the breakdown!
    for (let i = 0; i < desiredTotalIssues; i++) {
      const idx = (leafParts.length - 1 - i + seedOffset) % leafParts.length;
      const candidate = leafParts[(idx + leafParts.length) % leafParts.length];
      if (candidate && !selectedIssueIds.includes(candidate.id)) {
        selectedIssueIds.push(candidate.id);
      }
    }
  } else {
    // Take leaves first, then walk backwards from the end of blueprint.parts (excluding index 0 root)
    for (const lp of leafParts) {
      if (selectedIssueIds.length < desiredTotalIssues) {
        selectedIssueIds.push(lp.id);
      }
    }
    for (let i = parts.length - 1; i >= 1 && selectedIssueIds.length < desiredTotalIssues; i--) {
      const p = parts[i];
      if (!selectedIssueIds.includes(p.id)) {
        selectedIssueIds.push(p.id);
      }
    }
  }

  // Ensure any part that transitively depends on an issue part is also detached so dependencies stay 100% consistent
  const detachedSet = new Set<string>(selectedIssueIds);
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of parts) {
      if (!detachedSet.has(p.id) && p.dependsOn.some((d) => detachedSet.has(d))) {
        detachedSet.add(p.id);
        changed = true;
      }
    }
  }

  const detachedOrdered = parts.filter((p) => detachedSet.has(p.id)).map((p) => p.id);
  const initialPlacedPartIds = parts.filter((p) => !detachedSet.has(p.id)).map((p) => p.id);

  // Among the detached parts whose dependencies ARE already in initialPlacedPartIds, mark 1 or 2 as visibly "mal-mounted / faulty" on the 3D vehicle!
  const placedSet = new Set(initialPlacedPartIds);
  const readyDetached = detachedOrdered.filter((id) => {
    const spec = parts.find((p) => p.id === id);
    return spec ? spec.dependsOn.every((d) => placedSet.has(d)) : false;
  });

  const faultyCount = Math.min(readyDetached.length, detachedOrdered.length >= 3 ? 2 : 1);
  const initialFaultyPartIds = readyDetached.slice(0, Math.max(1, faultyCount));

  return {
    blueprintId: blueprint.id,
    initialPlacedPartIds,
    initialFaultyPartIds,
    targetInterventionsCount: detachedOrdered.length,
  };
}
