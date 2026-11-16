import type {AgeProfile} from '../types/game';
export interface CraneChallenge{load:number;loadDistance:number;masses:readonly number[];distances:readonly number[];advanced:boolean}
export function craneChallenge(age:AgeProfile|undefined):CraneChallenge{
 return age==='11-12'?{load:3,loadDistance:2.5,masses:[2,5],distances:[1,1.5,2,2.5,3,3.5,4],advanced:true}:{load:2,loadDistance:3,masses:[3],distances:[1,2,3,4],advanced:false};
}
export function craneBalanced(challenge:CraneChallenge,mass:number,distance:number){return challenge.masses.includes(mass)&&challenge.distances.includes(distance)&&Math.abs(challenge.load*challenge.loadDistance-mass*distance)<.0001;}
export function craneTilt(challenge:CraneChallenge,mass:number,distance:number){return Math.max(-.30,Math.min(.30,(challenge.load*challenge.loadDistance-mass*distance)*.06));}
