import { SessionStorage, SettingsStorage } from '../../types/storage';

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

export async function fetchSessionStorage<
  T extends keyof SessionStorage,
  E extends SessionStorage[T],
>(key: T): Promise<E | undefined> {
  return new Promise<E | undefined>((resolve) => {
    chrome.runtime.sendMessage({ action: 'fetch', key }, (resp) => {
      const { data } = resp || {};
      return resolve(data);
    });
  });
}
