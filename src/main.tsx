import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import zhCN from 'antd/locale/zh_CN'
import antdTheme from './config/theme.json'
import 'antd/dist/reset.css'
import './index.css'
import './cards.css'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: { ...antdTheme.token },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
