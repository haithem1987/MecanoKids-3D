import {useEffect,useRef} from 'react';
import type {NotebookText} from '../utils/discoveryNotebook';
/** Records only deliberate state changes; mounting or changing appearance is not an experiment. */
export function useTrialDiscovery(blueprintId:string,kind:string,state:string|number,result:NotebookText,success:boolean){
 const previous=useRef(state);
 useEffect(()=>{
  if(previous.current===state)return;
  previous.current=state;
  window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId,kind,result,success,settings:typeof state==='number'?[state]:undefined}}));
 },[blueprintId,kind,state,result,success]);
}
