// SaaS Idea Analyzer — type definitions
// Pipeline déterministe : Intake → Heuristique → (IA opt-in) → Verdict

export type QuestionType = 'text' | 'longtext' | 'select' | 'number'

export type BlockId = 'A' | 'B' | 'C'

export interface QuestionOption {
  value: string
  label: string
  /** Score impact 0-100 if this option chosen. Negative = red flag */
  score?: number
}

export interface Question {
  id: string
  block: BlockId
  /** Order within block, 1-based */
  order: number
  label: string
  helper?: string
  type: QuestionType
  placeholder?: string
  options?: QuestionOption[]
  required?: boolean
  /** Min chars for text/longtext to be considered "filled" */
  minLength?: number
  /** Number bounds */
  min?: number
  max?: number
}

export type AnswerValue = string | number | null

export interface Answers {
  [questionId: string]: AnswerValue
}

export type DimensionId =
  | 'pain'         // douleur client
  | 'wtp'          // willingness to pay
  | 'distribution' // canal d'acquisition
  | 'feasibility'  // faisabilité solo / 90 jours
  | 'market'       // taille accessible
  | 'founderFit'   // pourquoi toi

export interface Dimension {
  id: DimensionId
  label: string
  shortLabel: string
  weight: number  // somme = 1.0
  description: string
}

export interface DimensionScore {
  id: DimensionId
  score: number  // 0-100
  reasoning: string
}

export type Verdict = 'EXECUTE' | 'CONTINUE_CAUTION' | 'PIVOT' | 'KILL' | 'EARLY_KILL'

export interface VerdictMeta {
  id: Verdict
  label: string
  short: string
  description: string
  color: 'success' | 'warning' | 'danger' | 'info'
}

export interface RedFlag {
  questionId: string
  message: string
  severity: 'critical' | 'major' | 'minor'
}

export interface Strength {
  questionId: string
  message: string
}

export interface IdeaReport {
  id: string                  // YYYY-MM-DD-slug-rand
  createdAt: number
  updatedAt: number
  title: string               // résumé court (auto from Q1)
  slug: string
  answers: Answers
  scores: DimensionScore[]
  globalScore: number         // 0-100
  verdict: Verdict
  redFlags: RedFlag[]
  strengths: Strength[]
  pivots: string[]            // suggestions
  nextActions: string[]       // 1-3 concrete next steps
  earlyKill?: {
    reason: string
    action: string
  }
  aiAnalysis?: AiAnalysis
}

export interface AiAnalysis {
  generatedAt: number
  model: string
  summary: string             // 5 lignes max
  feasibilityScore: number    // 0-10
  profitabilityScore: number  // 0-10
  topRisks: string[]
  topStrengths: string[]
  nextSteps: string[]
  finalVerdict: string        // 2 phrases brutales
  rawResponse?: string
}
