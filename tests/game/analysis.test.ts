import { describe, it, expect } from 'vitest'
import { analyze } from '../../src/game/analysis'
import { round } from '../_fixtures'

describe('analyze (플레이 스타일)', () => {
  it('빈 히스토리는 realist 기본', () => {
    const a = analyze([])
    expect(a.rounds).toBe(0)
    expect(a.style).toBe('realist')
  })

  it('대부분 협력 → optimist', () => {
    const h = Array.from({ length: 10 }, (_, i) => round('C', 'C', i))
    const a = analyze(h)
    expect(a.coopRate).toBe(1)
    expect(a.style).toBe('optimist')
    expect(a.firstMove).toBe('C')
  })

  it('대부분 배신 → skeptic', () => {
    const h = Array.from({ length: 10 }, (_, i) => round('D', 'D', i))
    expect(analyze(h).style).toBe('skeptic')
  })

  it('상대 배신 직후 내 반응을 보복/용서로 센다', () => {
    // 라운드0: 상대 D. 라운드1: 내 D(보복). 라운드2: 상대 D. 라운드3: 내 C(용서)
    const h = [round('C', 'D', 0), round('D', 'C', 1), round('C', 'D', 2), round('C', 'C', 3)]
    const a = analyze(h)
    expect(a.retaliated).toBe(1)
    expect(a.forgave).toBe(1)
  })
})
