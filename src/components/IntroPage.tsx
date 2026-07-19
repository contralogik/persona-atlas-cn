import { ArrowRight, Clock3, Compass, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { sections } from '../data/questions'
import { Brand } from './Brand'
import { AtlasMap } from './AtlasMap'

interface Props { answered: number; onStart: () => void; onContinue: () => void; onClear: () => void }

export function IntroPage({ answered, onStart, onContinue, onClear }: Props) {
  return <main className="intro page-shell">
    <nav className="topbar"><Brand /><span className="privacy-chip"><ShieldCheck size={14} /> 仅保存在此浏览器</span></nav>
    <section className="hero-section">
      <div className="hero-copy-column">
        <div className="eyebrow"><Compass size={15} /> 一次完整的自我坐标测量</div>
        <h1>从人格，到你<br /><span>适合生活的地方。</span></h1>
        <p className="hero-copy">五组视角，不急于给你贴标签。我们把性格、价值观、社会期待与生活条件放在同一张地图上，帮助你看见选择背后的结构。</p>
        <div className="hero-actions">
          <button className="button primary" onClick={onStart}>开始完整测试 <ArrowRight size={18} /></button>
          {answered > 0 && <button className="button secondary" onClick={onContinue}><RotateCcw size={17} /> 继续上次测试 <span>{answered}/160</span></button>}
        </div>
        <div className="time-note"><Clock3 size={16} /> 预计 18–25 分钟 · 160 道五级量表题</div>
      </div>
      <AtlasMap />
    </section>

    <section className="module-grid" aria-label="测试模块">
      {sections.map((section, index) => <article className="module-card" key={section.id} style={{ '--module': section.color } as CSSProperties}>
        <div className="module-index">0{index + 1}</div><div className="module-dot" />
        <h2>{section.name}</h2><p>{section.description}</p>
        <div className="module-meta"><span>{section.short}</span><strong>{section.count} 题</strong></div>
      </article>)}
    </section>

    <section className="notice-grid">
      <article><span>01</span><h3>连续维度，而非固定标签</h3><p>大五人格采用 0–100 连续分数；MBTI 只反映当前偏好，不用于判断能力。接近 50% 意味着两种方式都可能使用。</p></article>
      <article><span>02</span><h3>观点坐标，而非政治身份</h3><p>政治坐标用于理解制度与社会偏好，不代表固定立场，也不使用激进化标签。</p></article>
      <article><span>03</span><h3>模型建议，而非移居结论</h3><p>国家匹配不含实时签证、收入、房价、税率、医疗、教育、语言和职业准入，真实决策仍需独立核实。</p></article>
    </section>
    <footer className="intro-footer"><p>结果仅用于自我探索，答案不会上传服务器。</p>{answered > 0 && <button className="text-button danger" onClick={onClear}><Trash2 size={15} /> 清除历史进度</button>}</footer>
  </main>
}
