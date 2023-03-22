import { FISH_NAME } from '../utils/fish';

export interface FishRecordType {
  ts: number;
  res: FISH_NAME[];
}

export type FishStorageType = Record<FISH_NAME, number>;

export interface SettingsStorage {
  debug: boolean;
  fishStorage: FishStorageType;
  fishRecord: FishRecordType[];
  noop: boolean;
}
