import { SettingsStorage } from '../../types/storage';

export async function fetchStorage<T extends keyof SettingsStorage, E extends SettingsStorage[T]>(
  key: T,
): Promise<E | undefined> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'query', key }, (resp) => {
      const { data } = resp || {};
      return resolve(data);
    });
  });
}
