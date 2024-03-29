import React, { useEffect } from 'react'
import { App, Button, Checkbox, Dropdown, Tooltip } from 'antd'
import { CardGroup } from './card-group.tsx'
import { useResetState } from 'ahooks'
import { History } from '../types/history.ts'
import type { Card, GameStatus } from '../types/cards.ts'
import { allCards, calculateCardPoints } from '../functions.ts'
import { DollarOutlined, DownOutlined } from '@ant-design/icons'

const decks = 6 // 牌套数
const cutLimit = 0.1 // 切牌
const maxHistoryLength = 20 // 历史长度

export const Game: React.FC = () => {
  const { modal } = App.useApp()
  // 作弊：查看庄家手牌
  const [viewDealerCards, setViewDealerCards] = useResetState<boolean>(false)
  // 作弊：查看牌堆
  const [viewHeap, setViewHeap] = useResetState<boolean>(false)
  // 牌堆
  const [cardsHeap, _setCardsHeap, resetCardsHeap] = useResetState<Card[]>(allCards(decks))
  // 已发牌数
  const [usedCards, setUsedCards, resetUsedCards] = useResetState<number>(0)
  // 历史记录
  const [history, setHistory, _resetHistory] = useResetState<History[]>([])
  // 底注
  const [baseBet, _setBaseBet, _resetBaseBet] = useResetState<number>(100)
  // 未分牌本局总下注额
  const [bet, setBet, resetBet] = useResetState<number>(0)
  // 已分牌本局左侧总下注额
  const [betLeft, setBetLeft, resetBetLeft] = useResetState<number>(0)
  // 已分牌本局右侧总下注额
  const [betRight, setBetRight, resetBetRight] = useResetState<number>(0)
  // 余额
  const [balance, setBalance, _resetBalance] = useResetState<number>(1000)
  // 庄家的牌
  const [dealerCards, setDealerCards, resetDealerCards] = useResetState<Card[]>([])
  // 庄家没揭开的牌序号
  const [dealerMask, setDealerMask, resetDealerMask] = useResetState<number[]>([])
  // 玩家没分牌时的手牌
  const [playerCardsNotSplit, setPlayerCardsNotSplit, resetPlayerCardsNotSplit] = useResetState<Card[]>([])
  // 玩家没分牌时状态
  const [playerStatusNotSplit, setPlayerStatusNotSplit, resetPlayerStatusNotSplit] =
    useResetState<GameStatus>(undefined)
  // 玩家是否分牌
  const [playerSplit, setPlayerSplit, resetPlayerSplit] = useResetState<boolean>(false)
  // 玩家分牌后左侧手牌
  const [playerCardsLeft, setPlayerCardsLeft, resetPlayerCardsLeft] = useResetState<Card[]>([])
  // 玩家分牌后左侧手牌状态
  const [playerStatusLeft, setPlayerStatusLeft, resetPlayerStatusLeft] = useResetState<GameStatus>(undefined)
  // 玩家分牌后右侧手牌
  const [playerCardsRight, setPlayerCardsRight, resetPlayerCardsRight] = useResetState<Card[]>([])
  // 玩家分牌后右侧手牌状态
  const [playerStatusRight, setPlayerStatusRight, resetPlayerStatusRight] = useResetState<GameStatus>(undefined)
  // （未分牌）发牌按钮可用
  const [hitButtonEnabled, setHitButtonEnabled, resetHitButtonEnabled] = useResetState<boolean>(false)
  // （未分牌）停牌按钮可用
  const [standButtonEnabled, setStandButtonEnabled, resetStandButtonEnabled] = useResetState<boolean>(false)
  // （未分牌）保险按钮可用
  const [insuranceButtonEnabled, setInsuranceButtonEnabled, resetInsuranceButtonEnabled] = useResetState<boolean>(false)
  // （未分牌）双倍下注按钮可用
  const [doubleButtonEnabled, setDoubleButtonEnabled, resetDoubleButtonEnabled] = useResetState<boolean>(false)
  // （未分牌）分牌按钮可用
  const [splitButtonEnabled, setSplitButtonEnabled, resetSplitButtonEnabled] = useResetState<boolean>(false)
  // （分牌左侧）发牌按钮可用
  const [hitLeftButtonEnabled, setHitLeftButtonEnabled, resetHitLeftButtonEnabled] = useResetState<boolean>(false)
  // （分牌左侧）停牌按钮可用
  const [standLeftButtonEnabled, setStandLeftButtonEnabled, resetStandLeftButtonEnabled] = useResetState<boolean>(false)
  // （分牌左侧）双倍下注按钮可用
  const [doubleLeftButtonEnabled, setDoubleLeftButtonEnabled, resetDoubleLeftButtonEnabled] =
    useResetState<boolean>(false)
  // （分牌右侧）发牌按钮可用
  const [hitRightButtonEnabled, setHitRightButtonEnabled, resetHitRightButtonEnabled] = useResetState<boolean>(false)
  // （分牌右侧）停牌按钮可用
  const [standRightButtonEnabled, setStandRightButtonEnabled, resetStandRightButtonEnabled] =
    useResetState<boolean>(false)
  // （分牌右侧）双倍下注按钮可用
  const [doubleRightButtonEnabled, setDoubleRightButtonEnabled, resetDoubleRightButtonEnabled] =
    useResetState<boolean>(false)

  const gameInProgress: boolean = dealerMask.length > 0

  useEffect(() => {
    if (history.length > maxHistoryLength) {
      setHistory(previousState => previousState.slice(0, maxHistoryLength))
    }
  }, [history, setHistory])

  const reset = () => {
    resetBet()
    resetDealerCards()
    resetDealerMask()
    resetPlayerCardsNotSplit()
    resetPlayerStatusNotSplit()
    resetPlayerSplit()
    resetPlayerCardsLeft()
    resetPlayerCardsRight()
    resetPlayerStatusLeft()
    resetPlayerStatusRight()
    resetBetLeft()
    resetBetRight()
    resetHitButtonEnabled()
    resetStandButtonEnabled()
    resetInsuranceButtonEnabled()
    resetDoubleButtonEnabled()
    resetSplitButtonEnabled()
    resetHitLeftButtonEnabled()
    resetStandLeftButtonEnabled()
    resetDoubleLeftButtonEnabled()
    resetHitRightButtonEnabled()
    resetStandRightButtonEnabled()
    resetDoubleRightButtonEnabled()
  }

  const newGame = () => {
    reset()
    // 牌不够就洗牌，扣除筹码，发牌
    if (usedCards > (1 - cutLimit) * decks * 52) {
      // 剩余的牌不够，重新洗牌
      resetUsedCards()
      resetCardsHeap()
      setHistory(previousState => [new History('牌堆数量不足，正在重新洗牌'), ...previousState])
    }
    setHistory(previousState => [new History('开始新游戏'), ...previousState])
    // 扣除筹码，每人发2张牌，庄家隐藏1张
    setDealerMask([1])
    const _dealerCards = [cardsHeap[usedCards + 1], cardsHeap[usedCards + 3]]
    setDealerCards(_dealerCards)
    const _playerCardsNotSplit = [cardsHeap[usedCards], cardsHeap[usedCards + 2]]
    setPlayerCardsNotSplit(_playerCardsNotSplit)
    setUsedCards(previousState => previousState + 4)
    setBet(previousState => previousState + baseBet)
    setBalance(previousState => previousState - baseBet)

    // 计算点数
    const playerPoints = calculateCardPoints(_playerCardsNotSplit)
    const dealerPoints = calculateCardPoints(_dealerCards)
    // 均为21点，平局，退还筹码
    if (playerPoints.at(-1) === 21 && dealerPoints.at(-1) === 21) {
      setHistory(previousState => [new History(undefined, 'draw', bet, _playerCardsNotSplit), ...previousState])
      setPlayerStatusNotSplit('draw')
      setBalance(previousState => previousState + baseBet)
      resetDealerMask()
      return
    }
    // 庄家不为21点，玩家为21点，玩家直接获胜
    if (playerPoints.at(-1) === 21) {
      const toWin = (baseBet / 2) * 3 + baseBet
      setBalance(previousState => previousState + toWin)
      setHistory(previousState => [new History(undefined, 'player', toWin, _playerCardsNotSplit), ...previousState])
      setPlayerStatusNotSplit('win')
      resetDealerMask()
      return
    }
    // 庄家首张为A，玩家不为21点，询问保险
    if (_dealerCards[0].charAt(0) === 'a') {
      setInsuranceButtonEnabled(true)
      return
    }
    // 如果庄家为21点庄家直接获胜
    if (dealerPoints.at(-1) === 21) {
      setHistory(previousState => [new History(undefined, 'dealer', baseBet, _playerCardsNotSplit), ...previousState])
      setPlayerStatusNotSplit('lose')
      resetDealerMask()
      return
    }
    // 如果玩家两张牌点数相同，可分牌
    if (
      calculateCardPoints([_playerCardsNotSplit[0]]).at(-1) === calculateCardPoints([_playerCardsNotSplit[1]]).at(-1)
    ) {
      setSplitButtonEnabled(true)
    }
    // 询问玩家加牌
    setHitButtonEnabled(true)
    setStandButtonEnabled(true)
    setDoubleButtonEnabled(true)
  }

  const insurance = () => {
    // 使用底注的一半购买保险，如果庄家为21点退还底注，庄家获胜
    setInsuranceButtonEnabled(false)
    setBalance(previousState => previousState - baseBet / 2)
    setHistory(previousState => [
      new History(`已扣除保险费用 $${baseBet / 2}，如果庄家获得 21 点将赔付 $${baseBet}`),
      ...previousState,
    ])
    if (calculateCardPoints(dealerCards).at(-1) === 21) {
      // 获得保险赔付，庄家获胜
      setBalance(previousState => previousState + baseBet)
      setHistory(previousState => [new History(`已获得保险赔付 $${baseBet}`), ...previousState])
      resetDealerMask()
      setPlayerStatusNotSplit('lose')
      setHistory(previousState => [new History(undefined, 'dealer', bet, playerCardsNotSplit), ...previousState])
    } else {
      // 没收保险金，继续游戏
      setHistory(previousState => [new History(`庄家没有获得 21 点，游戏继续`), ...previousState])
      setHitButtonEnabled(true)
      setStandButtonEnabled(true)
      setDoubleButtonEnabled(true)
      if (
        calculateCardPoints([playerCardsNotSplit[0]]).at(-1) === calculateCardPoints([playerCardsNotSplit[1]]).at(-1)
      ) {
        // 两张相同可分牌
        setSplitButtonEnabled(true)
      }
    }
  }

  const giveUpInsurance = () => {
    setInsuranceButtonEnabled(false)
    // 放弃保险
    if (calculateCardPoints(dealerCards).at(-1) === 21) {
      // 庄家获胜
      resetDealerMask()
      setHistory(previousState => [new History(undefined, 'dealer', bet, playerCardsNotSplit), ...previousState])
      setPlayerStatusNotSplit('lose')
    } else {
      // 继续游戏
      setHitButtonEnabled(true)
      setStandButtonEnabled(true)
      setDoubleButtonEnabled(true)
      if (
        calculateCardPoints([playerCardsNotSplit[0]]).at(-1) === calculateCardPoints([playerCardsNotSplit[1]]).at(-1)
      ) {
        // 两张相同可分牌
        setSplitButtonEnabled(true)
      }
    }
  }

  const stand = (where: 'notSplit' | 'left' | 'right', force: boolean = false) => {
    setSplitButtonEnabled(false)
    // 停牌
    if (where === 'notSplit') {
      setStandButtonEnabled(false)
      setHitButtonEnabled(false)
      setDoubleButtonEnabled(false)
      setInsuranceButtonEnabled(false)
      const playerHardPoints = calculateCardPoints(playerCardsNotSplit).at(-1)!
      resetDealerMask()
      // 庄家翻牌直到17
      const _dealerCards = dealerCards
      let _usedCards = usedCards
      while (calculateCardPoints(_dealerCards).at(-1)! < 17) {
        _dealerCards.push(cardsHeap[_usedCards])
        _usedCards += 1
      }
      setDealerCards(_dealerCards)
      setUsedCards(_usedCards)
      const dealerHardPoints = calculateCardPoints(_dealerCards).at(-1)!
      if (dealerHardPoints > 21 || dealerHardPoints < playerHardPoints) {
        // 庄家爆牌或玩家赢了
        setHistory(previousState => [new History(undefined, 'player', bet * 2, playerCardsNotSplit), ...previousState])
        setBalance(previousState => previousState + bet * 2)
        setPlayerStatusNotSplit('win')
      } else if (dealerHardPoints > playerHardPoints) {
        setHistory(previousState => [new History(undefined, 'dealer', bet, playerCardsNotSplit), ...previousState])
        setPlayerStatusNotSplit('lose')
      } else {
        // 平局，退还筹码
        setHistory(previousState => [new History(undefined, 'draw', bet, playerCardsNotSplit), ...previousState])
        setBalance(previousState => previousState + bet)
        setPlayerStatusNotSplit('draw')
      }

      return
    } else if (where === 'left') {
      setStandLeftButtonEnabled(false)
      setHitLeftButtonEnabled(false)
      setDoubleLeftButtonEnabled(false)
      if (standRightButtonEnabled && !force) {
        return
      }
    } else {
      setStandRightButtonEnabled(false)
      setHitRightButtonEnabled(false)
      setDoubleRightButtonEnabled(false)
      if (standLeftButtonEnabled && !force) {
        return
      }
    }
    resetDealerMask()
    const playerHardLeftPoints = calculateCardPoints(playerCardsLeft).at(-1)!
    const playerHardRightPoints = calculateCardPoints(playerCardsRight).at(-1)!
    // 庄家翻牌直到17
    const _dealerCards = dealerCards
    let _usedCards = usedCards
    while (calculateCardPoints(_dealerCards).at(-1)! < 17) {
      _dealerCards.push(cardsHeap[_usedCards])
      _usedCards += 1
    }
    setDealerCards(_dealerCards)
    setUsedCards(_usedCards)
    const dealerHardPoints = calculateCardPoints(_dealerCards).at(-1)!
    // 比较左侧
    if (playerHardLeftPoints <= 21 && (!force || where === 'left')) {
      if (dealerHardPoints > 21 || dealerHardPoints < playerHardLeftPoints) {
        // 庄家爆牌或玩家赢了
        setHistory(previousState => [new History(undefined, 'player', betLeft * 2, playerCardsLeft), ...previousState])
        setBalance(previousState => previousState + betLeft * 2)
        setPlayerStatusLeft('win')
      } else if (dealerHardPoints > playerHardLeftPoints) {
        // 庄家赢了
        setHistory(previousState => [new History(undefined, 'dealer', betLeft, playerCardsLeft), ...previousState])
        setPlayerStatusLeft('lose')
      } else {
        // 平局，退还筹码
        setHistory(previousState => [new History(undefined, 'draw', betLeft, playerCardsLeft), ...previousState])
        setBalance(previousState => previousState + betLeft)
        setPlayerStatusLeft('draw')
      }
    }
    if (playerHardRightPoints <= 21 && (!force || where === 'right')) {
      // 比较右侧
      if (dealerHardPoints > 21 || dealerHardPoints < playerHardRightPoints) {
        // 庄家爆牌或玩家赢了
        setHistory(previousState => [
          new History(undefined, 'player', betRight * 2, playerCardsRight),
          ...previousState,
        ])
        setBalance(previousState => previousState + betRight * 2)
        setPlayerStatusRight('win')
      } else if (dealerHardPoints > playerHardRightPoints) {
        // 庄家赢了
        setHistory(previousState => [new History(undefined, 'dealer', betRight, playerCardsRight), ...previousState])
        setPlayerStatusRight('lose')
      } else {
        // 平局，退还筹码
        setHistory(previousState => [new History(undefined, 'draw', betRight, playerCardsRight), ...previousState])
        setBalance(previousState => previousState + betRight)
        setPlayerStatusRight('draw')
      }
    }
  }

  const hit = (where: 'notSplit' | 'left' | 'right', double: boolean = false) => {
    let _bet = bet

    if (where === 'notSplit') {
      if (double) {
        _bet = bet + baseBet
        setBalance(previousState => previousState - baseBet)
        setBet(previousState => previousState + baseBet)
        setHitButtonEnabled(false)
      }
    } else if (where === 'left') {
      _bet = betLeft
      if (double) {
        _bet += baseBet
        setBalance(previousState => previousState - baseBet)
        setBetLeft(previousState => previousState + baseBet)
        setHitLeftButtonEnabled(false)
      }
    } else {
      _bet = betRight
      if (double) {
        _bet += baseBet
        setBalance(previousState => previousState - baseBet)
        setBetRight(previousState => previousState + baseBet)
        setHitRightButtonEnabled(false)
      }
    }

    // 加牌，不可再双倍下注
    let _playerCards: Card[]
    if (where === 'notSplit') {
      setDoubleButtonEnabled(false)
      setSplitButtonEnabled(false)
      _playerCards = [...playerCardsNotSplit, cardsHeap[usedCards]]
      setPlayerCardsNotSplit(previousState => [...previousState, cardsHeap[usedCards]])
      setUsedCards(previousState => previousState + 1)
    } else if (where === 'left') {
      setDoubleLeftButtonEnabled(false)
      _playerCards = [...playerCardsLeft, cardsHeap[usedCards]]
      setPlayerCardsLeft(previousState => [...previousState, cardsHeap[usedCards]])
      setUsedCards(previousState => previousState + 1)
    } else {
      setDoubleRightButtonEnabled(false)
      _playerCards = [...playerCardsRight, cardsHeap[usedCards]]
      setPlayerCardsRight(previousState => [...previousState, cardsHeap[usedCards]])
      setUsedCards(previousState => previousState + 1)
    }
    const playerHardPoints = calculateCardPoints(_playerCards).at(-1)!
    if (playerHardPoints < 21) {
      // 没爆牌
      return
    }
    if (playerHardPoints === 21) {
      // 21点，停牌
      if (where === 'notSplit') {
        setHitButtonEnabled(false)
      } else if (where === 'left') {
        setHitLeftButtonEnabled(false)
      } else {
        setHitRightButtonEnabled(false)
      }
    }
    if (playerHardPoints > 21) {
      // 玩家爆牌
      if (where === 'notSplit') {
        resetDealerMask()
        setHitButtonEnabled(false)
        setStandButtonEnabled(false)
        setHistory(previousState => [new History(undefined, 'dealer', _bet, _playerCards), ...previousState])
        setPlayerStatusNotSplit('burst')
      } else if (where === 'left') {
        setHitLeftButtonEnabled(false)
        setStandLeftButtonEnabled(false)
        setHistory(previousState => [new History(undefined, 'dealer', _bet, _playerCards), ...previousState])
        setPlayerStatusLeft('burst')
        if (!standRightButtonEnabled && !playerStatusRight) {
          // 右侧已停牌
          stand('right', true)
        }
      } else {
        setHitRightButtonEnabled(false)
        setStandRightButtonEnabled(false)
        setHistory(previousState => [new History(undefined, 'dealer', _bet, _playerCards), ...previousState])
        setPlayerStatusRight('burst')
        if (!standLeftButtonEnabled && !playerStatusLeft) {
          // 左侧已停牌
          stand('left', true)
        }
      }
    }
  }

  const split = () => {
    // 分牌
    // 扣除筹码
    setBalance(previousState => previousState - baseBet)
    resetBet()
    setBetLeft(baseBet)
    setBetRight(baseBet)
    // 分开牌
    setPlayerCardsLeft([playerCardsNotSplit[0]])
    setPlayerCardsRight([playerCardsNotSplit[1]])
    setHitLeftButtonEnabled(true)
    setHitRightButtonEnabled(true)
    setStandLeftButtonEnabled(true)
    setStandRightButtonEnabled(true)
    setDoubleLeftButtonEnabled(true)
    setDoubleRightButtonEnabled(true)
    resetPlayerCardsNotSplit()
    setPlayerSplit(true)
  }

  const double = (where: 'notSplit' | 'left' | 'right') => {
    // 双倍下注
    hit(where, true)
  }

  return (
    <>
      <div className={'w-screen'} style={{ backgroundColor: '#0b7530' }}>
        <div style={{ maxWidth: 1000, height: 48 }} className={'mx-auto flex w-full items-center text-white'}>
          <div className={'flex w-full flex-wrap justify-center font-bold'}>
            <div className={'mx-2'}>牌堆</div>
            <div>{52 * decks - usedCards}</div>
          </div>
          <div className={'flex w-full flex-wrap justify-center font-bold'}>
            <div className={'mx-2'}>余额</div>
            <div>${balance}</div>
          </div>
          <div className={'flex w-full flex-wrap justify-center font-bold'}>
            <div className={'mx-2'}>底注</div>
            <div>${baseBet}</div>
          </div>
          <div className={'flex w-full flex-wrap justify-center font-bold'}>
            <div className={'mx-2'}>已下注</div>
            <div>${playerSplit ? `${betLeft}/${betRight}` : bet}</div>
          </div>
        </div>
      </div>
      <div className={'tableBackground w-screen px-4'}>
        <div style={{ maxWidth: 1000 }} className={'w-full'}>
          <div className={'flex gap-4'}>
            {viewHeap && (
              <div className={'w-full'}>
                <div className={'my-3 w-full rounded bg-blue-500 py-1 text-center font-bold text-white shadow'}>
                  牌 堆
                </div>
                <CardGroup cards={cardsHeap.slice(usedCards, usedCards + 10)} compact heap />
              </div>
            )}
            <div className={'w-full'}>
              <div className={'my-3 w-full rounded bg-yellow-400 py-1 text-center font-bold shadow'}>庄 家</div>
              <CardGroup
                cards={dealerCards}
                hideIndex={viewDealerCards ? [] : dealerMask}
                showPossible={false}
                compact={viewHeap}
              />
            </div>
          </div>
          <div className={'my-3 w-full rounded bg-green-500 py-1 text-center font-bold shadow'}>你</div>
          <div hidden={!playerSplit}>
            <div className={'flex'}>
              <CardGroup cards={playerCardsLeft} compact gameStatus={playerStatusLeft} />
              <CardGroup cards={playerCardsRight} compact gameStatus={playerStatusRight} />
            </div>
            <div className={'flex gap-4'}>
              <div className={'mt-3 flex w-full flex-wrap justify-center gap-2 rounded bg-green-600 py-3 shadow'}>
                <Button disabled={!hitLeftButtonEnabled} onClick={() => hit('left')}>
                  加牌
                </Button>
                <Button disabled={!standLeftButtonEnabled} onClick={() => stand('left')}>
                  停牌
                </Button>
                <Tooltip title={'加一张牌后停牌'}>
                  <Button disabled={!doubleLeftButtonEnabled} onClick={() => double('left')}>
                    双倍下注&nbsp;
                    <span>
                      <DollarOutlined />
                      &thinsp;
                      {baseBet}
                    </span>
                  </Button>
                </Tooltip>
              </div>
              <div className={'mt-3 flex w-full flex-wrap justify-center gap-2 rounded bg-green-600 py-3 shadow'}>
                <Button disabled={!hitRightButtonEnabled} onClick={() => hit('right')}>
                  加牌
                </Button>
                <Button disabled={!standRightButtonEnabled} onClick={() => stand('right')}>
                  停牌
                </Button>
                <Tooltip title={'加一张牌后停牌'}>
                  <Button disabled={!doubleRightButtonEnabled} onClick={() => double('right')}>
                    双倍下注&nbsp;
                    <span>
                      <DollarOutlined />
                      &thinsp;
                      {baseBet}
                    </span>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div hidden={playerSplit}>
            <CardGroup cards={playerCardsNotSplit} gameStatus={playerStatusNotSplit} />
            <div className={'mt-3 flex flex-wrap justify-center gap-2 rounded bg-green-600 py-3 shadow'}>
              <Button disabled={!hitButtonEnabled} onClick={() => hit('notSplit')}>
                加牌
              </Button>
              <Button disabled={!standButtonEnabled} onClick={() => stand('notSplit')}>
                停牌
              </Button>
              <Tooltip title={'加一张牌后停牌'}>
                <Button disabled={!doubleButtonEnabled} onClick={() => double('notSplit')}>
                  双倍下注&nbsp;
                  <span>
                    <DollarOutlined />
                    &thinsp;
                    {baseBet}
                  </span>
                </Button>
              </Tooltip>
              <Button disabled={!splitButtonEnabled} onClick={split}>
                分牌&nbsp;
                <span>
                  <DollarOutlined />
                  &thinsp;
                  {baseBet}
                </span>
              </Button>
              <Dropdown.Button
                onClick={insurance}
                disabled={!insuranceButtonEnabled}
                className={'w-fit'}
                menu={{
                  items: [
                    {
                      key: 1,
                      label: '放弃',
                    },
                  ],
                  onClick: event => {
                    if (event.key === '1') {
                      giveUpInsurance()
                    }
                  },
                }}
              >
                保险&nbsp;
                <span>
                  <DollarOutlined />
                  &thinsp;
                  {baseBet / 2}
                </span>
              </Dropdown.Button>
            </div>
          </div>
          <div className={'mt-4 flex gap-4'}>
            <div className={'flex w-60 flex-col gap-2'}>
              <Button
                onClick={
                  gameInProgress
                    ? () =>
                        modal.confirm({
                          title: '本局游戏还未结束',
                          content: '开始新游戏将会输掉已下注的金额。',
                          onOk() {
                            newGame()
                          },
                          centered: true,
                        })
                    : newGame
                }
                block
              >
                新游戏&nbsp;
                <span>
                  <DollarOutlined />
                  &thinsp;
                  {baseBet}
                </span>
              </Button>
              <div className={'w-full'}>
                <Checkbox onChange={event => setViewDealerCards(event.target.checked)}>
                  <span className={'text-white'}>显示庄家的隐藏手牌</span>
                </Checkbox>
                <Checkbox onChange={event => setViewHeap(event.target.checked)}>
                  <span className={'text-white'}>查看牌堆</span>
                </Checkbox>
              </div>
            </div>
            <div className={'h-40 w-full overflow-auto rounded bg-black bg-opacity-40 p-2 font-mono text-white'}>
              {history.map((item, index) => {
                return <div key={index}>{item.toString()}</div>
              })}
            </div>
          </div>
          <div className={'mx-auto mt-16 w-fit text-center text-white'}>
            <div>阅读游戏规则</div>
            <DownOutlined />
          </div>
        </div>
      </div>
    </>
  )
}
