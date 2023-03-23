import { FISH_NAME } from '../../utils/fish';

let clearBadgeTimeout = 0;

export function badgeStartFishing() {
  clearTimeout(clearBadgeTimeout);

  chrome.action.setBadgeText({
    text: '🎣',
  });
  chrome.action.setBadgeBackgroundColor({
    color: '#202124',
  });

  clearBadgeIn(1000);
}

export function badgeFishingResult(myfish: FISH_NAME[]) {
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

  clearBadgeIn(2000);
}

function clearBadgeIn(delay: number) {
  clearBadgeTimeout = setTimeout(() => {
    chrome.action.setBadgeText({
      text: '',
    });
  }, delay);
}
