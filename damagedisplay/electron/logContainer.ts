import { CombatEvent, Encounter } from '../src/shared/logTypes';

export class LogContainer {
  encounters: Encounter[];
  currentEncounter: Encounter;

  constructor() {
    this.currentEncounter = { damageEvents: [] };
    this.encounters = [];
  }

  public addCombatEvent = (damageEvent: CombatEvent) => {
    this.currentEncounter.damageEvents.push(damageEvent);
  };

  public startNewEncounter = () => {
    this.encounters.push(this.currentEncounter);
    this.currentEncounter = { damageEvents: [] };
  };
  public clearAllEncounters = () => {
    this.encounters = [];
    this.currentEncounter = { damageEvents: [] };
  };

  public timeSincePreviousDamage = (damageEvent: CombatEvent) => {
    return (
      damageEvent.timeStamp.getTime() -
      (this.currentEncounter.damageEvents[
        this.currentEncounter.damageEvents.length - 1
      ]?.timeStamp.getTime() ?? 0)
    );
  };
}
