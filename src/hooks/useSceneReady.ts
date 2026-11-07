import {useEffect,useState} from 'react';
/** Child effects may run before the canvas creates its imperative scene. */
export function useSceneReady(engine:{readonly current:unknown}):boolean{
 const [ready,setReady]=useState(()=>Boolean(engine.current));
 useEffect(()=>{
  let frame=0,cancelled=false;
  const check=()=>{if(cancelled)return;if(engine.current)setReady(true);else frame=requestAnimationFrame(check);};
  check();return()=>{cancelled=true;cancelAnimationFrame(frame);};
 },[engine]);
 return ready;
}
