import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { valueNames } from '../utils/scoring'
import type { TestResults } from '../types'

const conflicts: Record<string, string> = {
  selfDirection: '自主与遵从可能在“按自己方式做”还是“维持共同规则”之间拉扯。',
  stimulation: '变化刺激与安全稳定可能让你在新机会面前既兴奋又谨慎。',
  achievement: '成就推进与关怀亲近者可能竞争你的时间和精力。',
  power: '影响力追求与普遍公平之间需要明确边界。',
  tradition: '传统归属与自主探索可能在生活方式选择上产生张力。',
  universalism: '普遍关怀与亲近者优先之间可能出现资源分配难题。',
}

export function ValuesResult({ results }: { results: TestResults }) {
  const data = Object.entries(results.values).map(([key, score]) => ({ key, name: valueNames[key], score })).sort((a, b) => b.score - a.score)
  const top = data.slice(0, 5)
  const tension = top.map((v) => conflicts[v.key]).find(Boolean) ?? '你的核心价值相对协调，但在具体情境中仍需明确优先级。'
  return <div className="result-content detail-page">
    <header className="detail-header"><span>02 · 内在罗盘</span><h1>Schwartz 核心价值观</h1><p>价值观是在选项都合理时，决定你最终舍弃什么、坚持什么的隐性排序。</p></header>
    <section className="top-values">{top.slice(0, 3).map((item, i) => <article key={item.key}><span>0{i + 1}</span><div><small>核心价值</small><h2>{item.name}</h2></div><strong>{item.score}</strong></article>)}</section>
    <section className="chart-card values-chart"><ResponsiveContainer width="100%" height={420}><BarChart data={data} layout="vertical" margin={{ left: 18, right: 36 }}><CartesianGrid strokeDasharray="4 6" horizontal={false} stroke="rgba(162,174,210,.12)" /><XAxis type="number" domain={[0, 100]} tick={{ fill: '#7f8aa8', fontSize: 11 }} axisLine={false} /><YAxis type="category" dataKey="name" width={84} tick={{ fill: '#cbd3e8', fontSize: 13 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: 'rgba(124,140,255,.06)' }} contentStyle={{ background: '#151b2a', border: '1px solid #2b3450', borderRadius: 12 }} /><Bar dataKey="score" radius={[0, 6, 6, 0]}>{data.map((_, i) => <Cell key={i} fill={i < 3 ? '#8d90ff' : i < 5 ? '#55d6be' : '#39445f'} />)}</Bar></BarChart></ResponsiveContainer></section>
    <section className="interpret-grid"><article><span>你优先守护什么</span><h2>{top.slice(0, 5).map((v) => v.name).join('、')}</h2><p>重大决定中，你更可能先问：这个选择是否尊重这些价值？短期收益若持续侵蚀核心价值，通常难以让你长期满意。</p></article><article><span>可能的价值张力</span><h2>两种“都重要”的声音</h2><p>{tension}</p></article></section>
  </div>
}
