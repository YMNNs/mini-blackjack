import { shuffle } from 'lodash-es'
import type { Card } from './types/cards.ts'
export const calculateCardPoints = (cardNames: Card[]): number[] => {
  let softPoints: number = 0
  let aces: number = 0
  for (const cardNameWithColor of cardNames) {
    const cardName = (cardNameWithColor as string).charAt(0)
    switch (cardName) {
      case 'a': {
        aces += 1
        softPoints += 1
        break
      }
      case 't':
      case 'j':
      case 'q':
      case 'k': {
        softPoints += 10
        break
      }
      default: {
        softPoints += Number.parseInt(cardName)
      }
    }
  }
  const possiblePoints = [softPoints]
  for (let index = 0; index < aces; index += 1) {
    if (softPoints + 10 <= 21) {
      softPoints += 10
      possiblePoints.push(softPoints)
    } else {
      break
    }
  }
  if (possiblePoints.includes(21)) {
    return [21]
  }
  return possiblePoints
}

export const allCards = (pairs: number, shuffled: boolean = true): Card[] => {
  const all: Card[] = []
  const color = ['c', 'd', 'h', 's']
  const point = ['a', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k']
  for (let index = 0; index < pairs; index += 1) {
    for (const colorItem of color) {
      for (const pointItem of point) {
        all.push(`${pointItem}${colorItem}` as Card)
      }
    }
  }
  if (shuffled) {
    return shuffle(all)
  }
  return all
}

const color = {
  c: '♣',
  d: '♦',
  h: '♥',
  s: '♠',
}

export const formatCards = (cardNames: Card[]): string => {
  // @ts-ignore
  return cardNames.map(item => `${color[item.charAt(1)]}${item.charAt(0).toUpperCase().replace('T', '10')}`).join(', ')
}

export const formatDate = (date: number) => {
  return new Date(date).toLocaleString()
}
