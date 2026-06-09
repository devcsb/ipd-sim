import { useEffect, useMemo, useRef } from 'react'
import { runEvolution } from '../sim/evolution'
import { STANDARD_PAYOFF } from '../core/payoff'
import type { StrategyId } from '../core/strategy/Strategy'

const EVO: { id: StrategyId; name: string; color: string }[] = [
  { id: 'allc', name: '호구', color: '#fde68a' },
  { id: 'alld', name: '악당', color: '#c084fc' },
  { id: 'tft', name: '거울', color: '#93c5fd' },
  { id: 'grudger', name: '복수귀', color: '#fca5a5' },
  { id: 'gtft', name: '관대한 거울', color: '#a7f3d0' },
  { id: 'pavlov', name: '변덕쟁이', color: '#fbbf24' },
]

export function EvolutionView({ onBack }: { onBack: () => void }) {
  const result = useMemo(
    () =>
      runEvolution({
        strategies: EVO.map((e) => e.id),
        rounds: 30,
        payoff: STANDARD_PAYOFF,
        executionNoise: 0.05,
        seed: 7,
        generations: 60,
      }),
    [],
  )
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    const gens = result.history.length
    const n = result.strategies.length

    const draw = (upTo: number) => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < n; i++) {
        ctx.beginPath()
        for (let g = 0; g <= upTo; g++) {
          const x = gens <= 1 ? 0 : (g / (gens - 1)) * W
          let below = 0
          for (let k = 0; k < i; k++) below += result.history[g][k]
          const top = below + result.history[g][i]
          if (g === 0) ctx.moveTo(x, H - top * H)
          else ctx.lineTo(x, H - top * H)
        }
        for (let g = upTo; g >= 0; g--) {
          const x = gens <= 1 ? 0 : (g / (gens - 1)) * W
          let below = 0
          for (let k = 0; k < i; k++) below += result.history[g][k]
          ctx.lineTo(x, H - below * H)
        }
        ctx.closePath()
        ctx.fillStyle = EVO[i].color
        ctx.fill()
      }
    }

    const reduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      draw(gens - 1)
      return
    }
    let frame = 0
    let raf = 0
    const tick = () => {
      frame += 1
      draw(Math.min(frame, gens - 1))
      if (frame < gens - 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [result])

  const final = result.history[result.history.length - 1]
  const winnerIdx = final.indexOf(Math.max(...final))

  return (
    <div className="screen">
      <h2 className="screen-title">진화 토너먼트</h2>
      <p className="hint">
        여섯 전략이 한 인구 안에서 경쟁해요. 세대가 지나며 점수가 낮은 전략은 사라지고 높은
        전략이 번성합니다. (통신 오류 5%)
      </p>
      <canvas ref={ref} width={560} height={260} className="evo-canvas" />
      <div className="evo-legend">
        {EVO.map((e, i) => (
          <span key={e.id} className="evo-item">
            <span className="evo-dot" style={{ background: e.color }} />
            {e.name} {Math.round(final[i] * 100)}%
          </span>
        ))}
      </div>
      <p className="lesson">
        끝에는 <strong>{EVO[winnerIdx].name}</strong>의 인구가 가장 많아요. 무조건 배신하는
        악당은 처음엔 늘지만 서로 잡아먹어 쇠퇴하고, 협력을 되갚는 전략은 자기들끼리 모여
        번성해요. 이게 협력이 세상에서 살아남는 이유예요.
      </p>
      <div className="actions">
        <button className="btn primary" onClick={onBack}>
          돌아가기
        </button>
      </div>
    </div>
  )
}
