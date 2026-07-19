import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { bigFiveMeta, level } from '../utils/scoring'
import type { TestResults } from '../types'

export function BigFiveResult({ results }: { results: TestResults }) {
  const data = Object.entries(results.bigFive).map(([key, score]) => ({ key, name: bigFiveMeta[key].name, score, fullMark: 100 }))
  return <div className="result-content detail-page">
    <header className="detail-header"><span>01 · 人格底色</span><h1>大五人格</h1><p>五个连续维度描述你较稳定的行为和情绪倾向。高低本身没有优劣，关键在于环境是否匹配。</p></header>
    <section className="chart-card split-chart"><div className="radar-wrap"><ResponsiveContainer width="100%" height="100%"><RadarChart data={data} outerRadius="70%"><PolarGrid stroke="rgba(162,174,210,.20)" /><PolarAngleAxis dataKey="name" tick={{ fill: '#abb5ce', fontSize: 12 }} /><Radar dataKey="score" stroke="#7c8cff" fill="#7c8cff" fillOpacity={0.34} strokeWidth={2} /></RadarChart></ResponsiveContainer></div><div className="score-list">{data.map((item) => <div key={item.key}><span>{item.name}</span><div><i style={{ width: `${item.score}%` }} /></div><strong>{item.score}</strong></div>)}</div></section>
    <section className="dimension-grid">{data.map(({ key, name, score }) => {
      const meta = bigFiveMeta[key]; const band = level(score); const description = band === '高' ? meta.high : band === '低' ? meta.low : meta.mid
      return <article className="dimension-card" key={key}><header><span>{name}</span><strong>{score}<small>/100</small></strong></header><div className={`level-pill level-${band}`}>{band}水平</div><p>{description}</p><dl><div><dt>优势</dt><dd>{meta.strength}</dd></div><div><dt>留意</dt><dd>{meta.risk}</dd></div><div><dt>适配环境</dt><dd>{meta.environment}</dd></div></dl></article>
    })}</section>
  </div>
}
