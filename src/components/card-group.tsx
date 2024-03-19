import React from 'react'
import { calculateCardPoints } from '../functions.ts'
import type { Card, GameStatus } from '../types/cards.ts'
import { Tooltip } from 'antd'

interface Properties {
  cards: Card[]
  hideIndex?: number[]
  showPossible?: boolean
  compact?: boolean
  gameStatus?: GameStatus
  heap?: boolean
}

interface TooltipProperties {
  title?: string
  color?: string
  show: boolean
}

const compactMargin = 100

const tagStyle = (points: number | undefined): string => {
  if (!points) {
    return 'bg-white font-black'
  }
  if (points > 21) {
    return 'bg-red-500 text-white'
  }
  if (points === 21) {
    return 'bg-yellow-400 text-black'
  }
  return 'bg-white font-black'
}

const tooltipStyle = (status: GameStatus): TooltipProperties => {
  if (!status) {
    return {
      show: false,
    }
  }
  if (status === 'win') {
    return {
      show: true,
      title: '赢了',
      color: 'green',
    }
  }
  if (status === 'lose') {
    return {
      show: true,
      title: '输了',
      color: 'black',
    }
  }
  if (status === 'draw') {
    return {
      show: true,
      title: '平局',
      color: 'gold',
    }
  }
  if (status === 'burst') {
    return {
      show: true,
      title: '爆牌',
      color: 'red',
    }
  }
  return { show: false }
}

export const CardGroup: React.FC<Properties> = ({
  cards,
  hideIndex,
  showPossible = true,
  compact = false,
  gameStatus,
  heap = false,
}) => {
  const possiblePoints: number[] = calculateCardPoints(
    cards.filter((_item, index) => {
      return !hideIndex?.includes(index)
    }),
  )

  if (cards.length === 0) {
    return (
      <div className={'mx-auto w-fit'}>
        <div className={'flex gap-2'}>
          <div className={'card emptyCard'} />
          <div className={'card emptyCard'} />
        </div>
      </div>
    )
  }

  const _compact = compact || cards.length > 4

  return (
    <Tooltip
      title={heap ? '下一张' : <span>{tooltipStyle(gameStatus).title}</span>}
      color={heap ? 'blue' : tooltipStyle(gameStatus).color}
      open={heap || tooltipStyle(gameStatus).show}
      placement={heap ? 'left' : 'rightTop'}
    >
      <div className={'mx-auto w-fit'}>
        <div className={'flex gap-2'} style={_compact ? { marginLeft: compactMargin } : undefined}>
          {cards.map((item, index) => {
            return hideIndex && hideIndex.includes(index) ? (
              <div
                className={'card cardback'}
                key={index}
                style={_compact ? { marginLeft: -compactMargin } : undefined}
              />
            ) : (
              <div
                className={`card card${item}`}
                key={index}
                style={_compact ? { marginLeft: -compactMargin } : undefined}
              />
            )
          })}
        </div>
        {!heap && (
          <div
            className={`${tagStyle(
              possiblePoints.at(-1),
            )} mx-auto mt-2 w-fit rounded-2xl px-2 py-0.5 text-center font-bold shadow`}
          >
            {showPossible && !gameStatus ? possiblePoints.join('/') : possiblePoints.at(-1)}
          </div>
        )}
      </div>
    </Tooltip>
  )
}
