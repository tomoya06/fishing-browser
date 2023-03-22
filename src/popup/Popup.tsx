import { useEffect, useState } from 'react';
import './Popup.css';
import '../styles/switch.css';

function App() {
  const [isDebug, setDebug] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setDebug(false);

      setLoading(false);
    }
  }, []);

  return <main></main>;
}

export default App;
