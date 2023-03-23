import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Popup';
import { ConfigProvider } from 'antd';
import './index.css';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          fontSize: 12,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
