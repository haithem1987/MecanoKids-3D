import {it,expect} from 'vitest';
import {getHeritageDiscoveryKind,domeLoadPath,hasComparedLoads} from './heritageDiscoveries';
it('ne valide le dôme qu’après deux positions réellement testées',()=>{expect(hasComparedLoads([0])).toBe(false);expect(hasComparedLoads([1,0])).toBe(true);expect(getHeritageDiscoveryKind('expansion-yurt')).toBe('shelter');});
it('relie la charge aux nœuds existants et aux appuis du dôme',()=>{for(let i=0;i<8;i++){const [top,middle,foot]=domeLoadPath(i);expect(top).toEqual([0,1.95,0]);expect(Math.hypot(middle[0],middle[2])).toBeCloseTo(.98);expect(Math.hypot(foot[0],foot[2])).toBeCloseTo(1.4);}});
