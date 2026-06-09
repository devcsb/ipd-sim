import { describe, it, expect } from 'vitest'
import { runEvolution, evolutionStep } from '../../src/sim/evolution'
import { STANDARD_PAYOFF } from '../../src/core/payoff'
import type { StrategyId } from '../../src/core/strategy/Strategy'

const base = {
  rounds: 20,
  payoff: STANDARD_PAYOFF,
  executionNoise: 0,
  seed: 1,
  generations: 40,
}

describe('evolution (replicator)', () => {
  it('각 세대 인구 비율 합은 1', () => {
    const r = runEvolution({ ...base, strategies: ['allc', 'alld', 'tft'] as StrategyId[] })
    for (const gen of r.history) {
      expect(gen.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 5)
    }
  })

  it('AllD가 AllC 인구를 잠식한다', () => {
    const r = runEvolution({ ...base, strategies: ['allc', 'alld'] as StrategyId[] })
    const last = r.history[r.history.length - 1]
    expect(last[1]).toBeGreaterThan(last[0]) // alld > allc
    expect(last[1]).toBeGreaterThan(0.9)
  })

  it('TFT는 AllD 사이에서 살아남는다 (협력의 생존)', () => {
    const r = runEvolution({
      ...base,
      strategies: ['alld', 'tft'] as StrategyId[],
      generations: 50,
    })
    const last = r.history[r.history.length - 1]
    expect(last[1]).toBeGreaterThan(last[0]) // tft > alld
  })

  it('evolutionStep은 음수를 만들지 않는다', () => {
    const A = [
      [3, 0],
      [5, 1],
    ]
    const next = evolutionStep([0.5, 0.5], A)
    expect(next.every((v) => v >= 0)).toBe(true)
    expect(next.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 5)
  })
})
