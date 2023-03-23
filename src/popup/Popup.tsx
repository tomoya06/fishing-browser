import { useEffect, useMemo, useState } from 'react';
import './Popup.css';
import '../styles/switch.css';
import { FishRecordType, FishStorageType } from '../types/storage';
import { fetchSessionStorage, fetchStorage } from './util';
import { FishSessionInfo } from '../types/common';
import { Tabs, Form, Button } from 'antd';
import { FISH_NAME, FISH_TYPES, summarizeRecord } from '../utils/fish';
import Marquee from 'react-fast-marquee';

function FishIcon({ name, size = 16 }: { name: FISH_NAME; size?: number }) {
  const suffix = FISH_TYPES[name][2];

  return <img src={`img/fishes/${suffix}.png`} alt={name} style={{ width: size, height: size }} />;
}

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

  const HomeTab = () => {
    const fishingTabs = Object.keys(fishSession?.opened || {}).length;
    const closedTabs = Object.keys(fishSession?.closed || {}).length;
    const lastFish = Object.entries(summarizeRecord(lastRecord));

    return (
      <div className="homeTab tabpane">
        <div className="homeicon"></div>
        <div className="sessionContainer">
          {closedTabs > 0 && <div>You've Slammed over {closedTabs} Pools</div>}
          <div>Fishing Among {fishingTabs} Tabs</div>
        </div>
        <div className="lastrecord">
          {lastFish.length && (
            <Marquee speed={30} pauseOnHover gradientWidth={60}>
              <span>Last Time You Got... </span>
              {lastFish.map(([fishName, fishCnt]) => (
                <span style={{ paddingLeft: 8 }}>
                  <FishIcon name={fishName as FISH_NAME} size={14} />
                  <span style={{ paddingLeft: 4 }}>
                    {fishCnt} {fishName}
                  </span>
                </span>
              ))}
            </Marquee>
          )}
        </div>
      </div>
    );
  };

  const CollectionTab = () => {
    const fishTypes = Object.entries(FISH_TYPES);
    return (
      <div className="collectionTab tabpane">
        <div className="collectionContainer">
          {fishTypes.map(([fishName, fishConfig]) => (
            <div key={fishName} className="fishCell">
              <FishIcon name={fishName as FISH_NAME} size={20} />
              <div className="fishName">{fishName}</div>
              <div className="fishCount">{fishStorage?.[fishName as FISH_NAME] || 0}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SettingTab = () => {
    return (
      <div className="tabpane settingTab">
        <Form>
          <Form.Item label="reset local storages"></Form.Item>
        </Form>
      </div>
    );
  };

  const tabs = [
    {
      name: 'HOME',
      elem: HomeTab(),
    },
    {
      name: 'COLLECTION',
      elem: CollectionTab(),
    },
    {
      name: 'SETTING',
      elem: SettingTab(),
    },
  ];

  return (
    <main>
      <Tabs
        defaultActiveKey={tabs[0].name}
        centered
        size="small"
        items={tabs.map((tab) => ({
          label: tab.name,
          key: tab.name,
          children: tab.elem || <></>,
        }))}
      />
    </main>
  );
}

export default App;
