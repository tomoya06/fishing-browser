import { useEffect, useState } from 'react';
import './Popup.css';
import '../styles/switch.css';
import { getSettings, setSettings } from '../types/settings';

function App() {
  const [isDebug, setDebug] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const stDebug: boolean = (await getSettings('debug')) || false;
      setDebug(stDebug);

      setLoading(false);
    }
  }, []);

  return (
    <main>
      <h3>Popup Page!</h3>

      <h6>v 0.0.0</h6>

      <h4>
        <span>debug</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isDebug}
            onChange={(val) => {
              setDebug(val.target.checked);
              setSettings('debug', val.target.checked);
            }}
          ></input>
          <span className="slider round"></span>
        </label>
      </h4>
    </main>
  );
}

export default App;
