import {useSyncExternalStore} from 'react';
export const PHONE_LAYOUT_QUERY='(max-width: 639px), (max-height: 500px) and (pointer: coarse)';
export const isPhoneLayout=()=>typeof window!=='undefined'&&Boolean(window.matchMedia?.(PHONE_LAYOUT_QUERY).matches);
function subscribe(notify:()=>void){const media=window.matchMedia(PHONE_LAYOUT_QUERY);media.addEventListener('change',notify);return()=>media.removeEventListener('change',notify);}
export function usePhoneLayout(){return useSyncExternalStore(subscribe,isPhoneLayout,()=>false);}
