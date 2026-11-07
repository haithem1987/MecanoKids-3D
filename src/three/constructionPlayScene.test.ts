import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {createConstructionPlayActor,disposeConstructionPlayActor} from './constructionPlayScene';
describe('acteurs des constructions terminées',()=>{
 it('crée uniquement des géométries locales et les libère en quittant l’atelier',()=>{
  for(const kind of ['gantry','castle','temple','truss'] as const){const actor=createConstructionPlayActor(kind);const parent=new THREE.Group();parent.add(actor);let meshes=0,disposed=0;actor.traverse(object=>{if(object instanceof THREE.Mesh){meshes++;object.geometry.addEventListener('dispose',()=>disposed++);expect(new THREE.Box3().setFromObject(object).isEmpty()).toBe(false);}});expect(meshes).toBeGreaterThan(0);disposeConstructionPlayActor(actor);expect(disposed).toBe(meshes);expect(parent.children).toHaveLength(0);}
 });
});
