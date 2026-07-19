import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { sections } from '../data/questions'
import type { Section } from '../types'

export function SectionComplete({ sectionId, onContinue, onReview }: { sectionId: Section; onContinue: () => void; onReview: () => void }) {
  const index = sections.findIndex((s) => s.id === sectionId)
  const section = sections[index]
  const isLast = index === sections.length - 1
  return <main className="completion-page page-shell">
    <div className="completion-orbit"><span><Check size={34} /></span><i /><i /></div>
    <div className="eyebrow"><Sparkles size={15} /> 模块 {index + 1}/5 已完成</div>
    <h1>{section.name}<br /><span>坐标已记录。</span></h1>
    <p>{isLast ? '你的五组坐标已经汇合。接下来将生成综合人格画像与长期生活地区建议。' : `你已完成 ${section.count} 道题。稍作停顿，然后进入「${sections[index + 1].name}」。`}</p>
    <div className="completion-stats"><span>已完成 <strong>{sections.slice(0, index + 1).reduce((n, s) => n + s.count, 0)}</strong> / 160</span><span>本模块 <strong>100%</strong></span></div>
    <div className="hero-actions"><button className="button primary" onClick={onContinue}>{isLast ? '生成我的人格图谱' : '继续下一模块'} <ArrowRight size={18} /></button><button className="button ghost" onClick={onReview}>返回检查本模块</button></div>
  </main>
}
