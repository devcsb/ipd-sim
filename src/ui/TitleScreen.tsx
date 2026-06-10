import { useState } from 'react'
import { RulesModal } from './RulesModal'

const SEEN_KEY = 'ipd-sim:seen-rules'

function seenRules(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function TitleScreen({ onStart }: { onStart: () => void }) {
  const [showRules, setShowRules] = useState(() => !seenRules())

  const closeRules = () => {
    setShowRules(false)
    try {
      localStorage.setItem(SEEN_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="screen center">
      <div className="card title-card">
        <h1>신뢰의 게임</h1>
        <p>
          협력할까, 배신할까? 다섯 상대를 차례로 만나며 신뢰가 어떻게 쌓이고 무너지는지 직접
          느껴보세요.
        </p>
        <div className="actions">
          <button className="btn primary" onClick={onStart}>
            시작하기
          </button>
          <button className="btn ghost" onClick={() => setShowRules(true)}>
            규칙 보기
          </button>
        </div>
      </div>
      {showRules && <RulesModal onClose={closeRules} />}
    </div>
  )
}
