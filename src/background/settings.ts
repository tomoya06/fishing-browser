import { FISH_NAME } from '../utils/fish';

export interface SettingsStorage {
  debug: boolean;
  fishStorage: Record<FISH_NAME, number>;
  fishRecord: { ts: number; res: FISH_NAME[] }[];
  noop: boolean;
}

export async function getChromeStorage<
  T extends keyof SettingsStorage,
  E extends SettingsStorage[T],
>(key: T): Promise<E> {
  const stokey = `fishing_browser.settings.${key}`;

  return new Promise((resolve) => {
    chrome.storage.local.get(stokey, (res) => {
      return resolve(res[stokey]);
    });
  });
}

export async function setChromeStorage<
  T extends keyof SettingsStorage,
  E extends SettingsStorage[T],
>(key: T, val: E): Promise<void> {
  const stokey = `fishing_browser.settings.${key}`;

  await chrome.storage.local.set({
    [stokey]: val,
  });
}
