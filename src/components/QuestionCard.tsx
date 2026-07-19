import { Check } from 'lucide-react'
import { scaleLabels } from '../data/questions'
import type { Question } from '../types'

interface Props { question: Question; value?: number; justSelected: number | null; onAnswer: (value: number) => void }

export function QuestionCard({ question, value, justSelected, onAnswer }: Props) {
  return <article className="question-card">
    <div className="question-kicker">请按第一直觉作答</div>
    <h1>{question.text}</h1>
    <div className="scale" role="radiogroup" aria-label="同意程度">
      {scaleLabels.map((label, index) => {
        const score = index + 1
        const selected = value === score
        return <button key={score} role="radio" aria-checked={selected} className={`scale-option ${selected ? 'selected' : ''} ${justSelected === score ? 'pop' : ''}`} onClick={() => onAnswer(score)}>
          <span className="scale-number">{selected ? <Check size={18} strokeWidth={2.5} /> : score}</span>
          <span className="scale-label">{label}</span>
        </button>
      })}
    </div>
    <div className="scale-ends"><span>不同意</span><i /><span>同意</span></div>
  </article>
}
