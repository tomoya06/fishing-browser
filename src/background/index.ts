import { finishFishing, genTabId, goFishing, gotSomeFish, pauseFishing } from './fishing';
import './logger.ts';

console.info('chrome-ext template-react-ts background script');

function doGoFishing(tabid: number) {
  goFishing(genTabId(tabid));
}

function doPauseFishing(tabid: number) {
  pauseFishing(genTabId(tabid));
}

let clearBadgeTimeout = 0;

function doFinishFishing(tabid: number) {
  finishFishing(genTabId(tabid));
  const myfish = gotSomeFish(genTabId(tabid));

  clearTimeout(clearBadgeTimeout);
  if (!myfish) {
    return;
  }
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

const LOADING_TABS = new Set<number>();
let lastActiveTabInfo = 0;

chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.id || tab.id === chrome.tabs.TAB_ID_NONE) {
    return;
  }
  LOADING_TABS.add(tab.id);
});

chrome.tabs.onUpdated.addListener((tabid, changeInfo, tab) => {
  if (!LOADING_TABS.has(tabid)) {
    return;
  }

  if (changeInfo.status === 'complete' && tab.active) {
    LOADING_TABS.delete(tabid);
    doGoFishing(tabid);

    return;
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // 首次加载完成前也会激活一次activated
  if (LOADING_TABS.has(activeInfo.tabId)) {
    return;
  }
  if (lastActiveTabInfo) {
    doPauseFishing(lastActiveTabInfo);
  }
  doGoFishing(activeInfo.tabId);
  lastActiveTabInfo = activeInfo.tabId;
});

chrome.tabs.onRemoved.addListener((tabid, removeInfo) => {
  doFinishFishing(tabid);
});

// FIXME: chrome app lose focus?

export {};
