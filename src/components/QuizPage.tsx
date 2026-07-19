import { ArrowLeft, ArrowRight, CornerUpLeft } from 'lucide-react'
import { questions, sections } from '../data/questions'
import type { Answers } from '../types'
import { Brand } from './Brand'
import { ProgressSidebar } from './ProgressSidebar'
import { QuestionCard } from './QuestionCard'

interface Props {
  index: number; answers: Answers; justSelected: number | null
  onAnswer: (value: number) => void; onPrev: () => void; onNext: () => void; onJump: (i: number) => void; onExit: () => void
}

export function QuizPage({ index, answers, justSelected, onAnswer, onPrev, onNext, onJump, onExit }: Props) {
  const question = questions[index]
  const section = sections.find((s) => s.id === question.section)!
  const sectionQuestions = questions.filter((q) => q.section === question.section)
  const inSection = sectionQuestions.findIndex((q) => q.id === question.id) + 1
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)
  return <div className="quiz-layout">
    <ProgressSidebar currentIndex={index} answeredIds={new Set(Object.keys(answers))} onJump={onJump} />
    <main className="quiz-main">
      <nav className="quiz-topbar"><Brand /><button className="text-button" onClick={onExit}><CornerUpLeft size={15} /> 暂停并返回</button></nav>
      <div className="global-progress"><span style={{ width: `${progress}%` }} /><em>{progress}%</em></div>
      <section className="question-stage">
        <header className="question-header">
          <div><span style={{ color: section.color }}>{section.short}</span><strong>{section.name}</strong></div>
          <p>模块 {sections.findIndex((s) => s.id === section.id) + 1}/5 · 第 {inSection}/{section.count} 题</p>
        </header>
        <QuestionCard question={question} value={answers[question.id]} justSelected={justSelected} onAnswer={onAnswer} />
        <div className="question-nav">
          <button className="button ghost" disabled={index === 0} onClick={onPrev}><ArrowLeft size={18} /> 上一题</button>
          <span className="keyboard-tip">键盘 <kbd>1</kbd>–<kbd>5</kbd> 选择 · <kbd>←</kbd><kbd>→</kbd> 切换</span>
          <button className="button secondary" disabled={!answers[question.id]} onClick={onNext}>下一题 <ArrowRight size={18} /></button>
        </div>
      </section>
    </main>
  </div>
}
