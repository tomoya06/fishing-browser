import { finishFishing, genTabId, goFishing, gotSomeFish, pauseFishing } from './fishing';
import { handleFinishFishing } from './manager/exticon';

function doGoFishing(tabid: number) {
  goFishing(genTabId(tabid));
}

function doPauseFishing(tabid: number) {
  pauseFishing(genTabId(tabid));
}

function doFinishFishing(tabid: number) {
  finishFishing(genTabId(tabid));
  const myfish = gotSomeFish(genTabId(tabid));

  if (!myfish) {
    return;
  }

  handleFinishFishing(myfish);
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
