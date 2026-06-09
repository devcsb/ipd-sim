import type { GameRoundResult } from '../sim/gameRunner'
import type { Move } from '../core/types'

export type PlayStyle = 'optimist' | 'realist' | 'skeptic'

export interface PlayAnalysis {
  rounds: number
  coopRate: number // 내가 협력(의도)한 비율 0..1
  firstMove: Move | null
  retaliated: number // 상대가 직전에 배신했을 때 내가 배신한 횟수
  forgave: number // 상대가 직전에 배신했을 때 내가 협력한 횟수
  style: PlayStyle
}

export function analyze(history: readonly GameRoundResult[]): PlayAnalysis {
  const n = history.length
  if (n === 0) {
    return { rounds: 0, coopRate: 0, firstMove: null, retaliated: 0, forgave: 0, style: 'realist' }
  }
  const coops = history.filter((r) => r.playerIntended === 'C').length
  const coopRate = coops / n

  let retaliated = 0
  let forgave = 0
  for (let i = 1; i < n; i++) {
    if (history[i - 1].opponentPlayed === 'D') {
      if (history[i].playerIntended === 'D') retaliated++
      else forgave++
    }
  }

  const style: PlayStyle = coopRate >= 0.66 ? 'optimist' : coopRate <= 0.34 ? 'skeptic' : 'realist'
  return { rounds: n, coopRate, firstMove: history[0].playerIntended, retaliated, forgave, style }
}

export const STYLE_LABEL: Record<PlayStyle, string> = {
  optimist: '낙관가',
  realist: '균형가',
  skeptic: '회의가',
}

export const STYLE_BLURB: Record<PlayStyle, string> = {
  optimist: '대체로 믿고 먼저 손을 내밀었어요. 좋은 상대에겐 최고지만, 악당에겐 조심하세요.',
  realist: '상황을 보며 협력과 방어를 오갔어요. 균형 잡힌 플레이예요.',
  skeptic: '신중하게 경계했어요. 안전하지만, 협력 가능한 상대와도 기회를 놓쳤을 수 있어요.',
}
