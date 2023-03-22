import { useEffect, useMemo, useState } from 'react';
import './Popup.css';
import '../styles/switch.css';
import { FishRecordType, FishStorageType } from '../types/storage';
import { fetchStorage } from './util';

function App() {
  const [lastRecord, setLastRecord] = useState<FishRecordType | undefined>(undefined);
  const [fishStorage, setFishStorage] = useState<FishStorageType | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const records = (await fetchStorage('fishRecord')) || [];
      const fishSto = (await fetchStorage('fishStorage')) || ({} as FishStorageType);
      console.log('result', records, fishSto);
      setLastRecord(records[0]);
      setFishStorage(fishSto);
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
      <header>
        <h3>Let's GO FISHING!</h3>
      </header>
      <section>
        <h5>Last time you've got: </h5>
        <div>{JSON.stringify(lastRecord)}</div>
      </section>
      <section>
        <h5>All Fish You've Got:</h5>
        {fishStorageList.map((item) => (
          <div>
            {item.name}: {item.cnt}
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;
