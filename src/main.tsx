import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import 'antd/dist/reset.css'
import './index.css'
import './cards.css'

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
