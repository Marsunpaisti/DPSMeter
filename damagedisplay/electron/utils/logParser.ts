// 22.05.05.21.45.58.7,$You (Paladin),506E15C4,Charge,1928,0,0,0
// 7

import { ClassNames, DamageEvent } from '../../src/shared/logTypes';

export const parseDamageEventFromLog = (logLine: string) => {
  const splittedDamageString = logLine.split(',');
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
      .replace(':', '.')
      .split('.')
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
  const skillDamage = Number(splittedDamageString[4]);
  const isCrit = splittedDamageString[4] === '1' ? true : false;
  const isFront = splittedDamageString[5] === '1' ? true : false;
  const isBack = splittedDamageString[6] === '1' ? true : false;

  const damage: DamageEvent = {
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
