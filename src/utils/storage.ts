import type { Answers } from '../types'

const KEY = 'persona-atlas-progress-v1'

export interface SavedState { answers: Answers; currentIndex: number; updatedAt: number }

export function saveProgress(answers: Answers, currentIndex: number) {
  try { localStorage.setItem(KEY, JSON.stringify({ answers, currentIndex, updatedAt: Date.now() })) } catch { /* private mode or quota */ }
}

export function loadProgress(): SavedState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedState
    return parsed && typeof parsed.answers === 'object' ? parsed : null
  } catch { return null }
}

export function clearProgress() {
  try { localStorage.removeItem(KEY) } catch { /* ignore unavailable storage */ }
}

export function hasProgress() { return Boolean(loadProgress() && Object.keys(loadProgress()!.answers).length) }
