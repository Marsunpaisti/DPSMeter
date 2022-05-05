// 22.05.05.21.45.58.7,$You (Paladin),506E15C4,Charge,1928,0,0,0
// 7

import { ClassNames, Damage } from '../../src/shared/logs';

export const parseStringToDamage = (damageString: string) => {
  const splittedDamageString = damageString.split(',');
  const splitTs = splittedDamageString[0]
    .replace('.', ':')
    .split(':')
    .map((s) => Number(s));
  const timestamp = new Date(
    splitTs[0] + 2000,
    splitTs[1] - 1,
    splitTs[2],
    splitTs[3],
    splitTs[4],
    Math.floor(splitTs[5]),
    100 * splitTs[6],
  );
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
