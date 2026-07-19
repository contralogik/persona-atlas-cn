export type Section = 'bigfive' | 'values' | 'politics' | 'mbti' | 'lifestyle'

export interface Question {
  id: string
  section: Section
  dimension: string
  text: string
  direction: 1 | -1
}

export type Answers = Record<string, number>

export interface CountryProfile {
  id: string
  name: string
  region: string
  cityType: string
  language: string
  individualFreedom: number
  equality: number
  stability: number
  tradition: number
  openness: number
  individualism: number
  welfare: number
  pace: number
  familyFriendly: number
  warmth: number
  density: number
  career: number
  nature: number
  sociability: number
  diversity: number
  workLifeBalance: number
  languageDifficulty: number
}

export interface AxisResult { left: number; right: number }

export interface TestResults {
  bigFive: Record<string, number>
  values: Record<string, number>
  politics: Record<string, number>
  mbti: { type: string; axes: Record<string, AxisResult> }
  lifestyle: Record<string, number>
}

export interface CountryMatch {
  country: CountryProfile
  score: number
  reasons: string[]
  conflicts: string[]
}

export type View = 'intro' | 'quiz' | 'sectionComplete' | 'overview' | 'bigfive' | 'values' | 'politics' | 'mbti' | 'countries'
