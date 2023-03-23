import { useEffect, useMemo, useState } from 'react';
import './Popup.css';
import '../styles/switch.css';
import { FishRecordType, FishStorageType } from '../types/storage';
import { fetchSessionStorage, fetchStorage } from './util';
import { FishSessionInfo } from '../types/common';
import { Tabs } from 'antd';

const tabs = ['HOME', 'COLLECTION', 'SETTING'];

function App() {
  const [lastRecord, setLastRecord] = useState<FishRecordType | undefined>(undefined);
  const [fishStorage, setFishStorage] = useState<FishStorageType | undefined>(undefined);
  const [fishSession, setFishSession] = useState<FishSessionInfo | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const records = (await fetchStorage('fishRecord')) || [];
      const fishSto = (await fetchStorage('fishStorage')) || ({} as FishStorageType);
      const fishSess = (await fetchSessionStorage('fishSession')) || ({} as FishSessionInfo);

      setLastRecord(records[0]);
      setFishStorage(fishSto);
      setFishSession(fishSess);

      setLoading(false);
    }
    init();
  }, []);

  const fishStorageList = useMemo(() => {
    return Object.entries(fishStorage || {}).map(([name, cnt]) => ({
      name,
      cnt,
    }));
  }, [fishStorage]);

  return (
    <main>
      <Tabs
        defaultActiveKey={tabs[0]}
        centered
        size="small"
        items={tabs.map((tab) => ({
          label: tab,
          key: tab,
        }))}
      />
    </main>
  );
}

export default App;
