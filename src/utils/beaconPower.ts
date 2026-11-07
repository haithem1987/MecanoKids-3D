export type BeaconSettings = { source: 'solar' | 'battery'; daylight: boolean; charged: boolean };
export function getBeaconOutcome({source,daylight,charged}:BeaconSettings): 'solarOn'|'solarOff'|'batteryOn'|'batteryOff' {
 return source==='solar' ? daylight?'solarOn':'solarOff' : charged?'batteryOn':'batteryOff';
}
