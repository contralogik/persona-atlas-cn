import { AlertTriangle, CheckCircle2, Globe2, MapPin, Search } from 'lucide-react'
import type { CSSProperties } from 'react'
import { matchCountries, MATCH_WEIGHTS } from '../utils/countryMatching'
import type { TestResults } from '../types'

export function CountryRecommendations({ results }: { results: TestResults }) {
  const matches = matchCountries(results)
  return <div className="result-content detail-page countries-page">
    <header className="detail-header"><span>05 · 理想栖居</span><h1>国家与地区 Top 5</h1><p>排名主要参考价值与制度偏好、生活方式、家庭稳定、职业城市选择，并以人格作少量校准。MBTI 不直接参与排名。</p></header>
    <section className="weight-strip">{Object.entries(MATCH_WEIGHTS).map(([key, value]) => <div key={key} style={{ flex: value }}><i /><span>{({ valuesAndInstitutions: '价值与制度', lifestyle: '生活方式', familyAndStability: '家庭稳定', careerAndCity: '职业城市', personality: '人格适配' } as Record<string, string>)[key]} {value * 100}%</span></div>)}</section>
    <section className="country-list">{matches.map((match, index) => <article className={`country-card rank-${index + 1}`} key={match.country.id}>
      <header><div className="rank-badge">#{index + 1}</div><div><span>{match.country.region}</span><h2>{match.country.name}</h2><p><MapPin size={14} /> {match.country.cityType}</p></div><div className="match-ring" style={{ '--score': `${match.score * 3.6}deg` } as CSSProperties}><strong>{match.score}%</strong><small>匹配</small></div></header>
      <div className="country-details"><div><h3><CheckCircle2 size={16} /> 主要匹配原因</h3><ul>{match.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div><div><h3><AlertTriangle size={16} /> 潜在冲突</h3><ul>{match.conflicts.map((reason) => <li key={reason}>{reason}</li>)}</ul></div><div><h3><Globe2 size={16} /> 适合你的生活方式</h3><p>{match.country.cityType}，在职业机会、公共空间与个人生活之间建立符合你偏好的组合。</p></div><div><h3><Search size={16} /> 现实核实</h3><p>重点核实 {match.country.language} 的职场要求、目标城市住房通勤、签证路径与行业准入。</p></div></div>
    </article>)}</section>
    <section className="reality-note"><AlertTriangle size={20} /><div><h2>这是方向建议，不是移居结论</h2><p>匹配分不包含实时签证政策、税率、房价、收入和职业资格认证，也不代表某国整体优于其他国家。国家内部不同城市、行业与家庭阶段的体验差异很大，请在实际决策前逐项核实。</p></div></section>
  </div>
}
