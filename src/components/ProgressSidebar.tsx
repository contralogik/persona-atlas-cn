import { Check, Circle } from 'lucide-react'
import { questions, sections } from '../data/questions'

interface Props { currentIndex: number; answeredIds: Set<string>; onJump: (index: number) => void }

export function ProgressSidebar({ currentIndex, answeredIds, onJump }: Props) {
  return <aside className="progress-sidebar">
    <div className="progress-title">探索进度 <span>{answeredIds.size}/160</span></div>
    <div className="section-track">
      {sections.map((section) => {
        const first = questions.findIndex((q) => q.section === section.id)
        const sectionQs = questions.filter((q) => q.section === section.id)
        const done = sectionQs.filter((q) => answeredIds.has(q.id)).length
        const active = questions[currentIndex]?.section === section.id
        return <button key={section.id} className={`track-item ${active ? 'active' : ''} ${done === section.count ? 'done' : ''}`} onClick={() => onJump(first)}>
          <span className="track-icon">{done === section.count ? <Check size={13} /> : <Circle size={10} />}</span>
          <span><strong>{section.name}</strong><small>{done}/{section.count} 题</small></span>
        </button>
      })}
    </div>
    <p className="autosave-note"><span className="pulse-dot" /> 自动保存已开启</p>
  </aside>
}
