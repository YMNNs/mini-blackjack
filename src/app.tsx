import { Game } from './components/game.tsx'
import React from 'react'
import { Help } from './components/help.tsx'
import { Copyright } from './components/copyright.tsx'
import { App as AntdApp } from 'antd'

export const App: React.FC = () => {
  return (
    <AntdApp>
      <Game />
      <Help />
      <Copyright />
    </AntdApp>
  )
}
