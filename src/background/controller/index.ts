import { getFishSession } from '../manager/fishing';
import { getChromeStorage } from '../settings';

chrome.runtime.onMessage.addListener((msg, sender, sendMessage) => {
  console.log('from: ', sender.tab?.url || 'extension');

  if (msg.action === 'query') {
    if (!msg.key) {
      sendMessage({ data: undefined });
      return;
    }
    getChromeStorage(msg.key).then((res) => {
      console.log('fetch result', msg, res);
      sendMessage({ data: res });
    });
    return true;
  }

  if (msg.action === 'fetch') {
    if (!msg.key) {
      sendMessage({ data: undefined });
      return;
    }
    if (msg.key === 'fishSession') {
      sendMessage({ data: getFishSession() });
      return;
    }
  }

  sendMessage({ data: 'invalid' });
  return;
});

export {};
