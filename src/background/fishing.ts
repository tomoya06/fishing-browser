import { randomizeOneFish } from '../types/fish';

console.info('chrome-ext template-react-ts background script');

interface ClosedTabInfo {
  browserDuration: number;
  openTimes: number;
  activateTimes: number;
}

interface OpenedTabInfo {
  activeTs: number;
  isActive: boolean;
  browserDuration: number;
  activateTimes: number;
}

const CLOSED_TABS = new Map<string, ClosedTabInfo>();
const OPENED_TABS = new Map<string, OpenedTabInfo>();

function getCurTimestamp() {
  return new Date().getTime();
}

export function goFishing(tabid: string) {
  const newActiveTime = getCurTimestamp();
  const prevInfo = OPENED_TABS.get(tabid);
  if (prevInfo) {
    prevInfo.activeTs = newActiveTime;
    prevInfo.activateTimes += 1;
    OPENED_TABS.set(tabid, prevInfo);
  } else {
    OPENED_TABS.set(tabid, {
      activeTs: newActiveTime,
      browserDuration: 0,
      isActive: true,
      activateTimes: 1,
    });
  }
  console.log('start fishing', tabid);
}

export function pauseFishing(tabid: string) {
  const inactiveTime = getCurTimestamp();
  const prevInfo = OPENED_TABS.get(tabid);
  if (!prevInfo) {
    console.log('no such opned tab for pause', tabid);
    return;
  }

  const curDuration = inactiveTime - prevInfo.activeTs;

  prevInfo.browserDuration += curDuration;
  prevInfo.isActive = false;
  OPENED_TABS.set(tabid, prevInfo);
  console.log('pause fishing', tabid);
}

export function finishFishing(tabid: string) {
  const closedTime = getCurTimestamp();
  const prevInfo = OPENED_TABS.get(tabid);
  if (!prevInfo) {
    console.log('no such opned tab for finish', tabid);
    return;
  }

  const lastDuration = prevInfo.isActive ? closedTime - prevInfo.activeTs : 0;
  prevInfo.browserDuration += lastDuration;

  const prevClosedInfo = CLOSED_TABS.get(tabid);
  if (!prevClosedInfo) {
    CLOSED_TABS.set(tabid, {
      browserDuration: prevInfo.browserDuration,
      openTimes: 1,
      activateTimes: prevInfo.activateTimes,
    });
  } else {
    CLOSED_TABS.set(tabid, {
      browserDuration: prevClosedInfo.browserDuration + prevInfo.browserDuration,
      openTimes: prevClosedInfo.openTimes + 1,
      activateTimes: prevInfo.activateTimes,
    });
  }

  OPENED_TABS.delete(tabid);
  console.log('finish fishing', tabid);
}

export function gotSomeFish(tabid: string) {
  const closedInfo = CLOSED_TABS.get(tabid);
  if (!closedInfo) {
    console.log('no such closed tab', tabid);
    return;
  }

  const { browserDuration, activateTimes } = closedInfo;

  const MAX_BROWSER_TIME = 2 * 60;
  const browserSeconds = browserDuration / 1000;
  const MAX_ACT_TIMES_PER_SECOND = 0.01;
  const points =
    (Math.min(MAX_BROWSER_TIME, browserSeconds) / MAX_BROWSER_TIME -
      Math.max(0, activateTimes - 1 - browserSeconds * MAX_ACT_TIMES_PER_SECOND) / browserSeconds) *
    100;

  const myfish = randomizeOneFish(points);
  console.log('i got a fish', myfish, points, closedInfo);
  return myfish;
}

export function genTabId(tabid: number, tabinfo?: chrome.tabs.Tab): string {
  return `${tabid}`;
}
