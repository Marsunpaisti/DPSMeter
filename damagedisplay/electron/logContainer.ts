import { CombatEvent, Encounter } from '../src/shared/logTypes';

export class LogContainer {
  encounters: Encounter[];
  currentEncounter: Encounter;

  constructor() {
    this.currentEncounter = {
      damageEvents: [],
      outgoing: {},
      incoming: {},
    };
    this.encounters = [];
  }

  public addCombatEvent = (damageEvent: CombatEvent) => {
    this.currentEncounter.damageEvents.push(damageEvent);

    // Update entity outgoing damages
    if (!(damageEvent.sourceEntity in this.currentEncounter.outgoing)) {
      this.currentEncounter.outgoing[damageEvent.sourceEntity] = {
        damageEvents: [],
        totalDamage: 0,
        bySkill: {},
      };
    }
    const sourceOutgoing =
      this.currentEncounter.outgoing[damageEvent.sourceEntity];

    if (!(damageEvent.skillName in sourceOutgoing.bySkill)) {
      sourceOutgoing.bySkill[damageEvent.skillName] = {
        damageEvents: [],
        totalDamage: 0,
      };
    }
    const skillOutgoing = sourceOutgoing.bySkill[damageEvent.skillName];

    sourceOutgoing.totalDamage += damageEvent.skillDamage;
    sourceOutgoing.damageEvents.push(damageEvent);
    skillOutgoing.totalDamage += damageEvent.skillDamage;
    skillOutgoing.damageEvents.push(damageEvent);

    // Update entity incoming damages
    if (!(damageEvent.targetEntity in this.currentEncounter.incoming)) {
      this.currentEncounter.incoming[damageEvent.targetEntity] = {
        damageEvents: [],
        totalDamage: 0,
        bySkill: {},
      };
    }
    const targetIncoming =
      this.currentEncounter.incoming[damageEvent.targetEntity];

    if (!(damageEvent.skillName in targetIncoming.bySkill)) {
      targetIncoming.bySkill[damageEvent.skillName] = {
        damageEvents: [],
        totalDamage: 0,
      };
    }
    const skillIncoming = targetIncoming.bySkill[damageEvent.skillName];
    targetIncoming.totalDamage += damageEvent.skillDamage;
    targetIncoming.damageEvents.push(damageEvent);
    skillIncoming.totalDamage += damageEvent.skillDamage;
    skillIncoming.damageEvents.push(damageEvent);
  };

  public startNewEncounter = () => {
    if (this.currentEncounter.damageEvents.length > 0) {
      this.encounters.push(this.currentEncounter);
    }

    this.currentEncounter = {
      damageEvents: [],
      outgoing: {},
      incoming: {},
    };
  };

  public clearAllEncounters = () => {
    this.encounters = [];
    this.currentEncounter = {
      damageEvents: [],
      outgoing: {},
      incoming: {},
    };
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
