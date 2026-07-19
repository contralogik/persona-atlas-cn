import { countries } from '../data/countries'
import type { CountryMatch, TestResults } from '../types'

export const MATCH_WEIGHTS = {
  valuesAndInstitutions: 0.35,
  lifestyle: 0.30,
  familyAndStability: 0.15,
  careerAndCity: 0.15,
  personality: 0.05,
}

type MetricKey = keyof Pick<(typeof countries)[number], 'individualFreedom' | 'equality' | 'stability' | 'tradition' | 'openness' | 'individualism' | 'welfare' | 'pace' | 'familyFriendly' | 'warmth' | 'density' | 'career' | 'nature' | 'sociability' | 'diversity' | 'workLifeBalance' | 'languageDifficulty'>

const avg = (...values: number[]) => values.reduce((a, b) => a + b, 0) / values.length
const invert = (n: number) => 100 - n

function userProfile(r: TestResults): Record<MetricKey, number> {
  const b = r.bigFive, v = r.values, p = r.politics, l = r.lifestyle
  return {
    individualFreedom: avg(p.liberty, v.selfDirection),
    equality: avg(p.economic, v.universalism),
    stability: avg(v.security, l.safety ?? 50),
    tradition: avg(v.tradition, invert(p.social)),
    openness: avg(b.openness, p.global),
    individualism: avg(v.selfDirection, invert(v.conformity)),
    welfare: avg(l.welfare ?? 50, p.economic),
    pace: l.pace ?? 50,
    familyFriendly: avg(l.family ?? 50, v.benevolence),
    warmth: l.warmth ?? 50,
    density: l.density ?? 50,
    career: avg(l.career ?? 50, v.achievement),
    nature: l.nature ?? 50,
    sociability: b.extraversion,
    diversity: avg(l.diversity ?? 50, p.global, v.universalism),
    workLifeBalance: avg(invert(l.pace ?? 50), v.hedonism, l.family ?? 50),
    languageDifficulty: l.diversity ?? 50,
  }
}

const groups: Array<{ weight: number; keys: MetricKey[] }> = [
  { weight: MATCH_WEIGHTS.valuesAndInstitutions, keys: ['individualFreedom', 'equality', 'tradition', 'openness', 'individualism', 'welfare', 'diversity'] },
  { weight: MATCH_WEIGHTS.lifestyle, keys: ['pace', 'warmth', 'nature', 'sociability', 'workLifeBalance', 'languageDifficulty'] },
  { weight: MATCH_WEIGHTS.familyAndStability, keys: ['familyFriendly', 'stability'] },
  { weight: MATCH_WEIGHTS.careerAndCity, keys: ['career', 'density'] },
  { weight: MATCH_WEIGHTS.personality, keys: ['openness', 'sociability'] },
]

const labels: Record<MetricKey, string> = {
  individualFreedom: '个人自由空间', equality: '社会平等取向', stability: '秩序与稳定', tradition: '传统文化浓度',
  openness: '文化开放度', individualism: '个人自主空间', welfare: '公共服务模式', pace: '生活节奏',
  familyFriendly: '家庭友好度', warmth: '气候温暖度', density: '城市密度', career: '职业机会', nature: '自然环境',
  sociability: '社交氛围', diversity: '文化多样性', workLifeBalance: '工作生活平衡', languageDifficulty: '语言适应门槛',
}

export function matchCountries(results: TestResults): CountryMatch[] {
  const user = userProfile(results)
  return countries.map((country) => {
    let weightedSimilarity = 0
    const differences: Array<[MetricKey, number]> = []
    groups.forEach(({ weight, keys }) => {
      const groupSimilarity = keys.reduce((sum, key) => {
        const difference = Math.abs(user[key] - country[key])
        differences.push([key, difference])
        return sum + (100 - difference)
      }, 0) / keys.length
      weightedSimilarity += groupSimilarity * weight
    })
    const ordered = differences.sort((a, b) => a[1] - b[1])
    return {
      country,
      score: Math.round(Math.max(0, Math.min(100, weightedSimilarity))),
      reasons: ordered.slice(0, 3).map(([key]) => `${labels[key]}与你的偏好接近`),
      conflicts: ordered.slice(-2).reverse().map(([key]) => `${labels[key]}可能需要适应`),
    }
  }).sort((a, b) => b.score - a.score).slice(0, 5)
}
