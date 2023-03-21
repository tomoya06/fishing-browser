export interface SettingsStorage {
  debug: boolean;
  noop: boolean;
}

type SettingsKeys = keyof SettingsStorage;

// FIXME: type 体操
export async function getSettings(key: SettingsKeys): Promise<any> {
  const stokey = `fishing_browser.settings.${key}`;

  return new Promise((resolve) => {
    chrome.storage.local.get(stokey, (res) => {
      return resolve(res[stokey]);
    });
  });
}

export async function setSettings(key: SettingsKeys, val: any): Promise<void> {
  const stokey = `fishing_browser.settings.${key}`;

  await chrome.storage.local.set({
    [stokey]: val,
  });
}
