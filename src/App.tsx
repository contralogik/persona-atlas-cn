import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { questions, sections } from './data/questions'
import type { Answers, Section, View } from './types'
import { calculateResults } from './utils/scoring'
import { clearProgress, loadProgress, saveProgress } from './utils/storage'
import { IntroPage } from './components/IntroPage'
import { QuizPage } from './components/QuizPage'
import { SectionComplete } from './components/SectionComplete'
import { ResultNav } from './components/ResultNav'
import { AmbientSoundToggle } from './components/AmbientSoundToggle'
import './App.css'

const ResultOverview = lazy(() => import('./components/ResultOverview').then((m) => ({ default: m.ResultOverview })))
const BigFiveResult = lazy(() => import('./components/BigFiveResult').then((m) => ({ default: m.BigFiveResult })))
const ValuesResult = lazy(() => import('./components/ValuesResult').then((m) => ({ default: m.ValuesResult })))
const PoliticsResult = lazy(() => import('./components/PoliticsResult').then((m) => ({ default: m.PoliticsResult })))
const MbtiResult = lazy(() => import('./components/MbtiResult').then((m) => ({ default: m.MbtiResult })))
const CountryRecommendations = lazy(() => import('./components/CountryRecommendations').then((m) => ({ default: m.CountryRecommendations })))

function App() {
  const saved = useMemo(() => loadProgress(), [])
  const [answers, setAnswers] = useState<Answers>(saved?.answers ?? {})
  const [currentIndex, setCurrentIndex] = useState(Math.min(saved?.currentIndex ?? 0, questions.length - 1))
  const [view, setView] = useState<View>('intro')
  const [completedSection, setCompletedSection] = useState<Section>('bigfive')
  const [justSelected, setJustSelected] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const advanceTimer = useRef<number | undefined>(undefined)

  useEffect(() => { saveProgress(answers, currentIndex) }, [answers, currentIndex])
  useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

  const firstUnanswered = useCallback((from = 0) => {
    const after = questions.findIndex((q, i) => i >= from && !answers[q.id])
    if (after >= 0) return after
    return questions.findIndex((q) => !answers[q.id])
  }, [answers])

  const moveNext = useCallback((index = currentIndex) => {
    if (!answers[questions[index].id]) return
    const current = questions[index]
    const next = questions[index + 1]
    if (!next || next.section !== current.section) {
      setCompletedSection(current.section)
      setView('sectionComplete')
      return
    }
    setCurrentIndex(index + 1)
  }, [answers, currentIndex])

  const answerQuestion = useCallback((value: number) => {
    window.clearTimeout(advanceTimer.current)
    const indexAtSelection = currentIndex
    const nextAnswers = { ...answers, [questions[indexAtSelection].id]: value }
    setAnswers(nextAnswers)
    setJustSelected(value)
    advanceTimer.current = window.setTimeout(() => {
      setJustSelected(null)
      const current = questions[indexAtSelection]
      const next = questions[indexAtSelection + 1]
      if (!next || next.section !== current.section) {
        setCompletedSection(current.section)
        setView('sectionComplete')
      } else {
        setCurrentIndex(indexAtSelection + 1)
      }
    }, 360)
  }, [answers, currentIndex])

  const openResult = (target: View = 'overview') => {
    const missing = firstUnanswered()
    if (missing >= 0) {
      setCurrentIndex(missing)
      setView('quiz')
      setNotice(`还有 ${questions.length - Object.keys(answers).length} 道题未完成，已定位到第一道未答题。`)
      window.setTimeout(() => setNotice(''), 4200)
      return
    }
    setView(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startFresh = () => {
    window.clearTimeout(advanceTimer.current)
    clearProgress(); setAnswers({}); setCurrentIndex(0); setView('quiz'); setNotice('')
  }

  const continueSaved = () => {
    const missing = firstUnanswered(saved?.currentIndex ?? 0)
    if (missing < 0 && Object.keys(answers).length === questions.length) openResult()
    else { setCurrentIndex(missing >= 0 ? missing : currentIndex); setView('quiz') }
  }

  const clearAll = () => {
    window.clearTimeout(advanceTimer.current)
    clearProgress(); setAnswers({}); setCurrentIndex(0); setView('intro'); setNotice('本地进度已清除。')
    window.setTimeout(() => setNotice(''), 3000)
  }

  const continueAfterSection = () => {
    const sectionIndex = sections.findIndex((s) => s.id === completedSection)
    if (sectionIndex === sections.length - 1) { openResult(); return }
    const next = questions.findIndex((q) => q.section === sections[sectionIndex + 1].id)
    setCurrentIndex(next); setView('quiz')
  }

  useEffect(() => {
    if (view !== 'quiz') return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '5') answerQuestion(Number(event.key))
      if (event.key === 'ArrowLeft' && currentIndex > 0) { window.clearTimeout(advanceTimer.current); setCurrentIndex((i) => i - 1) }
      if (event.key === 'ArrowRight' && answers[questions[currentIndex].id]) { window.clearTimeout(advanceTimer.current); moveNext() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [view, currentIndex, answers, moveNext, answerQuestion])

  const results = useMemo(() => Object.keys(answers).length === questions.length ? calculateResults(answers) : null, [answers])
  const resultViews: View[] = ['overview', 'bigfive', 'values', 'politics', 'mbti', 'countries']

  return <>
    <AmbientSoundToggle />
    {notice && <div className="toast" role="status">{notice}</div>}
    {view === 'intro' && <IntroPage answered={Object.keys(answers).length} onStart={startFresh} onContinue={continueSaved} onClear={clearAll} />}
    {view === 'quiz' && <QuizPage index={currentIndex} answers={answers} justSelected={justSelected} onAnswer={answerQuestion} onPrev={() => { window.clearTimeout(advanceTimer.current); setCurrentIndex((i) => Math.max(0, i - 1)) }} onNext={() => { window.clearTimeout(advanceTimer.current); moveNext() }} onJump={(i) => { window.clearTimeout(advanceTimer.current); setCurrentIndex(i) }} onExit={() => setView('intro')} />}
    {view === 'sectionComplete' && <SectionComplete sectionId={completedSection} onContinue={continueAfterSection} onReview={() => { const indices = questions.map((q, i) => q.section === completedSection ? i : -1).filter((i) => i >= 0); setCurrentIndex(indices.at(-1)!); setView('quiz') }} />}
    {resultViews.includes(view) && results && <div className="results-shell"><ResultNav active={view} onNavigate={openResult} onHome={() => setView('intro')} /><Suspense fallback={<div className="result-loading">正在绘制你的人格图谱…</div>}>
      {view === 'overview' && <ResultOverview results={results} onNavigate={openResult} />}
      {view === 'bigfive' && <BigFiveResult results={results} />}
      {view === 'values' && <ValuesResult results={results} />}
      {view === 'politics' && <PoliticsResult results={results} />}
      {view === 'mbti' && <MbtiResult results={results} />}
      {view === 'countries' && <CountryRecommendations results={results} />}</Suspense>
      <footer className="report-footer"><span>Persona Atlas</span><p>结果仅用于自我探索 · 数据仅保存在本地浏览器</p><button className="text-button danger" onClick={clearAll}>清除数据并重新测试</button></footer>
    </div>}
  </>
}

export default App
