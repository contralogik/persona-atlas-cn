import { politicalDescription, politicsMeta } from '../utils/scoring'
import type { TestResults } from '../types'

export function PoliticsResult({ results }: { results: TestResults }) {
  return <div className="result-content detail-page">
    <header className="detail-header"><span>03 · 社会想象</span><h1>政治坐标</h1><p>这里呈现的是政策与制度偏好的相对位置，而非固定政治身份。中间位置通常意味着情境化或混合判断。</p></header>
    <section className="axis-stack">{Object.entries(results.politics).map(([key, score]) => {
      const meta = politicsMeta[key]
      return <article className="axis-card" key={key}><header><strong>{meta.left}</strong><span>{politicalDescription(key, score)}</span><strong>{meta.right}</strong></header><div className="axis-line"><i style={{ left: `${100 - score}%` }}><b>{score}</b></i></div><footer><span>100</span><span>50 · 混合</span><span>100</span></footer></article>
    })}</section>
    <section className="politics-note"><h2>如何阅读这些坐标</h2><p>分数更靠左，代表你对左侧描述的认同相对更强；更靠右则相反。它们不预测具体投票行为，也不会把复杂观点压缩成“激进”标签。人在不同议题、时期和社会环境中可能采用不同原则。</p></section>
  </div>
}
