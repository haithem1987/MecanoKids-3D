import * as THREE from 'three';
import { PartShapeKind, PartSpec, VehicleCategory } from '../types/game';

/**
 * Shapes representing outer shells, fairings, cabins, decks, hulls, or wings
 * that become translucent in X-Ray / Technical Cutaway mode so internal mechanical
 * organs (chassis, engines, turbines, axles, keels, rotors, nozzles) stay crisp and visible!
 */
const OUTER_SHELL_SHAPES = new Set<PartShapeKind>([
  PartShapeKind.CAR_CABIN,
  PartShapeKind.FIRE_TANK,
  PartShapeKind.F1_NOSE,
  PartShapeKind.F1_SIDEPODS,
  PartShapeKind.F1_FRONT_WING,
  PartShapeKind.F1_REAR_WING,
  PartShapeKind.BOAT_DECK,
  PartShapeKind.BOAT_CABIN,
  PartShapeKind.BOAT_SAIL,
  PartShapeKind.PLANE_FUSELAGE,
  PartShapeKind.PLANE_WING,
  PartShapeKind.DELTA_WING,
  PartShapeKind.HELI_CABIN,
  PartShapeKind.HELI_TAIL_BOOM,
  PartShapeKind.ROCKET_STAGE,
  PartShapeKind.ROCKET_FAIRING,
  PartShapeKind.SUB_HULL,
  PartShapeKind.CONNING_TOWER,
  PartShapeKind.TRAIN_BOILER,
]);

export function isOuterShellPartForXRay(spec: PartSpec, allParts: PartSpec[]): boolean {
  // Never hide 24K Gold rare collector parts in X-Ray mode
  if (spec.isRarePart) return false;
  if (OUTER_SHELL_SHAPES.has(spec.shape)) return true;

  // If a vehicle has glass cabin upper layers, make them translucent in X-Ray
  if (spec.dependsOn.length > 0 && spec.materialKind === 'glass_cabin') {
    return true;
  }

  const hasAnyExplicitShell = allParts.some(
    (p) =>
      !p.isRarePart &&
      (OUTER_SHELL_SHAPES.has(p.shape) ||
        (p.dependsOn.length > 0 && p.materialKind === 'glass_cabin')),
  );
  if (hasAnyExplicitShell) return false;

  const bodyUpperParts = allParts.filter(
    (p) => !p.isRarePart && p.dependsOn.length > 0 && p.materialKind === 'body',
  );
  if (bodyUpperParts.length > 0) {
    // Keep at least one internal/root part opaque if all upper parts are body
    return bodyUpperParts.some((p) => p.id === spec.id);
  }

  // Fallback for open-frame rovers/machines: make the uppermost non-rare mounted module translucent
  const nonRareDependent = allParts.filter((p) => !p.isRarePart && p.dependsOn.length > 0);
  const fallbackTarget = nonRareDependent[nonRareDependent.length - 1];
  return Boolean(fallbackTarget && fallbackTarget.id === spec.id);
}

export interface ThematicSceneArtifacts {
  /** Static perimeter props placed safely on the outer rim of the turntable */
  propsGroup: THREE.Group;
  /** Dynamic effects activated during 3D Test Drive (waves, headlights, speed lines, thruster plumes) */
  testDriveFxGroup: THREE.Group;
  /** Animated elements updated in the zero-GC render loop */
  animatedMeshes: {
    roadStripes: THREE.Mesh[];
    waterRings: THREE.Mesh[];
    thrusterFlames: THREE.Mesh[];
    beaconLights: THREE.Mesh[];
  };
}

export function buildThematicEnvironment(
  category: VehicleCategory,
  includePerimeterProps: boolean,
): ThematicSceneArtifacts {
  const propsGroup = new THREE.Group();
  const testDriveFxGroup = new THREE.Group();
  const roadStripes: THREE.Mesh[] = [];
  const waterRings: THREE.Mesh[] = [];
  const thrusterFlames: THREE.Mesh[] = [];
  const beaconLights: THREE.Mesh[] = [];

  const darkMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.55,
    metalness: 0.45,
  });
  const metalMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.3,
    metalness: 0.78,
  });

  if (category === VehicleCategory.CAR) {
    if (includePerimeterProps) {
      // Two sleek test-track telemetry bollards on the rear-sides of the turntable rim
      for (const side of [-1, 1]) {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.05, 0.44, 12),
          metalMat,
        );
        post.position.set(side * 2.12, 0.24, -0.92);
        post.castShadow = true;
        propsGroup.add(post);

        const lamp = new THREE.Mesh(
          new THREE.SphereGeometry(0.068, 12, 12),
          new THREE.MeshStandardMaterial({
            color: '#10b981',
            emissive: '#059669',
            emissiveIntensity: 0.55,
            roughness: 0.25,
          }),
        );
        lamp.position.set(side * 2.12, 0.49, -0.92);
        propsGroup.add(lamp);
        beaconLights.push(lamp);
      }
    }

    // Test-Drive FX: Scrolling speed stripes on road + warm volumetric headlight cones
    const stripeMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const stripeGeo = new THREE.PlaneGeometry(0.1, 0.48);
    stripeGeo.rotateX(-Math.PI / 2);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const dash = new THREE.Mesh(stripeGeo, stripeMat);
        dash.position.set(side * 1.18, 0.028, -1.65 + i * 1.1);
        dash.userData.baseZ = dash.position.z;
        testDriveFxGroup.add(dash);
        roadStripes.push(dash);
      }
    }

    const beamMat = new THREE.MeshBasicMaterial({
      color: '#fef08a',
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const beamGeo = new THREE.ConeGeometry(0.32, 1.25, 18, 1, true);
    beamGeo.rotateX(Math.PI / 2);
    for (const side of [-1, 1]) {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(side * 0.4, 0.34, 1.75);
      testDriveFxGroup.add(beam);
    }
  } else if (category === VehicleCategory.BOAT) {
    if (includePerimeterProps) {
      // Four harbor mooring bollards on the quay perimeter
      const brassMat = new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        roughness: 0.32,
        metalness: 0.72,
      });
      const angles = [0.68, 2.46, -0.68, -2.46];
      for (const ang of angles) {
        const bx = Math.cos(ang) * 2.34;
        const bz = Math.sin(ang) * 2.34;
        const bollard = new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.095, 0.2, 12),
          brassMat,
        );
        bollard.position.set(bx, 0.12, bz);
        propsGroup.add(bollard);
      }
    }

    // Animated 3D harbor wave & wake foam rings during Test Drive
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.95 + i * 0.5, 0.032, 10, 42),
        new THREE.MeshStandardMaterial({
          color: '#e0f2fe',
          emissive: '#38bdf8',
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.52 - i * 0.12,
          roughness: 0.2,
          depthWrite: false,
        }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.035;
      ring.userData.phase = i * 1.4;
      testDriveFxGroup.add(ring);
      waterRings.push(ring);
    }
  } else if (category === VehicleCategory.PLANE) {
    if (includePerimeterProps) {
      // Airfield runway edge threshold lights + mini windsock mast on outer rim
      for (const side of [-1, 1]) {
        for (const zPos of [-1.25, 0, 1.25]) {
          const lightBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.038, 0.05, 0.09, 10),
            darkMat,
          );
          lightBase.position.set(side * 2.02, 0.06, zPos);
          propsGroup.add(lightBase);

          const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 10, 10),
            new THREE.MeshStandardMaterial({
              color: zPos > 0 ? '#10b981' : '#38bdf8',
              emissive: zPos > 0 ? '#059669' : '#0284c7',
              emissiveIntensity: 0.65,
            }),
          );
          bulb.position.set(side * 2.02, 0.125, zPos);
          propsGroup.add(bulb);
          beaconLights.push(bulb);
        }
      }

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.035, 0.68, 10), metalMat);
      pole.position.set(-2.14, 0.36, -1.05);
      propsGroup.add(pole);
      const sock = new THREE.Mesh(
        new THREE.ConeGeometry(0.078, 0.32, 12),
        new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.5 }),
      );
      sock.rotation.z = Math.PI / 2;
      sock.position.set(-1.98, 0.64, -1.05);
      propsGroup.add(sock);
    }

    // Aerodynamic slipstream ribbons during flight Test Drive
    const streamMat = new THREE.MeshBasicMaterial({
      color: '#bae6fd',
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const streamGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.72, 8);
    streamGeo.rotateX(Math.PI / 2);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const streak = new THREE.Mesh(streamGeo, streamMat);
        streak.position.set(side * (1.15 + i * 0.2), 0.72 + (i % 2) * 0.26, -1.2 + i * 1.1);
        streak.userData.baseZ = streak.position.z;
        testDriveFxGroup.add(streak);
        roadStripes.push(streak);
      }
    }
  } else if (category === VehicleCategory.CONSTRUCTION) {
    if (includePerimeterProps) {
      // Four safety cones around the outer construction pad
      const orangeMat = new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.45 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 });
      const angles = [0.7, 2.44, -0.7, -2.44];
      for (const ang of angles) {
        const coneGrp = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.22), darkMat);
        base.position.y = 0.035;
        coneGrp.add(base);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.082, 0.27, 14), orangeMat);
        cone.position.y = 0.175;
        coneGrp.add(cone);
        const band = new THREE.Mesh(
          new THREE.CylinderGeometry(0.044, 0.062, 0.065, 14),
          whiteMat,
        );
        band.position.y = 0.19;
        coneGrp.add(band);
        coneGrp.position.set(Math.cos(ang) * 2.24, 0, Math.sin(ang) * 2.24);
        propsGroup.add(coneGrp);
      }
    }

    // Active workzone track indicators during Test Drive
    const stripeMat = new THREE.MeshBasicMaterial({
      color: '#f59e0b',
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const stripeGeo = new THREE.PlaneGeometry(0.12, 0.38);
    stripeGeo.rotateX(-Math.PI / 2);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const dash = new THREE.Mesh(stripeGeo, stripeMat);
        dash.position.set(side * 1.2, 0.028, -1.6 + i * 1.05);
        dash.userData.baseZ = dash.position.z;
        testDriveFxGroup.add(dash);
        roadStripes.push(dash);
      }
    }
  } else {
    // SPACE: Orbital launchpad umbilical/lightning towers + luminous plasma exhaust plumes
    if (includePerimeterProps) {
      for (const side of [-1, 1]) {
        const tower = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.07, 0.92, 8),
          metalMat,
        );
        tower.position.set(side * 2.1, 0.48, -0.95);
        propsGroup.add(tower);

        const tip = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 10, 10),
          new THREE.MeshStandardMaterial({
            color: '#38bdf8',
            emissive: '#0284c7',
            emissiveIntensity: 0.75,
          }),
        );
        tip.position.set(side * 2.1, 0.96, -0.95);
        propsGroup.add(tip);
        beaconLights.push(tip);
      }
    }

    // Luminous plasma thruster plume + shockwave ring for Space Test Drive!
    const outerPlume = new THREE.Mesh(
      new THREE.ConeGeometry(0.52, 1.35, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: '#f97316',
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    outerPlume.position.set(0, 0.42, 0);
    testDriveFxGroup.add(outerPlume);
    thrusterFlames.push(outerPlume);

    const innerCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.26, 0.95, 16),
      new THREE.MeshBasicMaterial({
        color: '#bae6fd',
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    innerCore.position.set(0, 0.52, 0);
    testDriveFxGroup.add(innerCore);
    thrusterFlames.push(innerCore);

    const shockRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.04, 10, 36),
      new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    shockRing.rotation.x = Math.PI / 2;
    shockRing.position.y = 0.04;
    shockRing.userData.phase = 0;
    testDriveFxGroup.add(shockRing);
    waterRings.push(shockRing);
  }

  return {
    propsGroup,
    testDriveFxGroup,
    animatedMeshes: {
      roadStripes,
      waterRings,
      thrusterFlames,
      beaconLights,
    },
  };
}
