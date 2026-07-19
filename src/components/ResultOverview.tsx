import { ArrowRight, BrainCircuit, Compass, MapPinned, Scale, Sparkles } from 'lucide-react'
import { getPersonaTitle, valueNames } from '../utils/scoring'
import { matchCountries } from '../utils/countryMatching'
import type { TestResults, View } from '../types'
import { AtlasMap } from './AtlasMap'

export function ResultOverview({ results, onNavigate }: { results: TestResults; onNavigate: (v: View) => void }) {
  const title = getPersonaTitle(results)
  const topValues = Object.entries(results.values).sort((a, b) => b[1] - a[1]).slice(0, 3)
  const topCountry = matchCountries(results)[0]
  const b = results.bigFive, v = results.values, p = results.politics, l = results.lifestyle
  const infoStyle = b.openness >= 60 ? '你倾向先寻找模式、可能性与更大的背景，再用具体信息校准判断。' : '你倾向从可验证的经验和具体细节开始，逐步形成稳健判断。'
  const decideStyle = results.mbti.axes.TF.left >= 55 ? '决策时，你较重视逻辑一致性和可比较的标准。' : '决策时，你会把具体的人、关系影响与内在价值纳入核心判断。'
  const riskStyle = v.security > 65 || b.neuroticism > 65 ? '面对风险，你会先寻找保障、边界和退出方案；准备充分后行动更安心。' : '你对不确定性有一定容忍度，更愿意在行动中收集反馈。'
  const socialStyle = p.economic > 57 ? '你期待社会为公平机会与基本公共服务承担更积极的责任。' : p.economic < 43 ? '你更信任市场活力、个人责任与分散决策。' : '你希望公共保障与市场效率形成务实平衡。'
  return <div className="result-content overview">
    <section className="report-hero">
      <div className="report-intro">
        <div className="eyebrow"><Sparkles size={15} /> Persona Atlas · 综合报告</div>
        <h1>{title}</h1>
        <p>你不是一个单一类型，而是一组会随情境变化、彼此牵引的坐标。</p>
        <div className="persona-code"><span><small>人格偏好</small>{Math.round((b.openness + b.conscientiousness) / 2)}</span><span><small>价值清晰度</small>{Math.round(Math.max(...Object.values(v)) - Math.min(...Object.values(v)) + 50)}</span><span><small>生活匹配</small>{topCountry.score}</span></div>
      </div>
      <AtlasMap compact />
    </section>
    <section className="insight-grid">
      <article className="insight-card wide"><div className="card-icon purple"><BrainCircuit size={20} /></div><div><span>你的认知与决策</span><h2>从信息到行动的路径</h2><p>{infoStyle} {decideStyle}</p></div></article>
      <article className="insight-card"><div className="card-icon teal"><Compass size={20} /></div><span>核心价值</span><h2>{topValues.map(([k]) => valueNames[k]).join(' · ')}</h2><p>这些价值更可能成为你在机会冲突时的最终取舍依据。</p><button onClick={() => onNavigate('values')}>查看价值排序 <ArrowRight size={15} /></button></article>
      <article className="insight-card"><div className="card-icon blue"><Scale size={20} /></div><span>风险与社会期待</span><h2>保障与可能性的平衡</h2><p>{riskStyle} {socialStyle}</p><button onClick={() => onNavigate('politics')}>查看四组坐标 <ArrowRight size={15} /></button></article>
      <article className="insight-card country-preview"><div className="country-rank">#1</div><div><span>长期生活首选建议</span><h2>{topCountry.country.name}</h2><p>{topCountry.country.cityType} · 匹配度 {topCountry.score}%</p></div><button className="round-button" onClick={() => onNavigate('countries')}><ArrowRight size={18} /></button></article>
    </section>
    <section className="narrative-section"><div><span>你的综合画像</span><h2>把理想放进可持续的日常</h2></div><div className="narrative-columns">
      <p><strong>工作与节奏</strong>{l.career > 60 ? '你需要看得见成长空间与专业密度的工作环境，' : '你更适合不过度吞噬私人生活的工作环境，'}同时最好保留一定自主安排与深度专注空间。理想城市应在机会、通勤和恢复感之间形成平衡。</p>
      <p><strong>可能的内部冲突</strong>{v.achievement > 65 && v.hedonism > 60 ? '成就推进与享受当下可能同时很强，容易在加速后又渴望抽离。' : v.selfDirection > 65 && v.security > 65 ? '自主选择与安全保障都很重要，重大改变前可能反复权衡。' : '你的多项价值相对均衡，优势是适应力，代价是关键节点可能更难迅速排序。'}</p>
      <p><strong>移居时容易忽略</strong>匹配感不等于可落地性。你尤其需要核实语言进入职场的门槛、家庭支持网络、住房与通勤，以及同一国家内部不同城市的巨大差异。</p>
    </div></section>
    <button className="country-cta" onClick={() => onNavigate('countries')}><MapPinned size={22} /><span><strong>查看 Top 5 国家与地区</strong><small>基于制度、生活方式、家庭、职业与人格的加权匹配</small></span><ArrowRight size={20} /></button>
  </div>
}
