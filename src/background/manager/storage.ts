import { FISH_NAME } from '../../utils/fish';
import { getChromeStorage, setChromeStorage } from '../settings';

export async function saveFishingStorage(myfish: FISH_NAME[]) {
  const savedFishes = (await getChromeStorage('fishStorage')) || {};
  for (let newFish of myfish) {
    savedFishes[newFish] = (savedFishes[newFish] || 0) + 1;
  }

  await setChromeStorage('fishStorage', savedFishes);
}
