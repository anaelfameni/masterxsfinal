// Modèle de données central de MasterXS Project Manager.
// Toutes les entités sont sérialisables en JSON (localStorage / export).

export type ID = string

export type ProjectPriority = 'P1' | 'P2' | 'P3'
export type ProjectStatus = 'idea' | 'validating' | 'active' | 'paused' | 'killed'
export type ProjectHealth = 'green' | 'yellow' | 'red'

export type TaskStatus = 'todo' | 'doing' | 'done'
export type TaskPriority = 'high' | 'normal' | 'low'

export interface SubTask {
  id: ID
  title: string
  done: boolean
}

export interface Task {
  id: ID
  projectId: ID | null
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  subtasks: SubTask[]
  deadline?: string | null // ISO date (YYYY-MM-DD)
  createdAt: number
  updatedAt: number
  order: number
}

export interface Project {
  id: ID
  name: string
  description?: string
  priority: ProjectPriority
  status: ProjectStatus
  health: ProjectHealth
  nextAction?: string
  blockedBy?: string | null
  deadline?: string | null
  mrr: number
  goalId?: ID | null
  color?: string
  createdAt: number
  updatedAt: number
  lastActivityAt: number
}

export interface KeyResult {
  id: ID
  label: string
  target: number
  current: number
  unit?: string
}

export interface Objective {
  id: ID
  title: string
  description?: string
  period?: string // ex: 2026-Q3
  projectId?: ID | null
  keyResults: KeyResult[]
  createdAt: number
  updatedAt: number
}

export interface Decision {
  id: ID
  title: string
  projectId?: ID | null
  context: string
  options: string
  decision: string
  consequences: string
  status: 'proposed' | 'accepted' | 'superseded'
  createdAt: number
  updatedAt: number
}

export type IdeaStage = 'raw' | 'scored' | 'converted' | 'killed'

export interface Idea {
  id: ID
  title: string
  pitch?: string
  category?: string
  stage: IdeaStage
  score?: number
  convertedProjectId?: ID | null
  createdAt: number
  updatedAt: number
}

export interface JournalEntry {
  id: ID
  date: string // YYYY-MM-DD
  content: string
  mood?: 1 | 2 | 3 | 4 | 5
  createdAt: number
  updatedAt: number
}

export interface Note {
  id: ID
  title: string
  content: string
  tags: string[]
  projectId?: ID | null
  createdAt: number
  updatedAt: number
}

export interface MeetingAction {
  id: ID
  text: string
  done: boolean
}

export interface Meeting {
  id: ID
  title: string
  date: string // YYYY-MM-DD
  attendees?: string
  notes: string
  actions: MeetingAction[]
  projectId?: ID | null
  createdAt: number
  updatedAt: number
}

export interface Habit {
  id: ID
  name: string
  emoji?: string
  // ISO dates (YYYY-MM-DD) où l'habitude a été accomplie
  log: string[]
  createdAt: number
  updatedAt: number
}

export interface FinanceEntry {
  id: ID
  projectId?: ID | null
  month: string // YYYY-MM
  mrr: number
  expenses: number
  note?: string
  createdAt: number
  updatedAt: number
}

export interface ChiefOfStaffReport {
  id: ID
  createdAt: number
  mode: 'ai' | 'offline'
  content: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  ts: number
}

export interface ChatConversation {
  id: ID
  mode: string // BusinessGPT mode id
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export interface Settings {
  groqApiKey: string
  theme: 'dark' | 'light'
}

export interface MasterXSData {
  version: number
  projects: Project[]
  tasks: Task[]
  objectives: Objective[]
  decisions: Decision[]
  ideas: Idea[]
  journal: JournalEntry[]
  notes: Note[]
  meetings: Meeting[]
  habits: Habit[]
  finances: FinanceEntry[]
  cosReports: ChiefOfStaffReport[]
  conversations: ChatConversation[]
}

export const DATA_VERSION = 1

export function emptyData(): MasterXSData {
  return {
    version: DATA_VERSION,
    projects: [],
    tasks: [],
    objectives: [],
    decisions: [],
    ideas: [],
    journal: [],
    notes: [],
    meetings: [],
    habits: [],
    finances: [],
    cosReports: [],
    conversations: [],
  }
}
