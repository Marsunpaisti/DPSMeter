export interface Damage {
  sourceEntity: string;
  sourceClassName?: ClassNames;
  targetEntity: string;
  targetClassName?: ClassNames;
  skillName: string;
  skillDamage: number;
  isCrit: boolean;
  isBack: boolean;
  isFront: boolean;
  timestamp: Date;
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

// 22.05.05.21.45.58.7,$You (Paladin),506E15C4,Charge,1928,0,0,0
// 7

export const parseStringToDamage = (damageString: string) => {
  const splittedDamageString = damageString.split(',');
  const tempStamp = splittedDamageString[0].split('.').map((i) => Number(i));
  tempStamp[6] *= 100;
  tempStamp[0] += 2000;
  tempStamp[1] -= 1;
  const timestamp = new Date(
    tempStamp[0],
    tempStamp[1],
    tempStamp[2],
    tempStamp[3],
    tempStamp[4],
    tempStamp[5],
    tempStamp[6],
  );
  const playerName = splittedDamageString[1].split(' ')[0];
  const sourceEntityMatch = splittedDamageString[1]
    .replace('$', '')
    .match(/(.+?)\s*\((.+)\)/);
  const targetEntityMatch = splittedDamageString[2]
    .replace('$', '')
    .match(/(.+?)\s*\((.+)\)/);
  const skillName = splittedDamageString[3];
  const skillDamage = Number(splittedDamageString[4]);
  const isCrit = splittedDamageString[4] === '1' ? true : false;
  const isFront = splittedDamageString[5] === '1' ? true : false;
  const isBack = splittedDamageString[6] === '1' ? true : false;

  const damage: Damage = {
    sourceEntity: sourceEntityMatch
      ? sourceEntityMatch[1]
      : splittedDamageString[1],
    sourceClassName:
      sourceEntityMatch &&
      sourceEntityMatch[2] &&
      Object.values(ClassNames).some(
        (className) =>
          className.toLowerCase() === sourceEntityMatch[2].toLowerCase(),
      )
        ? (sourceEntityMatch[2] as ClassNames)
        : undefined,
    targetEntity: targetEntityMatch
      ? targetEntityMatch[1]
      : splittedDamageString[2],
    targetClassName:
      targetEntityMatch &&
      targetEntityMatch[2] &&
      Object.values(ClassNames).some(
        (className) =>
          className.toLowerCase() === targetEntityMatch[2].toLowerCase(),
      )
        ? (targetEntityMatch[2] as ClassNames)
        : undefined,
    skillName: skillName,
    skillDamage: skillDamage,
    isCrit,
    isFront,
    isBack,
    timestamp,
  };

  return damage;
};
