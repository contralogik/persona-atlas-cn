import { ArrowLeft, Printer } from 'lucide-react'
import type { View } from '../types'
import { Brand } from './Brand'

const tabs: Array<[View, string]> = [['overview', '总览'], ['bigfive', '大五'], ['values', '价值观'], ['politics', '政治坐标'], ['mbti', 'MBTI'], ['countries', '国家匹配']]

export function ResultNav({ active, onNavigate, onHome }: { active: View; onNavigate: (v: View) => void; onHome: () => void }) {
  return <>
    <nav className="result-topbar"><Brand /><div className="result-actions"><button className="text-button" onClick={onHome}><ArrowLeft size={15} /> 首页</button><button className="button small secondary" onClick={() => window.print()}><Printer size={15} /> 打印 / PDF</button></div></nav>
    <nav className="result-tabs" aria-label="结果页面">{tabs.map(([id, label]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => onNavigate(id)}>{label}</button>)}</nav>
  </>
}
