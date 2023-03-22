import { getChromeStorage } from '../settings';

chrome.runtime.onMessage.addListener(async (msg, sender, sendMessage) => {
  console.log('from: ', sender.tab?.url || 'extension');

  if (msg.action === 'query') {
    if (!msg.key) {
      sendMessage({ data: undefined });
      return;
    }

    const res = await getChromeStorage(msg.key);
    sendMessage({ data: res });
  }

  sendMessage({ data: 'invalid' });
});

export {};
