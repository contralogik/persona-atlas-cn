import { questions } from '../data/questions'
import type { Answers, Question, TestResults } from '../types'

const normalizeGroup = (items: Question[], answers: Answers) => {
  const values = items.map((q) => q.direction === 1 ? answers[q.id] : 6 - answers[q.id])
  if (!values.length || values.some((v) => !v)) return 0
  return Math.round(((values.reduce((a, b) => a + b, 0) / values.length) - 1) * 25)
}

const dimensionsFor = (section: string, answers: Answers) => {
  const sectionQuestions = questions.filter((q) => q.section === section)
  return [...new Set(sectionQuestions.map((q) => q.dimension))].reduce<Record<string, number>>((acc, dimension) => {
    acc[dimension] = normalizeGroup(sectionQuestions.filter((q) => q.dimension === dimension), answers)
    return acc
  }, {})
}

export function calculateResults(answers: Answers): TestResults {
  const bigFive = dimensionsFor('bigfive', answers)
  const values = dimensionsFor('values', answers)
  const politics = dimensionsFor('politics', answers)
  const lifestyle = dimensionsFor('lifestyle', answers)
  const mbtiScores = dimensionsFor('mbti', answers)
  const pairs: Record<string, [string, string]> = { EI: ['E', 'I'], SN: ['S', 'N'], TF: ['T', 'F'], JP: ['J', 'P'] }
  const axes = Object.keys(pairs).reduce<Record<string, { left: number; right: number }>>((acc, axis) => {
    acc[axis] = { left: mbtiScores[axis], right: 100 - mbtiScores[axis] }
    return acc
  }, {})
  const type = Object.entries(pairs).map(([axis, letters]) => mbtiScores[axis] >= 50 ? letters[0] : letters[1]).join('')
  return { bigFive, values, politics, lifestyle, mbti: { type, axes } }
}

export const bigFiveMeta: Record<string, { name: string; high: string; mid: string; low: string; strength: string; risk: string; environment: string }> = {
  openness: { name: '开放性', high: '好奇、想象力丰富，乐于探索复杂与新颖事物。', mid: '能在新体验与熟悉路径之间灵活切换。', low: '务实、偏爱成熟方法与清晰具体的经验。', strength: '学习迁移与创新联想', risk: '可能追逐新意而分散精力', environment: '允许试验、跨界与持续学习的环境' },
  conscientiousness: { name: '尽责性', high: '目标明确、组织有序，能稳定兑现承诺。', mid: '既能计划，也能根据情境调整节奏。', low: '随性灵活，更依赖兴趣与即时反馈推进。', strength: '长期执行与可靠交付', risk: '可能过度控制或对偏差敏感', environment: '目标清楚、拥有自主安排空间的环境' },
  extraversion: { name: '外向性', high: '从互动与行动中获得能量，表达直接主动。', mid: '能适应独处与社交，在不同场合切换。', low: '通过独处恢复精力，偏好少量而深入的互动。', strength: '连接他人或深度专注', risk: '可能低估自己对独处或连接的真实需要', environment: '社交密度与个人恢复空间相匹配的环境' },
  agreeableness: { name: '宜人性', high: '重视合作、同理与关系中的相互照顾。', mid: '能兼顾合作氛围与必要的立场表达。', low: '判断独立、敢于质疑，不轻易为和谐让步。', strength: '建立信任或提出挑战', risk: '可能回避冲突或显得过于锋利', environment: '沟通坦诚、边界清晰且彼此尊重的团队' },
  neuroticism: { name: '情绪敏感度', high: '对风险与情绪信号敏锐，会提前察觉潜在问题。', mid: '有正常的警觉，也具备一定情绪恢复力。', low: '情绪稳定，压力下通常能够保持镇定。', strength: '风险预警或危机稳定', risk: '可能反复担忧，或低估细微信号', environment: '节奏可控、反馈明确、心理安全的环境' },
}

export const valueNames: Record<string, string> = {
  selfDirection: '自主', stimulation: '刺激', hedonism: '享乐', achievement: '成就', power: '权力',
  security: '安全', conformity: '遵从', tradition: '传统', benevolence: '关怀亲近者', universalism: '普遍关怀',
}

export const politicsMeta: Record<string, { left: string; right: string }> = {
  economic: { left: '经济平等', right: '市场自由' }, liberty: { left: '个人自由', right: '权威秩序' },
  global: { left: '全球开放', right: '本土优先' }, social: { left: '社会进步', right: '传统保守' },
}

export function level(score: number) { return score >= 66 ? '高' : score <= 34 ? '低' : '中' }

export function politicalDescription(key: string, score: number) {
  const meta = politicsMeta[key]
  if (score > 60) return `${meta.left}倾向`
  if (score < 40) return `${meta.right}倾向`
  return '中间或混合型'
}

export function getPersonaTitle(results: TestResults) {
  const v = results.values
  const p = results.politics
  if (v.selfDirection > 72 && results.bigFive.openness > 65) return '自主探索型'
  if ((v.universalism + v.benevolence) / 2 > 74) return '公平关怀型'
  if ((v.security + v.conformity) / 2 > 72 && p.liberty < 48) return '稳健秩序型'
  if ((v.achievement + v.power) / 2 > 68) return '成就推进型'
  if (results.bigFive.openness > 72 && p.social > 62) return '开放理想型'
  return '平衡整合型'
}
