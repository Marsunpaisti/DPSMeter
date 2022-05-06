import { Encounter } from './logTypes';

export const getEncounterDurationMs = (encounter: Encounter) => {
  const startTime = encounter.damageEvents[0]?.timeStamp.getTime();
  const endTime =
    encounter.damageEvents[
      encounter.damageEvents.length - 1
    ]?.timeStamp.getTime();
  if (startTime === undefined || endTime === undefined) return undefined;
  const duration = endTime - startTime;
  return duration;
};
