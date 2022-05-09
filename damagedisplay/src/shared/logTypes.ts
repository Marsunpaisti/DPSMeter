export interface CombatEvent {
  timeStamp: Date;
  sourceEntity: string;
  sourceClassName?: ClassNames;
  targetEntity: string;
  targetClassName?: ClassNames;
  skillName: string;
  skillDamage: number;
  isCrit: boolean;
  isBack: boolean;
  isFront: boolean;
}

export interface DamageGroupedByEntity {
  damageEvents: CombatEvent[];
  totalDamage: number;
  bySkill: Record<string, DamageGroupedBySkill>;
}

export interface DamageGroupedBySkill {
  damageEvents: CombatEvent[];
  totalDamage: number;
}

export interface Encounter {
  damageEvents: CombatEvent[];
  outgoing: Record<string, DamageGroupedByEntity>;
  incoming: Record<string, DamageGroupedByEntity>;
}

export enum ClassNames {
  DEATHBLADE = 'Deathblade',
  SHADOWHUNTER = 'Shadowhunter',
  ARTILLERIST = 'Artillerist',
  DEADEYE = 'Deadeye',
  GUNSLINGER = 'Gunslinger',
  SHAPSHOOTER = 'Sharpshooter',
  BARD = 'Bard',
  SORCERESS = 'Sorceress',
  GLAIVIER = 'Glavier',
  SCRAPPER = 'Scrapper',
  SOULFIST = 'Soulfist',
  STRIKER = 'Striker',
  WARDANCER = 'Wardancer',
  BERSERKER = 'Berserker',
  GUNLANCER = 'Gunlancer',
  PALADIN = 'Paladin',
  DESTROYER = 'Destroyer',
  REAPER = 'Reaper',
  SCOUTER = 'Scouter',
}

export const classColors = {
  Berserker: '#de0d02',
  Sorceress: '#00ccff',
  Shadowhunter: '#960583',
  Bard: '#4bffc3',
  Deathblade: '#ff0095',
  Artillerist: '#968f91',
  Soulfist: '#bb69ff',
  Glavier: '#ff5e9c',
  Scrapper: '#ff984a',
  Striker: '#ff5533',
  Wardancer: '#ffc94a',
  Gunlancer: '#c3ffe2',
  Paladin: '#ffff0f',
  Deadeye: '#ffc061',
  Gunslinger: '#ffc061',
  Sharpshooter: '#ffd8b5',
  Destroyer: '#ad514b',
  Scouter: '#ad7a4b',
  Reaper: '#544463',
};
