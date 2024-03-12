import type { Card } from './cards.ts'
import { formatCards, formatDate } from '../functions.ts'

export type Winner = 'dealer' | 'player' | 'draw'
export class History {
  date: number = Date.now()
  winner?: Winner
  wager?: number
  cards?: Card[]
  message?: string

  constructor(message?: string, winner?: Winner, wager?: number, cards?: Card[]) {
    this.message = message
    this.winner = winner
    this.wager = wager
    this.cards = cards
  }

  toString(): string {
    if (!this.winner || !this.cards) {
      // 普通消息
      return `${formatDate(this.date)} ${this.message}`
    }
    if (this.winner === 'dealer') {
      return `${formatDate(this.date)} 你以 ${formatCards(this.cards)} 输掉了 $${this.wager}`
    }
    if (this.winner === 'player') {
      return `${formatDate(this.date)} 你以 ${formatCards(this.cards)} 赢得了 $${this.wager}`
    }
    if (this.winner === 'draw') {
      return `${formatDate(this.date)} 你以 ${formatCards(this.cards)} 达成了平局，退还了 $${this.wager}`
    }
    return ''
  }
}
