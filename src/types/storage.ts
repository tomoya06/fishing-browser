import { FISH_NAME } from '../utils/fish';
import { FishSessionInfo } from './common';

export interface FishRecordType {
  ts: number;
  res: FISH_NAME[];
}

export type FishStorageType = Partial<Record<FISH_NAME, number>>;

export interface SettingsStorage {
  debug: boolean;
  fishStorage: FishStorageType;
  fishRecord: FishRecordType[];
  noop: boolean;
}

export interface SessionStorage {
  fishSession: FishSessionInfo;
}
