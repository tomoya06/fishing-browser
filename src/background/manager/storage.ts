import { getCurTimestamp } from '../../utils/common';
import { FISH_NAME } from '../../utils/fish';
import { getChromeStorage, setChromeStorage } from '../settings';

export async function saveFishingStorage(myfish: FISH_NAME[]) {
  const savedFishes = (await getChromeStorage('fishStorage')) || {};
  const savedRecord = (await getChromeStorage('fishRecord')) || [];

  console.log('savedFishes', savedFishes);

  for (let newFish of myfish) {
    savedFishes[newFish] = (savedFishes[newFish] || 0) + 1;
  }

  savedRecord.unshift({ ts: getCurTimestamp(), res: myfish });
  await setChromeStorage('fishStorage', savedFishes);
  await setChromeStorage('fishRecord', savedRecord);
}
