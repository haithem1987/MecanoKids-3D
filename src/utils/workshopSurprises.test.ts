import {describe,it,expect} from 'vitest';
import {assemblySurprise,surpriseMilestones,successSurprise} from './workshopSurprises';
describe('surprises liées aux bonnes actions',()=>{
 it('ne remplace pas la fête finale et ne se déclenche pas sans progrès',()=>{
  expect(surpriseMilestones(2)).toEqual([]);
  expect(assemblySurprise(0,60,1)).toBeUndefined();
  expect(assemblySurprise(60,60,1)).toBeUndefined();
 });
 it('limite les interruptions pour les grands montages',()=>{
  expect(surpriseMilestones(61)).toEqual([9,24,40,52]);
  expect(new Set(surpriseMilestones(61).map(step=>assemblySurprise(step,61,1))).size).toBe(4);
 });
 it('varie selon atelier et réussite tout en restant reproductible',()=>{
  expect(assemblySurprise(2,7,1)).not.toBe(assemblySurprise(2,7,2));
  expect(successSurprise(1,5)).not.toBe(successSurprise(2,5));
  expect(successSurprise(1,5)).toBe(successSurprise(1,5));
 });
});
