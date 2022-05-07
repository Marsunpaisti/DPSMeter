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
  UNKNOWN = 'MyTempName',
}

export const classColors = {
  Berserker: '#ff0000',
  Sorceress: '#00ff00',
  Shadowhunter: '#ff00ff',
  Bard: '#ff66ff',
  Deathblade: '#c0c0c0',
  Artillerist: '#e5ffcc',
  Soulfist: '#a6e4c7',
  Glavier: '#ff3333',
  Scrapper: '#55bf22',
  Striker: '#b266ff',
  Wardancer: '#00994c',
  Gunlancer: '#cc6600',
  Paladin: '#ffb266',
  Deadeye: '#6666ff',
  Gunslinger: '#e5ccff',
  Sharpshooter: '#ccff99',
  MyTempName: '#e0e0e0',
};
