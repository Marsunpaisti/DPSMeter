// 22.05.05.21.45.58.7,$You (Paladin),506E15C4,Charge,1928,0,0,0
// 7

import { ClassNames, CombatEvent } from '../../src/shared/logTypes';

export const parseCombatEventFromLog = (logLine: string) => {
  const splittedDamageString = logLine.split(',').map((s) => s.trim());
  let timeStamp: Date;
  if (
    !splittedDamageString[0].includes('.') &&
    !splittedDamageString[0].includes(':')
  ) {
    // Timestamp is UTC timestamp
    timeStamp = new Date(Number(splittedDamageString[0]));
  } else {
    // Timestamp is yy-mm-dd-hh-mm-ss-ms format
    const splitTs = splittedDamageString[0]
      .split(/[\.\:]/g)
      .map((s) => Number(s));
    timeStamp = new Date(
      splitTs[0] + 2000,
      splitTs[1] - 1,
      splitTs[2],
      splitTs[3],
      splitTs[4],
      Math.floor(splitTs[5]),
      100 * splitTs[6],
    );
  }

  const sourceEntityMatch = splittedDamageString[1]
    .replace('$', '')
    .match(/(.+?)\s*\((.+)\)/);
  const targetEntityMatch = splittedDamageString[2]
    .replace('$', '')
    .match(/(.+?)\s*\((.+)\)/);
  const skillName = splittedDamageString[3];
  let skillDamage = Number(splittedDamageString[4]);

  // Artillerist has a comma in an ability name, causing it to parse wrong
  if (
    isNaN(skillDamage) &&
    Number(splittedDamageString[5]) !== 0 &&
    Number(splittedDamageString[5]) !== 1 &&
    !Number.isNaN(splittedDamageString[5])
  ) {
    splittedDamageString.shift();
    skillDamage = Number(splittedDamageString[4]);
  }

  const isCrit = splittedDamageString[5] === '1' ? true : false;
  const isBack = splittedDamageString[6] === '1' ? true : false;
  const isFront = splittedDamageString[7] === '1' ? true : false;

  const damage: CombatEvent = {
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
    timeStamp,
  };

  return damage;
};
