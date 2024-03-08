import { expect, test } from 'vitest'
import { calculateCardPoints, allCards } from '../functions.ts'

test('AK=21', () => {
  expect(calculateCardPoints(['ac', 'kc'])).toStrictEqual([21])
})

test('AA=2/12', () => {
  expect(calculateCardPoints(['ac', 'ac'])).toStrictEqual([2, 12])
})

test('shuffle', () => {
  expect(allCards(2)).toHaveLength(2 * 52)
})

test('not_shuffle', () => {
  console.log(allCards(2, false))
})
