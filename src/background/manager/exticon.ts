import { FISH_NAME } from '../../utils/fish';

let clearBadgeTimeout = 0;

export function handleFinishFishing(myfish: FISH_NAME[]) {
  clearTimeout(clearBadgeTimeout);
  if (!myfish.length) {
    chrome.action.setBadgeText({
      text: ':-(',
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#7d787d',
    });
  } else {
    chrome.action.setBadgeText({
      text: `+${myfish.length}`,
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#c92e2e',
    });
  }

  clearBadgeTimeout = setTimeout(() => {
    chrome.action.setBadgeText({
      text: '',
    });
  }, 2000);
}
