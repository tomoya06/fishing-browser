export interface ClosedTabInfo {
  browserDuration: number;
  openTimes: number;
  activateTimes: number;
}

export interface OpenedTabInfo {
  activeTs: number;
  isActive: boolean;
  browserDuration: number;
  activateTimes: number;
}

export interface FishSessionInfo {
  closed: Map<string, ClosedTabInfo>;
  opened: Map<string, OpenedTabInfo>;
}
