import type { RoundResult } from '../../core/types'

export function ScoreLine({ rounds }: { rounds: RoundResult[] }) {
  const n = rounds.length
  const W = 600
  const H = 160
  const pad = 6

  let a = 0
  let b = 0
  const cumA: number[] = []
  const cumB: number[] = []
  for (const r of rounds) {
    a += r.payoff[0]
    b += r.payoff[1]
    cumA.push(a)
    cumB.push(b)
  }
  const max = Math.max(1, a, b)

  const pts = (cum: number[]) =>
    cum
      .map((v, i) => {
        const x = n <= 1 ? pad : pad + (i / (n - 1)) * (W - 2 * pad)
        const y = H - pad - (v / max) * (H - 2 * pad)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')

  return (
    <svg
      className="scoreline"
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="누적 점수 그래프"
    >
      <polyline points={pts(cumA)} fill="none" stroke="var(--line-a)" strokeWidth={2} />
      <polyline points={pts(cumB)} fill="none" stroke="var(--line-b)" strokeWidth={2} />
    </svg>
  )
}
