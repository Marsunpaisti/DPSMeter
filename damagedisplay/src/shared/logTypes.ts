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

export interface Encounter {
  damageEvents: CombatEvent[];
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
  Sorceress: '#05daff',
  Shadowhunter: '#960583',
  Bard: '#39cdfa',
  Deathblade: '#fa3963',
  Artillerist: '#968f91',
  Soulfist: '#bb69ff',
  Glavier: '#ff5e9c',
  Scrapper: '#ff984a',
  Striker: '#ff684a',
  Wardancer: '#ffc94a',
  Gunlancer: '#4affa7',
  Paladin: '#ffff0f',
  Deadeye: '#ffa14a',
  Gunslinger: '#ffa14a',
  Sharpshooter: '#ffd8b5',
  Destroyer: '#ad514b',
  Scouter: '#ad7a4b',
  Reaper: '#544463',
};
