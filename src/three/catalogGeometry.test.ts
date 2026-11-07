import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { VEHICLE_BLUEPRINTS } from '../data/blueprints';
import { VisualStyleMode } from '../types/game';
import { buildPartMeshGroup } from './partGeometries';

// Geometry-only regression: canvas textures/GPU rendering are verified in the browser.
vi.mock('./materials', () => ({
  createPartMaterialSet: () => ({
    primary: new THREE.MeshStandardMaterial(), secondary: new THREE.MeshStandardMaterial(),
    darkRubber: new THREE.MeshStandardMaterial(), metalAccent: new THREE.MeshStandardMaterial(),
    glass: new THREE.MeshStandardMaterial(),
  }),
}));

describe('géométrie de tous les modèles dans les quatre styles', () => {
  it.each(VEHICLE_BLUEPRINTS.filter((bp) => bp.experiment?.kind === 'circuit'))('$id : les fils réels rejoignent les bornes des composants', (bp) => {
    for (const spec of bp.parts.filter((p) => p.electrical)) {
      const [source, target] = spec.electrical!.map((id) => bp.parts.find((p) => p.id === id)!);
      const expected = [
        new THREE.Vector3(source.targetPos[0], source.targetPos[1] + source.scale[1] / 2, source.targetPos[2] + (source.id === 'battery' ? 0 : source.scale[2] * 0.24)),
        new THREE.Vector3(target.targetPos[0], target.targetPos[1] + (target.id === 'battery' ? -1 : 1) * target.scale[1] / 2, target.targetPos[2] - (target.id === 'battery' ? 0 : target.scale[2] * 0.24)),
      ];
      const group = buildPartMeshGroup(spec, VisualStyleMode.BLOCKS, true, 1);
      group.position.fromArray(spec.targetPos); group.updateMatrixWorld(true);
      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh) || !(object.geometry instanceof THREE.TubeGeometry)) return;
        const { radialSegments, tubularSegments } = object.geometry.parameters;
        const vertices = object.geometry.getAttribute('position');
        for (const [end, ring] of [0, tubularSegments].entries()) {
          const centre = new THREE.Vector3();
          for (let r = 0; r < radialSegments; r++) centre.add(new THREE.Vector3().fromBufferAttribute(vertices, ring * (radialSegments + 1) + r));
          centre.divideScalar(radialSegments).applyMatrix4(object.matrixWorld);
          expect(centre.distanceTo(expected[end]), `${bp.id}/${spec.id}`).toBeLessThan(1e-6);
        }
        object.geometry.dispose();
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => m.dispose());
      });
    }
  });
  it.each(['chem-water-molecule', 'chem-co2-molecule'])('%s : les cylindres réels suivent les liaisons, sans rotation en double', (id) => {
    const bp = VEHICLE_BLUEPRINTS.find((entry) => entry.id === id)!;
    for (const spec of bp.parts.filter((p) => p.bond)) {
      const [a, b] = spec.bond!.atoms.map((atomId) => new THREE.Vector3(...bp.parts.find((p) => p.id === atomId)!.targetPos));
      const axis = b.clone().sub(a).normalize();
      const mesh = buildPartMeshGroup(spec, VisualStyleMode.BLOCKS, true, 1);
      mesh.position.fromArray(spec.targetPos); mesh.updateMatrixWorld(true);
      const projections: number[] = [];
      mesh.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const positions = object.geometry.getAttribute('position');
        for (let i = 0; i < positions.count; i++) {
          projections.push(new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld).sub(a).dot(axis));
        }
        object.geometry.dispose();
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => material.dispose());
      });
      expect(Math.max(...projections) - Math.min(...projections)).toBeCloseTo(a.distanceTo(b), 5);
    }
  });
  it.each(Object.values(VisualStyleMode))('%s : pièces finies, non vides et démontables', (style) => {
    for (const bp of VEHICLE_BLUEPRINTS) for (const spec of bp.parts) {
      const group = buildPartMeshGroup(spec, style, true, 1);
      group.position.fromArray(spec.targetPos);
      group.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(group);
      expect(box.isEmpty(), `${bp.id}/${spec.id}`).toBe(false);
      expect([...box.min.toArray(), ...box.max.toArray()].every(Number.isFinite)).toBe(true);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        const attribute = object.geometry.getAttribute('position');
        expect(attribute.count).toBeGreaterThan(0);
        expect(Array.from(attribute.array).every(Number.isFinite)).toBe(true);
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => materials.add(m));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    }
  }, 60000);
  it('conserve de vraies ouvertures sous les trois arches après retrait des cintres',()=>{
    const bp=VEHICLE_BLUEPRINTS.find(b=>b.id==='expansion-aqueduct')!;
    const groups=bp.parts.filter(p=>!p.temporarySupport).map(spec=>{const group=buildPartMeshGroup(spec,VisualStyleMode.BLOCKS,true,1);group.position.fromArray(spec.targetPos);group.updateMatrixWorld(true);return group;});
    for(const x of [-1.5,0,1.5]){
      const hole=new THREE.Raycaster(new THREE.Vector3(x,1.05,2),new THREE.Vector3(0,0,-1));expect(hole.intersectObjects(groups,true)).toHaveLength(0);
      const key=new THREE.Raycaster(new THREE.Vector3(x,1.41,2),new THREE.Vector3(0,0,-1));expect(key.intersectObjects(groups,true).length).toBeGreaterThan(0);
    }
    for(const group of groups)group.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();for(const m of Array.isArray(object.material)?object.material:[object.material])m.dispose();}});
  });

});
