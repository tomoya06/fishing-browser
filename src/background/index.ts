import { finishFishing, genTabId, goFishing, pauseFishing } from './fishing';
import './logger.ts';

console.info('chrome-ext template-react-ts background script');

function doGoFishing(tabid: number) {
  goFishing(genTabId(tabid));
}

function doPauseFishing(tabid: number) {
  pauseFishing(genTabId(tabid));
}

function doFinishFishing(tabid: number) {
  finishFishing(genTabId(tabid));
}

const CREATED_TABS = new Set<number>();
let lastActiveTabInfo = 0;

chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.id || tab.id === chrome.tabs.TAB_ID_NONE) {
    return;
  }
  CREATED_TABS.add(tab.id);
});

chrome.tabs.onUpdated.addListener((tabid, changeInfo, tab) => {
  if (!CREATED_TABS.has(tabid)) {
    return;
  }

  if (changeInfo.status === 'complete' && tab.active) {
    CREATED_TABS.delete(tabid);
    doGoFishing(tabid);

    return;
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
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
