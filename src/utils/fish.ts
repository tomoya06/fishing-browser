import { ClosedTabInfo } from '../types/common';
import { FishRecordType, FishStorageType } from '../types/storage';
import { pickFromHundred, pickOne } from './random';

const NO_FISH_PERCENT = 20;
const FISH_ENTER_POOL_FREQ = 1;

const fcf = (config: [number, number, string]): [number, number, string] => {
  return config;
};

export const FISH_TYPES = {
  // 出现的概率 | 上钩的概率
  'Parrot Fish': fcf([50, 50, 'tile000']),
  Clownfish: fcf([20, 20, 'tile001']),
  Bonefish: fcf([10, 20, 'tile002']),
  Bluegill: fcf([10, 20, 'tile004']),
  Tilapia: fcf([10, 20, 'tile005']),
  Smelt: fcf([10, 20, 'tile008']),
  Koi: fcf([5, 20, 'tile009']),
};

export type FISH_NAME = keyof typeof FISH_TYPES;

const FISH_OCCORANCE_PERS = [NO_FISH_PERCENT, ...Object.values(FISH_TYPES).map((i) => i[0])];

const FISH_NAME_LIST = Object.keys(FISH_TYPES) as FISH_NAME[];

export function summarizeRecord(record: FishRecordType | undefined): FishStorageType {
  const { res = [] } = record || {};
  const output: FishStorageType = {};
  for (const fish of res) {
    output[fish] = (output[fish] || 0) + 1;
  }

  return output;
}

/**
 * 这次吊到多少鱼？？
 */
export function randomizeOneFishing(info: ClosedTabInfo): FISH_NAME[] {
  const { browserDuration, activateTimes } = info;
  const fishPoolSize = Math.max(
    Math.floor(browserDuration / 1000 / FISH_ENTER_POOL_FREQ) - (activateTimes - 1),
    0,
  );
  const fishPool: FISH_NAME[] = [];
  '1'
    .repeat(fishPoolSize)
    .split('')
    .forEach((_) => {
      const idx = pickOne(FISH_OCCORANCE_PERS);
      if (idx <= 0) {
        return;
      }
      const curFishName = FISH_NAME_LIST[idx - 1];
      const bitePer = FISH_TYPES[curFishName][1];
      const bited = pickFromHundred(bitePer);
      if (!bited) {
        return;
      }
      fishPool.push(curFishName);
    });

  return fishPool;
}
