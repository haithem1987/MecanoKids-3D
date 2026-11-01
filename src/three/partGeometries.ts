import * as THREE from 'three';
import { PartShapeKind, PartSpec, VisualStyleMode } from '../types/game';
import { createPartMaterialSet, PartMaterialSet } from './materials';

function makeRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  const radius = Math.min(r, hw * 0.45, hh * 0.45);

  shape.moveTo(-hw + radius, -hh);
  shape.lineTo(hw - radius, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + radius);
  shape.lineTo(hw, hh - radius);
  shape.quadraticCurveTo(hw, hh, hw - radius, hh);
  shape.lineTo(-hw + radius, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - radius);
  shape.lineTo(-hw, -hh + radius);
  shape.quadraticCurveTo(-hw, -hh, -hw + radius, -hh);
  return shape;
}

function makeBeveledBox(w: number, h: number, d: number, bevel = 0.045): THREE.BufferGeometry {
  const shape = makeRoundedRectShape(w, h, bevel * 1.4);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.05, d - bevel * 2),
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
  });
  geo.center();
  return geo;
}

function addStyleAccents(
  group: THREE.Group,
  topWidth: number,
  topY: number,
  topDepth: number,
  style: VisualStyleMode,
  mats: PartMaterialSet,
): void {
  if (style === VisualStyleMode.BLOCKS) {
    const studGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16);
    const cols = Math.max(1, Math.min(5, Math.floor(topWidth / 0.36)));
    const rows = Math.max(1, Math.min(4, Math.floor(topDepth / 0.36)));
    for (let ix = 0; ix < cols; ix++) {
      for (let iz = 0; iz < rows; iz++) {
        const stud = new THREE.Mesh(studGeo, mats.primary);
        const x = cols === 1 ? 0 : (ix / (cols - 1) - 0.5) * (topWidth * 0.65);
        const z = rows === 1 ? 0 : (iz / (rows - 1) - 0.5) * (topDepth * 0.65);
        stud.position.set(x, topY + 0.04, z);
        stud.castShadow = true;
        group.add(stud);
      }
    }
  } else if (style === VisualStyleMode.WOOD) {
    const dowelGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.03, 14);
    const offsets = [
      [-topWidth * 0.32, -topDepth * 0.3],
      [topWidth * 0.32, -topDepth * 0.3],
      [-topWidth * 0.32, topDepth * 0.3],
      [topWidth * 0.32, topDepth * 0.3],
    ];
    for (const [ox, oz] of offsets) {
      if (Math.abs(ox) > 0.08 && Math.abs(oz) > 0.08) {
        const pin = new THREE.Mesh(dowelGeo, mats.metalAccent);
        pin.position.set(ox, topY + 0.015, oz);
        group.add(pin);
      }
    }
  } else {
    const rivetGeo = new THREE.SphereGeometry(0.032, 10, 10);
    const offsets = [
      [-topWidth * 0.38, -topDepth * 0.36],
      [topWidth * 0.38, -topDepth * 0.36],
      [-topWidth * 0.38, topDepth * 0.36],
      [topWidth * 0.38, topDepth * 0.36],
    ];
    for (const [ox, oz] of offsets) {
      if (Math.abs(ox) > 0.07 && Math.abs(oz) > 0.07) {
        const rivet = new THREE.Mesh(rivetGeo, mats.metalAccent);
        rivet.position.set(ox, topY + 0.01, oz);
        group.add(rivet);
      }
    }
  }
}

function buildSingleWheel(radius: number, width: number, mats: PartMaterialSet): THREE.Group {
  const wheel = new THREE.Group();

  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, mats.darkRubber);
  tire.castShadow = true;
  tire.receiveShadow = true;
  wheel.add(tire);

  const rimGeo = new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, width * 1.05, 18);
  rimGeo.rotateZ(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, mats.metalAccent);
  wheel.add(rim);

  const hubGeo = new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, width * 1.14, 12);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, mats.secondary);
  wheel.add(hub);

  return wheel;
}

export function buildPartMeshGroup(
  spec: PartSpec,
  style: VisualStyleMode,
  isSoftwareGl: boolean,
  maxAnisotropy: number,
  overrideMaterial?: THREE.Material,
): THREE.Group {
  const baseMats = createPartMaterialSet(spec, style, isSoftwareGl, maxAnisotropy);
  const mats: PartMaterialSet = overrideMaterial
    ? {
        primary: overrideMaterial,
        secondary: overrideMaterial,
        darkRubber: overrideMaterial,
        metalAccent: overrideMaterial,
        glass: overrideMaterial,
      }
    : baseMats;

  const root = new THREE.Group();
  const [sx, sy, sz] = spec.scale;

  switch (spec.shape) {
    case PartShapeKind.CAR_CHASSIS: {
      const mainDeck = new THREE.Mesh(makeBeveledBox(sx, sy, sz, 0.05), mats.primary);
      mainDeck.castShadow = true;
      mainDeck.receiveShadow = true;
      root.add(mainDeck);

      const frontBumper = new THREE.Mesh(
        makeBeveledBox(sx * 1.04, sy * 0.55, 0.22, 0.03),
        mats.metalAccent,
      );
      frontBumper.position.set(0, -sy * 0.1, sz * 0.5);
      root.add(frontBumper);

      const rearBumper = new THREE.Mesh(
        makeBeveledBox(sx * 1.04, sy * 0.55, 0.22, 0.03),
        mats.metalAccent,
      );
      rearBumper.position.set(0, -sy * 0.1, -sz * 0.5);
      root.add(rearBumper);

      // Headlights
      const lampGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16);
      lampGeo.rotateX(Math.PI / 2);
      for (const side of [-1, 1]) {
        const lamp = new THREE.Mesh(lampGeo, mats.glass);
        lamp.position.set(side * sx * 0.33, sy * 0.12, sz * 0.52);
        root.add(lamp);
      }

      if (!overrideMaterial) {
        addStyleAccents(root, sx * 0.85, sy * 0.5, sz * 0.85, style, mats);
      }
      break;
    }

    case PartShapeKind.WHEEL_AXLE: {
      const axleLen = sx;
      const wheelRadius = sy * 0.5;
      const wheelWidth = Math.max(0.24, sz * 0.36);

      const rodGeo = new THREE.CylinderGeometry(0.075, 0.075, axleLen, 14);
      rodGeo.rotateZ(Math.PI / 2);
      const rod = new THREE.Mesh(rodGeo, mats.metalAccent);
      root.add(rod);

      const diffBox = new THREE.Mesh(makeBeveledBox(0.32, 0.26, 0.28, 0.03), mats.secondary);
      root.add(diffBox);

      const leftW = buildSingleWheel(wheelRadius, wheelWidth, mats);
      leftW.position.set(-axleLen * 0.48, 0, 0);
      root.add(leftW);

      const rightW = buildSingleWheel(wheelRadius, wheelWidth, mats);
      rightW.position.set(axleLen * 0.48, 0, 0);
      root.add(rightW);
      break;
    }

    case PartShapeKind.CAR_CABIN: {
      const shape = new THREE.Shape();
      shape.moveTo(-sz * 0.5, -sy * 0.5);
      shape.lineTo(sz * 0.5, -sy * 0.5);
      shape.lineTo(sz * 0.28, sy * 0.5);
      shape.lineTo(-sz * 0.38, sy * 0.5);
      shape.closePath();

      const cabinGeo = new THREE.ExtrudeGeometry(shape, {
        depth: sx * 0.9,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 3,
      });
      cabinGeo.center();
      cabinGeo.rotateY(Math.PI / 2);

      const frame = new THREE.Mesh(cabinGeo, mats.primary);
      frame.castShadow = true;
      root.add(frame);

      const glassBox = new THREE.Mesh(
        makeBeveledBox(sx * 0.94, sy * 0.62, sz * 0.72, 0.03),
        mats.glass,
      );
      glassBox.position.set(0, -sy * 0.03, 0.03);
      glassBox.renderOrder = 2;
      root.add(glassBox);

      // Interior seat silhouette
      const seat = new THREE.Mesh(
        makeBeveledBox(sx * 0.55, sy * 0.42, 0.24, 0.02),
        mats.secondary,
      );
      seat.position.set(0, -sy * 0.18, -0.08);
      root.add(seat);

      if (!overrideMaterial) {
        addStyleAccents(root, sx * 0.7, sy * 0.52, sz * 0.5, style, mats);
      }
      break;
    }

    case PartShapeKind.ENGINE_BLOCK: {
      const block = new THREE.Mesh(makeBeveledBox(sx, sy * 0.72, sz, 0.04), mats.secondary);
      block.castShadow = true;
      root.add(block);

      const cylGeo = new THREE.CylinderGeometry(0.11, 0.11, sy * 0.45, 14);
      for (const side of [-1, 1]) {
        for (const zOff of [-sz * 0.24, sz * 0.24]) {
          const piston = new THREE.Mesh(cylGeo, mats.metalAccent);
          piston.position.set(side * sx * 0.28, sy * 0.35, zOff);
          piston.rotation.z = side * -0.35;
          root.add(piston);
        }
      }

      const intake = new THREE.Mesh(
        makeBeveledBox(sx * 0.46, 0.16, sz * 0.78, 0.025),
        mats.primary,
      );
      intake.position.set(0, sy * 0.48, 0);
      root.add(intake);
      break;
    }

    case PartShapeKind.FIRE_TANK: {
      const tankMain = new THREE.Mesh(makeBeveledBox(sx, sy, sz, 0.06), mats.primary);
      tankMain.castShadow = true;
      root.add(tankMain);

      // Side roll-up shutter doors
      for (const side of [-1, 1]) {
        const shutter = new THREE.Mesh(
          makeBeveledBox(0.05, sy * 0.65, sz * 0.72, 0.015),
          mats.metalAccent,
        );
        shutter.position.set(side * (sx * 0.51), -0.02, 0);
        root.add(shutter);
      }

      const hoseReelGeo = new THREE.CylinderGeometry(0.2, 0.2, sx * 0.75, 18);
      hoseReelGeo.rotateZ(Math.PI / 2);
      const hoseReel = new THREE.Mesh(hoseReelGeo, mats.secondary);
      hoseReel.position.set(0, 0.08, -sz * 0.52);
      root.add(hoseReel);

      if (!overrideMaterial) {
        addStyleAccents(root, sx * 0.8, sy * 0.5, sz * 0.8, style, mats);
      }
      break;
    }

    case PartShapeKind.FIRE_LADDER: {
      const baseTurntable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.42, 0.16, 20),
        mats.secondary,
      );
      baseTurntable.position.set(0, -sy * 0.35, -sz * 0.25);
      root.add(baseTurntable);

      const ladderGroup = new THREE.Group();
      const railGeo = makeBeveledBox(0.08, 0.12, sz, 0.02);
      for (const side of [-1, 1]) {
        const rail = new THREE.Mesh(railGeo, mats.metalAccent);
        rail.position.set(side * (sx * 0.38), 0, 0);
        rail.castShadow = true;
        ladderGroup.add(rail);
      }

      const rungGeo = new THREE.CylinderGeometry(0.028, 0.028, sx * 0.76, 10);
      rungGeo.rotateZ(Math.PI / 2);
      const rungs = 8;
      for (let i = 0; i < rungs; i++) {
        const rung = new THREE.Mesh(rungGeo, mats.primary);
        rung.position.set(0, 0, (i / (rungs - 1) - 0.5) * (sz * 0.86));
        ladderGroup.add(rung);
      }

      ladderGroup.rotation.x = -0.22;
      ladderGroup.position.set(0, sy * 0.15, 0.1);
      root.add(ladderGroup);
      break;
    }

    case PartShapeKind.LIGHT_BAR: {
      const barBase = new THREE.Mesh(
        makeBeveledBox(sx, sy * 0.45, sz, 0.02),
        mats.metalAccent,
      );
      root.add(barBase);

      for (const side of [-1, 1]) {
        const beacon = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.14, sy * 0.8, 16),
          mats.glass,
        );
        beacon.position.set(side * sx * 0.32, sy * 0.35, 0);
        beacon.renderOrder = 2;
        root.add(beacon);

        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 12, 12),
          mats.primary,
        );
        core.position.set(side * sx * 0.32, sy * 0.32, 0);
        root.add(core);
      }
      break;
    }

    case PartShapeKind.F1_NOSE: {
      const shape = new THREE.Shape();
      shape.moveTo(-sz * 0.5, -sy * 0.45);
      shape.lineTo(sz * 0.5, -sy * 0.45);
      shape.lineTo(sz * 0.5, -sy * 0.08);
      shape.lineTo(-sz * 0.5, sy * 0.5);
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: sx * 0.82,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 3,
      });
      geo.center();
      geo.rotateY(Math.PI / 2);
      const nose = new THREE.Mesh(geo, mats.primary);
      nose.castShadow = true;
      root.add(nose);
      break;
    }

    case PartShapeKind.F1_FRONT_WING: {
      const mainPlane = new THREE.Mesh(
        makeBeveledBox(sx, sy * 0.35, sz * 0.7, 0.025),
        mats.primary,
      );
      mainPlane.castShadow = true;
      root.add(mainPlane);

      const upperFlap = new THREE.Mesh(
        makeBeveledBox(sx * 0.92, sy * 0.25, sz * 0.42, 0.02),
        mats.secondary,
      );
      upperFlap.position.set(0, sy * 0.22, -sz * 0.14);
      upperFlap.rotation.x = 0.2;
      root.add(upperFlap);

      for (const side of [-1, 1]) {
        const endplate = new THREE.Mesh(
          makeBeveledBox(0.06, sy * 1.1, sz, 0.015),
          mats.primary,
        );
        endplate.position.set(side * sx * 0.49, sy * 0.25, 0);
        root.add(endplate);
      }
      break;
    }

    case PartShapeKind.F1_REAR_WING: {
      for (const side of [-1, 1]) {
        const plate = new THREE.Mesh(
          makeBeveledBox(0.07, sy, sz, 0.02),
          mats.primary,
        );
        plate.position.set(side * sx * 0.47, 0, 0);
        plate.castShadow = true;
        root.add(plate);
      }
      const lowerBeam = new THREE.Mesh(
        makeBeveledBox(sx * 0.94, 0.09, sz * 0.55, 0.02),
        mats.secondary,
      );
      lowerBeam.position.set(0, -sy * 0.22, 0);
      root.add(lowerBeam);

      const drsFlap = new THREE.Mesh(
        makeBeveledBox(sx * 0.94, 0.1, sz * 0.62, 0.02),
        mats.metalAccent,
      );
      drsFlap.position.set(0, sy * 0.32, -0.05);
      drsFlap.rotation.x = 0.22;
      root.add(drsFlap);
      break;
    }

    case PartShapeKind.F1_SIDEPODS: {
      for (const side of [-1, 1]) {
        const pod = new THREE.Mesh(
          makeBeveledBox(sx * 0.32, sy, sz, 0.05),
          mats.primary,
        );
        pod.position.set(side * sx * 0.34, 0, 0);
        pod.castShadow = true;
        root.add(pod);

        const intakeOpening = new THREE.Mesh(
          makeBeveledBox(sx * 0.22, sy * 0.65, 0.08, 0.015),
          mats.darkRubber,
        );
        intakeOpening.position.set(side * sx * 0.34, 0.02, sz * 0.49);
        root.add(intakeOpening);
      }
      break;
    }

    case PartShapeKind.F1_HALO: {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-sx * 0.42, -sy * 0.25, -sz * 0.4),
        new THREE.Vector3(-sx * 0.36, sy * 0.25, sz * 0.1),
        new THREE.Vector3(0, sy * 0.28, sz * 0.45),
        new THREE.Vector3(sx * 0.36, sy * 0.25, sz * 0.1),
        new THREE.Vector3(sx * 0.42, -sy * 0.25, -sz * 0.4),
      ]);
      const haloTube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 28, 0.055, 12, false),
        mats.metalAccent,
      );
      haloTube.castShadow = true;
      root.add(haloTube);

      const frontPillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.05, sy * 0.62, 12),
        mats.metalAccent,
      );
      frontPillar.position.set(0, 0, sz * 0.42);
      frontPillar.rotation.x = -0.25;
      root.add(frontPillar);

      const airbox = new THREE.Mesh(
        makeBeveledBox(sx * 0.46, sy * 0.72, sz * 0.48, 0.04),
        mats.primary,
      );
      airbox.position.set(0, sy * 0.15, -sz * 0.32);
      root.add(airbox);
      break;
    }

    case PartShapeKind.BOAT_HULL: {
      const hullShape = new THREE.Shape();
      hullShape.moveTo(-sx * 0.48, 0);
      hullShape.lineTo(-sx * 0.48, -sz * 0.48);
      hullShape.lineTo(sx * 0.48, -sz * 0.48);
      hullShape.lineTo(sx * 0.48, 0);
      hullShape.quadraticCurveTo(sx * 0.42, sz * 0.36, 0, sz * 0.52);
      hullShape.quadraticCurveTo(-sx * 0.42, sz * 0.36, -sx * 0.48, 0);

      const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
        depth: sy * 0.78,
        bevelEnabled: true,
        bevelThickness: 0.07,
        bevelSize: 0.07,
        bevelSegments: 4,
      });
      hullGeo.center();
      hullGeo.rotateX(Math.PI / 2);

      const hull = new THREE.Mesh(hullGeo, mats.primary);
      hull.castShadow = true;
      hull.receiveShadow = true;
      root.add(hull);

      const waterline = new THREE.Mesh(
        makeBeveledBox(sx * 0.98, sy * 0.22, sz * 0.88, 0.03),
        mats.secondary,
      );
      waterline.position.set(0, -sy * 0.3, -sz * 0.03);
      root.add(waterline);
      break;
    }

    case PartShapeKind.BOAT_KEEL: {
      const fin = new THREE.Mesh(
        makeBeveledBox(sx * 0.25, sy * 0.8, sz * 0.55, 0.025),
        mats.secondary,
      );
      fin.position.set(0, 0.06, 0);
      root.add(fin);

      const bulb = new THREE.Mesh(
        new THREE.CapsuleGeometry(sx * 0.26, sz * 0.55, 8, 16),
        mats.metalAccent,
      );
      bulb.rotation.x = Math.PI / 2;
      bulb.position.set(0, -sy * 0.36, 0);
      bulb.castShadow = true;
      root.add(bulb);
      break;
    }

    case PartShapeKind.BOAT_DECK: {
      const deck = new THREE.Mesh(
        makeBeveledBox(sx, sy, sz, 0.04),
        mats.primary,
      );
      deck.castShadow = true;
      deck.receiveShadow = true;
      root.add(deck);

      // Bollards
      const bollardGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.14, 12);
      for (const side of [-1, 1]) {
        const b = new THREE.Mesh(bollardGeo, mats.metalAccent);
        b.position.set(side * sx * 0.36, sy * 0.55, sz * 0.35);
        root.add(b);
      }

      if (!overrideMaterial) {
        addStyleAccents(root, sx * 0.8, sy * 0.5, sz * 0.78, style, mats);
      }
      break;
    }

    case PartShapeKind.BOAT_MAST: {
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.085, sy, 16),
        mats.metalAccent,
      );
      mast.castShadow = true;
      root.add(mast);

      const boom = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, sz, 12),
        mats.secondary,
      );
      boom.rotation.x = Math.PI / 2;
      boom.position.set(0, -sy * 0.3, -sz * 0.46);
      root.add(boom);

      const flag = new THREE.Mesh(
        makeBeveledBox(0.03, 0.16, 0.34, 0.01),
        mats.primary,
      );
      flag.position.set(0, sy * 0.48, -0.17);
      root.add(flag);
      break;
    }

    case PartShapeKind.BOAT_SAIL: {
      const sailShape = new THREE.Shape();
      sailShape.moveTo(0, -sy * 0.48);
      sailShape.lineTo(0, sy * 0.5);
      sailShape.quadraticCurveTo(-sz * 0.45, -sy * 0.05, -sz * 0.92, -sy * 0.46);
      sailShape.closePath();

      const sailGeo = new THREE.ExtrudeGeometry(sailShape, {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2,
      });
      sailGeo.center();
      sailGeo.rotateY(Math.PI / 2);

      const mainSail = new THREE.Mesh(sailGeo, mats.primary);
      mainSail.castShadow = true;
      root.add(mainSail);

      // Decorative stripe
      const stripe = new THREE.Mesh(
        makeBeveledBox(0.08, sy * 0.14, sz * 0.58, 0.01),
        mats.secondary,
      );
      stripe.position.set(0, -sy * 0.12, -sz * 0.08);
      root.add(stripe);
      break;
    }

    case PartShapeKind.BOAT_CABIN: {
      const lowerCabin = new THREE.Mesh(
        makeBeveledBox(sx, sy * 0.58, sz, 0.04),
        mats.primary,
      );
      lowerCabin.position.set(0, -sy * 0.2, 0);
      lowerCabin.castShadow = true;
      root.add(lowerCabin);

      const bridgeGlass = new THREE.Mesh(
        makeBeveledBox(sx * 0.92, sy * 0.42, sz * 0.85, 0.03),
        mats.glass,
      );
      bridgeGlass.position.set(0, sy * 0.22, sz * 0.05);
      bridgeGlass.renderOrder = 2;
      root.add(bridgeGlass);

      const roof = new THREE.Mesh(
        makeBeveledBox(sx * 1.02, 0.1, sz * 0.96, 0.02),
        mats.secondary,
      );
      roof.position.set(0, sy * 0.46, 0.03);
      root.add(roof);

      // Life buoy on side
      const buoy = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.045, 12, 20),
        mats.secondary,
      );
      buoy.rotation.y = Math.PI / 2;
      buoy.position.set(sx * 0.53, -sy * 0.15, 0);
      root.add(buoy);
      break;
    }

    case PartShapeKind.BOAT_CHIMNEY: {
      for (const side of [-1, 1]) {
        const stack = new THREE.Mesh(
          new THREE.CylinderGeometry(sx * 0.22, sx * 0.26, sy, 18),
          mats.primary,
        );
        stack.position.set(side * sx * 0.28, 0, 0);
        stack.rotation.x = -0.14;
        stack.castShadow = true;
        root.add(stack);

        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(sx * 0.23, sx * 0.23, sy * 0.22, 18),
          mats.darkRubber,
        );
        cap.position.set(side * sx * 0.28, sy * 0.4, -0.05);
        cap.rotation.x = -0.14;
        root.add(cap);
      }
      break;
    }

    case PartShapeKind.BOAT_PROPULSION: {
      const rudder = new THREE.Mesh(
        makeBeveledBox(0.08, sy * 0.85, sz * 0.48, 0.02),
        mats.secondary,
      );
      rudder.position.set(0, 0, -sz * 0.25);
      root.add(rudder);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, sz * 0.55, 12),
        mats.metalAccent,
      );
      shaft.rotation.x = Math.PI / 2;
      shaft.position.set(0, 0, sz * 0.18);
      root.add(shaft);

      for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(
          makeBeveledBox(0.04, sy * 0.42, 0.14, 0.01),
          mats.metalAccent,
        );
        const angle = (i / 3) * Math.PI * 2;
        blade.position.set(Math.cos(angle) * 0.14, Math.sin(angle) * 0.14, 0);
        blade.rotation.z = angle + Math.PI / 2;
        root.add(blade);
      }
      break;
    }

    case PartShapeKind.BOAT_FENDERS: {
      const tireGeo = new THREE.TorusGeometry(0.18, 0.075, 12, 20);
      const angles = [-0.55, 0, 0.55];
      for (const ang of angles) {
        const tire = new THREE.Mesh(tireGeo, mats.darkRubber);
        tire.position.set(Math.sin(ang) * sx * 0.44, 0, Math.cos(ang) * sz * 0.35 - sz * 0.2);
        tire.rotation.y = ang;
        tire.castShadow = true;
        root.add(tire);
      }
      break;
    }

    case PartShapeKind.BOAT_RADAR: {
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.08, sy * 0.82, 14),
        mats.metalAccent,
      );
      root.add(mast);

      const scanner = new THREE.Mesh(
        makeBeveledBox(sx, 0.1, 0.16, 0.02),
        mats.primary,
      );
      scanner.position.set(0, sy * 0.44, 0);
      root.add(scanner);

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 16),
        mats.secondary,
      );
      dome.position.set(0, sy * 0.12, 0.14);
      root.add(dome);
      break;
    }

    case PartShapeKind.BOAT_HELI_PAD: {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.5, sx * 0.46, sy, 24),
        mats.secondary,
      );
      disc.castShadow = true;
      disc.receiveShadow = true;
      root.add(disc);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(sx * 0.38, 0.03, 10, 28),
        mats.metalAccent,
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, sy * 0.52, 0);
      root.add(ring);

      // 'H' marking bars
      for (const side of [-1, 1]) {
        const vBar = new THREE.Mesh(makeBeveledBox(0.07, 0.03, sz * 0.36, 0.008), mats.primary);
        vBar.position.set(side * 0.14, sy * 0.52, 0);
        root.add(vBar);
      }
      const hBar = new THREE.Mesh(makeBeveledBox(0.32, 0.03, 0.07, 0.008), mats.primary);
      hBar.position.set(0, sy * 0.52, 0);
      root.add(hBar);
      break;
    }

    case PartShapeKind.BOAT_AFRAME: {
      for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.07, sy, 12),
          mats.primary,
        );
        leg.position.set(side * sx * 0.38, 0, 0);
        leg.rotation.z = side * 0.18;
        leg.castShadow = true;
        root.add(leg);
      }
      const crossBeam = new THREE.Mesh(
        makeBeveledBox(sx * 0.72, 0.12, 0.14, 0.02),
        mats.metalAccent,
      );
      crossBeam.position.set(0, sy * 0.45, 0);
      root.add(crossBeam);
      break;
    }

    case PartShapeKind.BOAT_CRANE: {
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.2, sy * 0.55, 16),
        mats.secondary,
      );
      pedestal.position.set(0, -sy * 0.2, 0.2);
      root.add(pedestal);

      const boom = new THREE.Mesh(
        makeBeveledBox(0.14, 0.14, sz, 0.025),
        mats.primary,
      );
      boom.position.set(0, sy * 0.22, -sz * 0.2);
      boom.rotation.x = 0.35;
      boom.castShadow = true;
      root.add(boom);

      const hookBlock = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        mats.metalAccent,
      );
      hookBlock.position.set(0, -0.05, -sz * 0.62);
      root.add(hookBlock);
      break;
    }

    case PartShapeKind.BOAT_ROV: {
      const rovBody = new THREE.Mesh(
        makeBeveledBox(sx, sy * 0.68, sz, 0.05),
        mats.primary,
      );
      rovBody.castShadow = true;
      root.add(rovBody);

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(sy * 0.28, 16, 16),
        mats.glass,
      );
      dome.position.set(0, 0, sz * 0.48);
      dome.renderOrder = 2;
      root.add(dome);

      for (const side of [-1, 1]) {
        const floatCyl = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.09, sz * 0.65, 8, 12),
          mats.secondary,
        );
        floatCyl.rotation.x = Math.PI / 2;
        floatCyl.position.set(side * sx * 0.42, sy * 0.35, 0);
        root.add(floatCyl);
      }
      break;
    }

    case PartShapeKind.PLANE_FUSELAGE: {
      const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(sx * 0.46, Math.max(0.4, sz - sx), 10, 20),
        mats.primary,
      );
      body.rotation.x = Math.PI / 2;
      body.scale.set(1, sy / sx, 1);
      body.castShadow = true;
      body.receiveShadow = true;
      root.add(body);

      const canopy = new THREE.Mesh(
        new THREE.CapsuleGeometry(sx * 0.34, sz * 0.26, 8, 16),
        mats.glass,
      );
      canopy.rotation.x = Math.PI / 2;
      canopy.position.set(0, sy * 0.36, sz * 0.06);
      canopy.renderOrder = 2;
      root.add(canopy);

      const noseCone = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.24, sx * 0.42, 0.26, 18),
        mats.secondary,
      );
      noseCone.rotation.x = Math.PI / 2;
      noseCone.position.set(0, 0, sz * 0.46);
      root.add(noseCone);

      if (!overrideMaterial) {
        addStyleAccents(root, sx * 0.55, sy * 0.45, sz * 0.5, style, mats);
      }
      break;
    }

    case PartShapeKind.PLANE_WING: {
      const wing = new THREE.Mesh(
        makeBeveledBox(sx, sy, sz, 0.035),
        mats.primary,
      );
      wing.castShadow = true;
      wing.receiveShadow = true;
      root.add(wing);

      const flap = new THREE.Mesh(
        makeBeveledBox(sx * 0.86, sy * 0.65, sz * 0.24, 0.015),
        mats.secondary,
      );
      flap.position.set(0, -0.01, -sz * 0.42);
      root.add(flap);

      for (const side of [-1, 1]) {
        const wingtip = new THREE.Mesh(
          new THREE.SphereGeometry(sy * 0.85, 12, 12),
          mats.metalAccent,
        );
        wingtip.position.set(side * sx * 0.5, 0.02, 0);
        root.add(wingtip);
      }

      if (!overrideMaterial) {
        addStyleAccents(root, sx * 0.85, sy * 0.52, sz * 0.6, style, mats);
      }
      break;
    }

    case PartShapeKind.PLANE_TAIL: {
      const hStab = new THREE.Mesh(
        makeBeveledBox(sx, 0.1, sz * 0.72, 0.02),
        mats.primary,
      );
      hStab.position.set(0, -sy * 0.32, 0);
      hStab.castShadow = true;
      root.add(hStab);

      const vFinShape = new THREE.Shape();
      vFinShape.moveTo(-sz * 0.45, -sy * 0.32);
      vFinShape.lineTo(sz * 0.42, -sy * 0.32);
      vFinShape.lineTo(-sz * 0.08, sy * 0.55);
      vFinShape.lineTo(-sz * 0.48, sy * 0.55);
      vFinShape.closePath();

      const vFinGeo = new THREE.ExtrudeGeometry(vFinShape, {
        depth: 0.09,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
      });
      vFinGeo.center();
      vFinGeo.rotateY(Math.PI / 2);

      const vFin = new THREE.Mesh(vFinGeo, mats.secondary);
      vFin.position.set(0, sy * 0.08, 0);
      vFin.castShadow = true;
      root.add(vFin);
      break;
    }

    case PartShapeKind.PLANE_LANDING_GEAR: {
      for (const side of [-1, 1]) {
        const strut = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, sy * 0.82, 12),
          mats.metalAccent,
        );
        strut.position.set(side * sx * 0.32, sy * 0.12, 0);
        strut.rotation.z = side * -0.36;
        root.add(strut);

        const wheel = buildSingleWheel(sy * 0.34, 0.16, mats);
        wheel.position.set(side * sx * 0.46, -sy * 0.22, 0);
        root.add(wheel);
      }

      const crossBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, sx * 0.88, 10),
        mats.metalAccent,
      );
      crossBar.rotation.z = Math.PI / 2;
      crossBar.position.set(0, -sy * 0.22, 0);
      root.add(crossBar);
      break;
    }

    case PartShapeKind.PLANE_PROPELLER: {
      const spinnerPoints = [
        new THREE.Vector2(0, 0.28),
        new THREE.Vector2(0.14, 0.18),
        new THREE.Vector2(0.2, 0),
        new THREE.Vector2(0, 0),
      ];
      const spinnerGeo = new THREE.LatheGeometry(spinnerPoints, 20);
      spinnerGeo.rotateX(Math.PI / 2);
      const spinner = new THREE.Mesh(spinnerGeo, mats.secondary);
      root.add(spinner);

      const bladeCount = 3;
      for (let i = 0; i < bladeCount; i++) {
        const angle = (i / bladeCount) * Math.PI * 2;
        const bladeHolder = new THREE.Group();
        bladeHolder.rotation.z = angle;

        const blade = new THREE.Mesh(
          makeBeveledBox(0.13, sy * 0.48, 0.035, 0.01),
          mats.darkRubber,
        );
        blade.position.set(0, sy * 0.26, 0.04);
        blade.rotation.y = 0.28;
        blade.castShadow = true;
        bladeHolder.add(blade);

        const tip = new THREE.Mesh(
          makeBeveledBox(0.135, 0.08, 0.04, 0.008),
          mats.metalAccent,
        );
        tip.position.set(0, sy * 0.47, 0.04);
        tip.rotation.y = 0.28;
        bladeHolder.add(tip);

        root.add(bladeHolder);
      }
      break;
    }

    case PartShapeKind.BIPLANE_STRUTS: {
      for (const side of [-1, 1]) {
        for (const zOff of [-sz * 0.26, sz * 0.26]) {
          const strut = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, sy, 10),
            mats.metalAccent,
          );
          strut.position.set(side * sx * 0.38, 0, zOff);
          strut.castShadow = true;
          root.add(strut);
        }
      }
      break;
    }

    case PartShapeKind.RADIAL_ENGINE: {
      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.32, sx * 0.34, sz, 18),
        mats.secondary,
      );
      core.rotation.x = Math.PI / 2;
      root.add(core);

      const cylinders = 7;
      for (let i = 0; i < cylinders; i++) {
        const ang = (i / cylinders) * Math.PI * 2;
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.08, sx * 0.32, 12),
          mats.metalAccent,
        );
        cyl.position.set(Math.cos(ang) * sx * 0.36, Math.sin(ang) * sy * 0.36, 0);
        cyl.rotation.z = ang - Math.PI / 2;
        cyl.castShadow = true;
        root.add(cyl);
      }
      break;
    }

    case PartShapeKind.HELI_SKIDS: {
      for (const side of [-1, 1]) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * sx * 0.44, -sy * 0.38, -sz * 0.46),
          new THREE.Vector3(side * sx * 0.44, -sy * 0.38, sz * 0.36),
          new THREE.Vector3(side * sx * 0.44, -sy * 0.14, sz * 0.5),
        ]);
        const runner = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 20, 0.05, 10, false),
          mats.metalAccent,
        );
        runner.castShadow = true;
        root.add(runner);

        for (const zOff of [-sz * 0.22, sz * 0.22]) {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, sy * 0.72, 10),
            mats.secondary,
          );
          leg.position.set(side * sx * 0.34, 0, zOff);
          leg.rotation.z = side * -0.32;
          root.add(leg);
        }
      }
      break;
    }

    case PartShapeKind.HELI_CABIN: {
      const fuselage = new THREE.Mesh(
        makeBeveledBox(sx, sy * 0.85, sz * 0.82, 0.12),
        mats.primary,
      );
      fuselage.position.set(0, 0, -sz * 0.08);
      fuselage.castShadow = true;
      root.add(fuselage);

      const noseBubble = new THREE.Mesh(
        new THREE.SphereGeometry(sx * 0.48, 20, 18),
        mats.glass,
      );
      noseBubble.scale.set(1, sy / sx * 0.78, 1.15);
      noseBubble.position.set(0, -0.02, sz * 0.25);
      noseBubble.renderOrder = 2;
      root.add(noseBubble);

      // Rescue cross emblem
      const crossH = new THREE.Mesh(makeBeveledBox(0.04, 0.12, 0.34, 0.008), mats.secondary);
      crossH.position.set(sx * 0.51, 0, -0.1);
      root.add(crossH);
      const crossV = new THREE.Mesh(makeBeveledBox(0.04, 0.34, 0.12, 0.008), mats.secondary);
      crossV.position.set(sx * 0.51, 0, -0.1);
      root.add(crossV);
      break;
    }

    case PartShapeKind.HELI_TAIL_BOOM: {
      const boom = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.28, sx * 0.45, sz, 16),
        mats.primary,
      );
      boom.rotation.x = Math.PI / 2;
      boom.castShadow = true;
      root.add(boom);

      const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.36, sx * 0.38, sz * 0.18, 16),
        mats.secondary,
      );
      stripe.rotation.x = Math.PI / 2;
      root.add(stripe);
      break;
    }

    case PartShapeKind.HELI_TAIL_ROTOR: {
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.14, 14),
        mats.metalAccent,
      );
      hub.rotation.z = Math.PI / 2;
      root.add(hub);

      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2;
        const holder = new THREE.Group();
        holder.rotation.x = ang;
        const blade = new THREE.Mesh(
          makeBeveledBox(0.03, sy * 0.46, 0.09, 0.008),
          mats.darkRubber,
        );
        blade.position.set(0.05, sy * 0.23, 0);
        holder.add(blade);
        root.add(holder);
      }
      break;
    }

    case PartShapeKind.HELI_TURBINE: {
      const housing = new THREE.Mesh(
        makeBeveledBox(sx, sy, sz, 0.06),
        mats.secondary,
      );
      housing.castShadow = true;
      root.add(housing);

      for (const side of [-1, 1]) {
        const exhaust = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.13, 0.26, 14),
          mats.metalAccent,
        );
        exhaust.rotation.x = Math.PI / 2;
        exhaust.position.set(side * sx * 0.26, 0, -sz * 0.52);
        root.add(exhaust);
      }
      break;
    }

    case PartShapeKind.HELI_ROTOR_MAST: {
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.12, sy, 16),
        mats.metalAccent,
      );
      mast.castShadow = true;
      root.add(mast);

      const swashplate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.07, 18),
        mats.primary,
      );
      swashplate.position.set(0, -sy * 0.1, 0);
      root.add(swashplate);
      break;
    }

    case PartShapeKind.HELI_MAIN_BLADES: {
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 14),
        mats.metalAccent,
      );
      cap.scale.set(1, 0.55, 1);
      root.add(cap);

      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2;
        const arm = new THREE.Group();
        arm.rotation.y = ang;

        const blade = new THREE.Mesh(
          makeBeveledBox(sx * 0.48, 0.035, 0.16, 0.008),
          mats.darkRubber,
        );
        blade.position.set(sx * 0.25, 0, 0);
        blade.castShadow = true;
        arm.add(blade);

        const tip = new THREE.Mesh(
          makeBeveledBox(0.16, 0.04, 0.165, 0.006),
          mats.primary,
        );
        tip.position.set(sx * 0.45, 0, 0);
        arm.add(tip);

        root.add(arm);
      }
      break;
    }

    case PartShapeKind.HELI_WINCH: {
      const arm = new THREE.Mesh(
        makeBeveledBox(sx, 0.1, 0.12, 0.02),
        mats.metalAccent,
      );
      root.add(arm);

      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.18, 14),
        mats.primary,
      );
      drum.rotation.x = Math.PI / 2;
      drum.position.set(sx * 0.35, -0.08, 0);
      root.add(drum);

      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, sy * 0.7, 8),
        mats.darkRubber,
      );
      cable.position.set(sx * 0.38, -sy * 0.4, 0);
      root.add(cable);

      const hook = new THREE.Mesh(
        new THREE.TorusGeometry(0.065, 0.02, 8, 16, Math.PI * 1.5),
        mats.metalAccent,
      );
      hook.position.set(sx * 0.38, -sy * 0.76, 0);
      root.add(hook);
      break;
    }

    case PartShapeKind.CATERPILLAR_TRACK: {
      for (const side of [-1, 1]) {
        const trackGroup = new THREE.Group();
        const belt = new THREE.Mesh(
          makeBeveledBox(0.32, sy, sz, 0.08),
          mats.darkRubber,
        );
        belt.castShadow = true;
        belt.receiveShadow = true;
        trackGroup.add(belt);

        const corePlate = new THREE.Mesh(
          makeBeveledBox(0.34, sy * 0.52, sz * 0.8, 0.03),
          mats.primary,
        );
        trackGroup.add(corePlate);

        const wheelCount = 4;
        for (let i = 0; i < wheelCount; i++) {
          const zPos = (i / (wheelCount - 1) - 0.5) * (sz * 0.72);
          const rollerGeo = new THREE.CylinderGeometry(sy * 0.34, sy * 0.34, 0.36, 14);
          rollerGeo.rotateZ(Math.PI / 2);
          const roller = new THREE.Mesh(rollerGeo, mats.metalAccent);
          roller.position.set(0, -sy * 0.05, zPos);
          trackGroup.add(roller);
        }

        trackGroup.position.set(side * (sx * 0.44), 0, 0);
        root.add(trackGroup);
      }

      const crossAxle = new THREE.Mesh(
        makeBeveledBox(sx * 0.85, sy * 0.32, sz * 0.42, 0.03),
        mats.secondary,
      );
      root.add(crossAxle);
      break;
    }

    case PartShapeKind.EXCAVATOR_ARM: {
      const baseMount = new THREE.Mesh(
        makeBeveledBox(sx * 0.75, sy * 0.32, 0.34, 0.03),
        mats.secondary,
      );
      baseMount.position.set(0, -sy * 0.3, -sz * 0.38);
      root.add(baseMount);

      const lowerBoom = new THREE.Mesh(
        makeBeveledBox(sx * 0.36, 0.22, sz * 0.65, 0.03),
        mats.primary,
      );
      lowerBoom.position.set(0, sy * 0.08, -sz * 0.12);
      lowerBoom.rotation.x = -0.52;
      lowerBoom.castShadow = true;
      root.add(lowerBoom);

      const cylinderPiston = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.065, sz * 0.48, 12),
        mats.metalAccent,
      );
      cylinderPiston.position.set(0, sy * 0.22, -sz * 0.14);
      cylinderPiston.rotation.x = 1.05;
      root.add(cylinderPiston);

      const upperStick = new THREE.Mesh(
        makeBeveledBox(sx * 0.3, 0.18, sz * 0.58, 0.025),
        mats.primary,
      );
      upperStick.position.set(0, sy * 0.12, sz * 0.28);
      upperStick.rotation.x = 0.62;
      upperStick.castShadow = true;
      root.add(upperStick);

      const bucket = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.48, sx * 0.42, sx * 0.72, 12, 1, false, 0, Math.PI * 1.15),
        mats.darkRubber,
      );
      bucket.rotation.z = Math.PI / 2;
      bucket.position.set(0, -sy * 0.2, sz * 0.5);
      bucket.castShadow = true;
      root.add(bucket);
      break;
    }

    case PartShapeKind.BULLDOZER_BLADE: {
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(-0.12, -sy * 0.48);
      bladeShape.quadraticCurveTo(0.18, 0, -0.06, sy * 0.48);
      bladeShape.lineTo(0.08, sy * 0.48);
      bladeShape.quadraticCurveTo(0.32, 0, 0.06, -sy * 0.48);
      bladeShape.closePath();

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
        depth: sx,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.025,
        bevelSegments: 2,
      });
      bladeGeo.center();
      bladeGeo.rotateY(Math.PI / 2);

      const blade = new THREE.Mesh(bladeGeo, mats.primary);
      blade.position.set(0, 0, sz * 0.22);
      blade.castShadow = true;
      root.add(blade);

      for (const side of [-1, 1]) {
        const pushArm = new THREE.Mesh(
          makeBeveledBox(0.12, 0.14, sz * 0.72, 0.02),
          mats.metalAccent,
        );
        pushArm.position.set(side * sx * 0.36, -sy * 0.18, -sz * 0.22);
        root.add(pushArm);
      }
      break;
    }

    case PartShapeKind.MIXER_DRUM: {
      const points = [
        new THREE.Vector2(0.01, -sz * 0.48),
        new THREE.Vector2(sx * 0.42, -sz * 0.32),
        new THREE.Vector2(sx * 0.5, 0.04),
        new THREE.Vector2(sx * 0.28, sz * 0.48),
        new THREE.Vector2(0.14, sz * 0.5),
      ];
      const drumGeo = new THREE.LatheGeometry(points, 22);
      drumGeo.rotateX(Math.PI / 2);
      const drumGroup = new THREE.Group();
      const drum = new THREE.Mesh(drumGeo, mats.primary);
      drum.castShadow = true;
      drumGroup.add(drum);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(sx * 0.48, 0.045, 10, 24),
        mats.secondary,
      );
      ring.position.set(0, 0, -0.04);
      drumGroup.add(ring);

      drumGroup.rotation.x = -0.18;
      root.add(drumGroup);
      break;
    }

    case PartShapeKind.ROLLER_DRUM: {
      const drumGeo = new THREE.CylinderGeometry(sy * 0.48, sy * 0.48, sx * 0.88, 26);
      drumGeo.rotateZ(Math.PI / 2);
      const drum = new THREE.Mesh(drumGeo, mats.metalAccent);
      drum.castShadow = true;
      drum.receiveShadow = true;
      root.add(drum);

      for (const side of [-1, 1]) {
        const yoke = new THREE.Mesh(
          makeBeveledBox(0.08, sy * 0.45, sz * 0.72, 0.02),
          mats.primary,
        );
        yoke.position.set(side * sx * 0.48, 0.05, -sz * 0.2);
        root.add(yoke);
      }
      break;
    }

    case PartShapeKind.FORKLIFT_MAST: {
      for (const side of [-1, 1]) {
        const rail = new THREE.Mesh(
          makeBeveledBox(0.1, sy, 0.12, 0.015),
          mats.darkRubber,
        );
        rail.position.set(side * sx * 0.32, 0, -sz * 0.25);
        rail.castShadow = true;
        root.add(rail);

        const forkH = new THREE.Mesh(
          makeBeveledBox(0.12, 0.06, sz * 0.78, 0.01),
          mats.metalAccent,
        );
        forkH.position.set(side * sx * 0.26, -sy * 0.42, sz * 0.16);
        forkH.castShadow = true;
        root.add(forkH);
      }

      const carriage = new THREE.Mesh(
        makeBeveledBox(sx * 0.76, sy * 0.28, 0.08, 0.015),
        mats.primary,
      );
      carriage.position.set(0, -sy * 0.28, -sz * 0.18);
      root.add(carriage);
      break;
    }

    case PartShapeKind.HARVESTER_HEADER: {
      const trough = new THREE.Mesh(
        makeBeveledBox(sx, sy * 0.45, sz * 0.55, 0.03),
        mats.primary,
      );
      trough.position.set(0, -sy * 0.18, -sz * 0.12);
      trough.castShadow = true;
      root.add(trough);

      const reelShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, sx * 0.94, 14),
        mats.metalAccent,
      );
      reelShaft.rotation.z = Math.PI / 2;
      reelShaft.position.set(0, sy * 0.12, sz * 0.15);
      root.add(reelShaft);

      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const bar = new THREE.Mesh(
          makeBeveledBox(sx * 0.92, 0.04, 0.05, 0.008),
          mats.secondary,
        );
        bar.position.set(
          0,
          sy * 0.12 + Math.sin(ang) * sy * 0.3,
          sz * 0.15 + Math.cos(ang) * sy * 0.3,
        );
        root.add(bar);
      }
      break;
    }

    case PartShapeKind.TRAIN_BOILER: {
      const boiler = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.46, sx * 0.48, sz * 0.85, 22),
        mats.primary,
      );
      boiler.rotation.x = Math.PI / 2;
      boiler.castShadow = true;
      root.add(boiler);

      const noseCone = new THREE.Mesh(
        new THREE.SphereGeometry(sx * 0.46, 20, 16),
        mats.secondary,
      );
      noseCone.scale.set(1, 0.92, 1.15);
      noseCone.position.set(0, 0, sz * 0.4);
      root.add(noseCone);

      const headlamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.1, 16),
        mats.glass,
      );
      headlamp.rotation.x = Math.PI / 2;
      headlamp.position.set(0, sy * 0.16, sz * 0.56);
      root.add(headlamp);
      break;
    }

    case PartShapeKind.SUB_HULL: {
      const hull = new THREE.Mesh(
        new THREE.CapsuleGeometry(sx * 0.48, Math.max(0.5, sz - sx), 12, 24),
        mats.primary,
      );
      hull.rotation.x = Math.PI / 2;
      hull.scale.set(1, sy / sx, 1);
      hull.castShadow = true;
      hull.receiveShadow = true;
      root.add(hull);

      const bellyBand = new THREE.Mesh(
        makeBeveledBox(sx * 0.72, sy * 0.18, sz * 0.76, 0.03),
        mats.secondary,
      );
      bellyBand.position.set(0, -sy * 0.38, 0);
      root.add(bellyBand);

      for (const zOff of [-sz * 0.22, 0, sz * 0.22]) {
        for (const side of [-1, 1]) {
          const port = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.06, 14),
            mats.glass,
          );
          port.rotation.z = Math.PI / 2;
          port.position.set(side * sx * 0.47, 0.04, zOff);
          port.renderOrder = 2;
          root.add(port);
        }
      }
      break;
    }

    case PartShapeKind.CONNING_TOWER: {
      const sailTower = new THREE.Mesh(
        makeBeveledBox(sx * 0.62, sy * 0.82, sz, 0.08),
        mats.primary,
      );
      sailTower.castShadow = true;
      root.add(sailTower);

      const divePlanes = new THREE.Mesh(
        makeBeveledBox(sx * 1.35, 0.07, sz * 0.42, 0.015),
        mats.secondary,
      );
      divePlanes.position.set(0, sy * 0.1, sz * 0.1);
      root.add(divePlanes);

      const periscope = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.045, sy * 0.55, 12),
        mats.metalAccent,
      );
      periscope.position.set(0, sy * 0.58, sz * 0.12);
      root.add(periscope);

      const scopeLens = new THREE.Mesh(
        makeBeveledBox(0.1, 0.09, 0.16, 0.015),
        mats.glass,
      );
      scopeLens.position.set(0, sy * 0.85, sz * 0.16);
      root.add(scopeLens);
      break;
    }

    case PartShapeKind.CATAMARAN_PONTOONS: {
      for (const side of [-1, 1]) {
        const pontoon = new THREE.Mesh(
          new THREE.CapsuleGeometry(sy * 0.46, Math.max(0.5, sz - sy), 10, 18),
          mats.primary,
        );
        pontoon.rotation.x = Math.PI / 2;
        pontoon.position.set(side * sx * 0.42, 0, 0);
        pontoon.castShadow = true;
        pontoon.receiveShadow = true;
        root.add(pontoon);
      }

      for (const zOff of [-sz * 0.26, sz * 0.26]) {
        const crossStrut = new THREE.Mesh(
          makeBeveledBox(sx * 0.86, sy * 0.25, 0.16, 0.02),
          mats.metalAccent,
        );
        crossStrut.position.set(0, sy * 0.24, zOff);
        root.add(crossStrut);
      }
      break;
    }

    case PartShapeKind.JET_TURBINE_PAIR: {
      for (const side of [-1, 1]) {
        const podGroup = new THREE.Group();
        const nacelle = new THREE.Mesh(
          new THREE.CylinderGeometry(sy * 0.46, sy * 0.38, sz, 20),
          mats.primary,
        );
        nacelle.rotation.x = Math.PI / 2;
        nacelle.castShadow = true;
        podGroup.add(nacelle);

        const intakeRim = new THREE.Mesh(
          new THREE.TorusGeometry(sy * 0.43, 0.045, 10, 20),
          mats.metalAccent,
        );
        intakeRim.position.set(0, 0, sz * 0.48);
        podGroup.add(intakeRim);

        const fanCore = new THREE.Mesh(
          new THREE.CylinderGeometry(sy * 0.38, sy * 0.2, 0.14, 16),
          mats.darkRubber,
        );
        fanCore.rotation.x = Math.PI / 2;
        fanCore.position.set(0, 0, sz * 0.44);
        podGroup.add(fanCore);

        const pylon = new THREE.Mesh(
          makeBeveledBox(0.08, sy * 0.45, sz * 0.55, 0.015),
          mats.secondary,
        );
        pylon.position.set(0, sy * 0.42, 0);
        podGroup.add(pylon);

        podGroup.position.set(side * sx * 0.42, 0, 0);
        root.add(podGroup);
      }
      break;
    }

    case PartShapeKind.DELTA_WING: {
      const shape = new THREE.Shape();
      shape.moveTo(0, sz * 0.52);
      shape.lineTo(sx * 0.5, -sz * 0.48);
      shape.lineTo(sx * 0.18, -sz * 0.48);
      shape.lineTo(0, -sz * 0.36);
      shape.lineTo(-sx * 0.18, -sz * 0.48);
      shape.lineTo(-sx * 0.5, -sz * 0.48);
      shape.closePath();

      const deltaGeo = new THREE.ExtrudeGeometry(shape, {
        depth: Math.max(0.06, sy * 0.6),
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.025,
        bevelSegments: 2,
      });
      deltaGeo.center();
      deltaGeo.rotateX(Math.PI / 2);

      const wing = new THREE.Mesh(deltaGeo, mats.primary);
      wing.castShadow = true;
      wing.receiveShadow = true;
      root.add(wing);

      for (const side of [-1, 1]) {
        const winglet = new THREE.Mesh(
          makeBeveledBox(0.06, sy * 2.2, sz * 0.28, 0.015),
          mats.secondary,
        );
        winglet.position.set(side * sx * 0.49, sy * 0.9, -sz * 0.34);
        root.add(winglet);
      }
      break;
    }

    case PartShapeKind.ROCKET_STAGE: {
      const stageCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.46, sx * 0.48, sy, 24),
        mats.primary,
      );
      stageCyl.castShadow = true;
      stageCyl.receiveShadow = true;
      root.add(stageCyl);

      for (const yFactor of [-0.38, 0.38]) {
        const band = new THREE.Mesh(
          new THREE.CylinderGeometry(sx * 0.49, sx * 0.49, sy * 0.12, 24),
          mats.secondary,
        );
        band.position.set(0, sy * yFactor, 0);
        root.add(band);
      }

      for (const side of [-1, 1]) {
        const pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, sy * 0.88, 10),
          mats.metalAccent,
        );
        pipe.position.set(side * sx * 0.49, 0, 0);
        root.add(pipe);
      }
      break;
    }

    case PartShapeKind.ROCKET_NOZZLE_CLUSTER: {
      const thrustPlate = new THREE.Mesh(
        new THREE.CylinderGeometry(sx * 0.44, sx * 0.4, sy * 0.28, 20),
        mats.secondary,
      );
      thrustPlate.position.set(0, sy * 0.32, 0);
      root.add(thrustPlate);

      const offsets: Array<[number, number]> = [
        [0, 0],
        [-sx * 0.24, 0],
        [sx * 0.24, 0],
        [0, -sz * 0.24],
        [0, sz * 0.24],
      ];

      for (const [ox, oz] of offsets) {
        const bell = new THREE.Mesh(
          new THREE.CylinderGeometry(sx * 0.09, sx * 0.18, sy * 0.68, 16, 1, true),
          mats.darkRubber,
        );
        bell.position.set(ox, -sy * 0.14, oz);
        bell.castShadow = true;
        root.add(bell);
      }
      break;
    }

    case PartShapeKind.ROCKET_FAIRING: {
      const points = [
        new THREE.Vector2(0.001, sy * 0.5),
        new THREE.Vector2(sx * 0.22, sy * 0.24),
        new THREE.Vector2(sx * 0.44, -sy * 0.12),
        new THREE.Vector2(sx * 0.47, -sy * 0.5),
        new THREE.Vector2(0, -sy * 0.5),
      ];
      const coneGeo = new THREE.LatheGeometry(points, 24);
      const cone = new THREE.Mesh(coneGeo, mats.primary);
      cone.castShadow = true;
      root.add(cone);

      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(sx * 0.09, 12, 12),
        mats.metalAccent,
      );
      tip.position.set(0, sy * 0.48, 0);
      root.add(tip);

      const windowPort = new THREE.Mesh(
        new THREE.SphereGeometry(sx * 0.14, 14, 14),
        mats.glass,
      );
      windowPort.position.set(0, -sy * 0.08, sx * 0.36);
      windowPort.renderOrder = 2;
      root.add(windowPort);
      break;
    }

    case PartShapeKind.SOLAR_PANEL_ARRAY: {
      const centerHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.24, 12),
        mats.metalAccent,
      );
      centerHub.rotation.z = Math.PI / 2;
      root.add(centerHub);

      for (const side of [-1, 1]) {
        const wingWidth = sx * 0.44;
        const panel = new THREE.Mesh(
          makeBeveledBox(wingWidth, sy, sz, 0.015),
          mats.primary,
        );
        panel.position.set(side * (sx * 0.27), 0, 0);
        panel.castShadow = true;
        root.add(panel);

        const trimBar = new THREE.Mesh(
          makeBeveledBox(wingWidth * 0.94, sy + 0.025, 0.05, 0.008),
          mats.metalAccent,
        );
        trimBar.position.set(side * (sx * 0.27), 0, 0);
        root.add(trimBar);
      }
      break;
    }

    case PartShapeKind.PARABOLIC_DISH: {
      const dishPoints = [
        new THREE.Vector2(0.001, -sy * 0.2),
        new THREE.Vector2(sx * 0.25, -sy * 0.12),
        new THREE.Vector2(sx * 0.48, sy * 0.18),
        new THREE.Vector2(sx * 0.5, sy * 0.22),
      ];
      const dishGeo = new THREE.LatheGeometry(dishPoints, 24);
      const dish = new THREE.Mesh(dishGeo, mats.primary);
      dish.castShadow = true;
      root.add(dish);

      const feedRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, sy * 0.65, 10),
        mats.metalAccent,
      );
      feedRod.position.set(0, sy * 0.18, 0);
      root.add(feedRod);

      const receiver = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 12, 12),
        mats.secondary,
      );
      receiver.position.set(0, sy * 0.52, 0);
      root.add(receiver);
      break;
    }

    case PartShapeKind.ROVER_MAST_CAM: {
      const mastPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.07, sy * 0.78, 12),
        mats.metalAccent,
      );
      mastPost.position.set(0, -sy * 0.08, 0);
      mastPost.castShadow = true;
      root.add(mastPost);

      const camHead = new THREE.Mesh(
        makeBeveledBox(sx, sy * 0.34, sz, 0.03),
        mats.primary,
      );
      camHead.position.set(0, sy * 0.35, 0);
      camHead.castShadow = true;
      root.add(camHead);

      for (const side of [-1, 1]) {
        const lens = new THREE.Mesh(
          new THREE.CylinderGeometry(0.085, 0.085, 0.08, 14),
          mats.glass,
        );
        lens.rotation.x = Math.PI / 2;
        lens.position.set(side * sx * 0.25, sy * 0.35, sz * 0.52);
        lens.renderOrder = 2;
        root.add(lens);
      }
      break;
    }

    case PartShapeKind.DRONE_QUAD_ARMS: {
      for (const sxSign of [-1, 1]) {
        for (const szSign of [-1, 1]) {
          const arm = new THREE.Mesh(
            makeBeveledBox(sx * 0.52, 0.07, 0.1, 0.015),
            mats.secondary,
          );
          arm.position.set(sxSign * sx * 0.22, 0, szSign * sz * 0.22);
          arm.rotation.y = sxSign * szSign * (Math.PI / 4);
          root.add(arm);

          const guard = new THREE.Mesh(
            new THREE.TorusGeometry(0.28, 0.03, 8, 20),
            mats.primary,
          );
          guard.rotation.x = Math.PI / 2;
          guard.position.set(sxSign * sx * 0.38, 0.04, szSign * sz * 0.38);
          root.add(guard);

          const blade = new THREE.Mesh(
            makeBeveledBox(0.46, 0.02, 0.06, 0.005),
            mats.darkRubber,
          );
          blade.position.set(sxSign * sx * 0.38, 0.06, szSign * sz * 0.38);
          blade.rotation.y = (sxSign + szSign) * 0.5;
          root.add(blade);
        }
      }
      break;
    }

    default: {
      const box = new THREE.Mesh(makeBeveledBox(sx, sy, sz, 0.04), mats.primary);
      box.castShadow = true;
      root.add(box);
    }
  }

  if (spec.targetRot) {
    root.rotation.set(spec.targetRot[0], spec.targetRot[1], spec.targetRot[2]);
  }

  return root;
}
