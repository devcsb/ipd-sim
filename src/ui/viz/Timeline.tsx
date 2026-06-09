import type { Move, RoundResult } from '../../core/types'

const color = (m: Move) => (m === 'C' ? 'var(--coop)' : 'var(--defect)')

export function Timeline({ rounds }: { rounds: RoundResult[] }) {
  const n = rounds.length
  const cw = 10
  const gap = 2
  const rh = 20
  const width = Math.max(1, n * (cw + gap))
  const height = rh * 2 + gap

  return (
    <svg
      className="timeline"
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="라운드별 양측 선택 타임라인"
    >
      {rounds.map((r, i) => {
        const x = i * (cw + gap)
        return (
          <g key={i}>
            <rect x={x} y={0} width={cw} height={rh} fill={color(r.played[0])} />
            <rect x={x} y={rh + gap} width={cw} height={rh} fill={color(r.played[1])} />
          </g>
        )
      })}
    </svg>
  )
}
