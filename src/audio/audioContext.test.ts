import {beforeEach,describe,expect,it,vi} from 'vitest';
class GainMock {
 context:{currentTime:number;state:string};gain={value:1,cancelScheduledValues:vi.fn(),setValueAtTime:vi.fn((value:number)=>{this.gain.value=value;})};connect=vi.fn();
 constructor(context:{currentTime:number;state:string}){this.context=context;}
}
beforeEach(()=>vi.resetModules());
describe('sortie sonore commune',()=>{
 it('applique le silence avant toute création et le conserve à la recréation du contexte',async()=>{
  const audio=await import('./audioContext');audio.setWorkshopAudioMuted(true);
  const first={currentTime:0,state:'running',destination:{},createGain(){return new GainMock(this);}};
  const second={...first,currentTime:5};const output=audio.getWorkshopAudioOutput(first as unknown as BaseAudioContext);expect(output.gain.value).toBe(0);
  expect(audio.getWorkshopAudioOutput(first as unknown as BaseAudioContext)).toBe(output);expect(audio.getWorkshopAudioOutput(second as unknown as BaseAudioContext).gain.value).toBe(0);
  audio.setWorkshopAudioMuted(false);expect(output.gain.value).toBe(1);
 });
 it('annule les automations du gain et avertit immédiatement voix et sons',async()=>{
  const audio=await import('./audioContext'),context={currentTime:3,state:'running',destination:{},createGain(){return new GainMock(this);}},output=audio.getWorkshopAudioOutput(context as unknown as BaseAudioContext),listener=vi.fn();
  const remove=audio.subscribeWorkshopAudioMute(listener);audio.setWorkshopAudioMuted(true);expect(output.gain.cancelScheduledValues).toHaveBeenCalledWith(3);expect(output.gain.setValueAtTime).toHaveBeenCalledWith(0,3);expect(listener).toHaveBeenCalledWith(true);remove();audio.setWorkshopAudioMuted(false);expect(listener).toHaveBeenCalledTimes(1);
 });
});
