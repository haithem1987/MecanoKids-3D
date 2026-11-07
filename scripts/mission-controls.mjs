export async function openMission(mission){
 const summary=mission.locator(':scope > summary');if(await summary.count()&&!await mission.evaluate(node=>node.open))await summary.click();
}
export async function missionField(mission,id){
 await openMission(mission);
 const toggle=mission.locator('[data-mission-open-controls]');if(await toggle.count()&&await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();
 const pager=mission.locator('[data-mission-current]');
 for(let i=0;i<8;i++){
  if(await pager.getAttribute('data-mission-current')===String(id))return pager.locator(`[data-mission-field="${id}"]`);
  const previous=pager.locator('[data-mission-previous]');if(!await previous.count()||await previous.isDisabled())break;await previous.click();
 }
 for(let i=0;i<8;i++){
  if(await pager.getAttribute('data-mission-current')===String(id))return pager.locator(`[data-mission-field="${id}"]`);
  const next=pager.locator('[data-mission-next]');if(!await next.count()||await next.isDisabled())break;await next.click();
 }
 throw Error(`Mission field ${id} is not reachable without scrolling`);
}
export async function pickMission(mission,id,value,keyboard=false){
 const field=await missionField(mission,id),select=field.locator('[data-mission-select]');
 if(await select.isVisible())await select.selectOption(String(value));
 else{const button=field.locator(`[data-mission-value="${value}"]`);if(keyboard)await button.press('Enter');else await button.click();}
}
export async function readMission(mission){const button=mission.locator('[data-mission-open-info]');if(await button.getAttribute('aria-expanded')!=='true')await button.click();}
