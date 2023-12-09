import { Game } from './components/game.tsx'
import React from 'react'
import { Help } from './components/help.tsx'
import { Copyright } from './components/copyright.tsx'

export const App: React.FC = () => {
  return (
    <>
      <Game />
      <Help />
      <Copyright />
    </>
  )
}
