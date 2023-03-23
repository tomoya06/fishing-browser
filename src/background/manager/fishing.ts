import { ClosedTabInfo, FishSessionInfo, OpenedTabInfo } from '../../types/common';
import { getCurTimestamp } from '../../utils/common';
import { randomizeOneFishing } from '../../utils/fish';

console.info('chrome-ext template-react-ts background script');

const CLOSED_TABS = new Map<string, ClosedTabInfo>();
const OPENED_TABS = new Map<string, OpenedTabInfo>();

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

/**
 *
 * @returns true 代表是新开的tab
 */
export function goFishingV2(tabid: string): boolean {
  const newActiveTime = getCurTimestamp();
  const prevInfo = OPENED_TABS.get(tabid);
  let isNew = false;
  if (prevInfo) {
    prevInfo.activateTimes += 1;
    OPENED_TABS.set(tabid, prevInfo);
  } else {
    OPENED_TABS.set(tabid, {
      activeTs: newActiveTime,
      browserDuration: 0,
      isActive: true,
      activateTimes: 1,
    });
    isNew = true;
  }
  console.log('start fishing', tabid);
  return isNew;
}

export function pauseFishingV2(tabid: string) {
  // just do nothing
  console.log('pause fishing v2', tabid);
}

export function finishFishingV2(tabid: string) {
  const closedTime = getCurTimestamp();
  const prevInfo = OPENED_TABS.get(tabid);
  if (!prevInfo) {
    console.log('no such opned tab for finish', tabid);
    return;
  }

  const lastDuration = closedTime - prevInfo.activeTs;
  console.log('finishFishing curDuration', lastDuration);
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
      activateTimes: prevInfo.activateTimes + prevClosedInfo.activateTimes,
    });
  }

  OPENED_TABS.delete(tabid);
  console.log('finish fishing v2', tabid);
}

export function gotSomeFish(tabid: string) {
  const closedInfo = CLOSED_TABS.get(tabid);
  if (!closedInfo) {
    console.log('no such closed tab', tabid);
    return;
  }

  const myfish = randomizeOneFishing(closedInfo);
  console.log('i got a fish', myfish, closedInfo);
  return myfish;
}

export function genTabId(tabid: number, tabinfo?: chrome.tabs.Tab): string {
  return `${tabid}`;
}

export function getFishSession(): FishSessionInfo {
  return {
    closed: CLOSED_TABS,
    opened: OPENED_TABS,
  };
}
