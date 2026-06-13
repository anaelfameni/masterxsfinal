// Client Groq généralisé : chat BusinessGPT + analyse Chief of Staff.
// Compatible OpenAI. Clé fournie par l'utilisateur (Réglages), jamais en dur.

import { BUSINESSGPT_CORE } from './knowledge'
import { getMode } from './modes'
import type { ChatMessage } from '../store/types'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
export const GROQ_MODEL = 'llama-3.3-70b-versatile'

export interface GroqResult {
  ok: boolean
  content: string
  error?: string
  hint?: string
}

function hintFor(status: number): string {
  if (status === 401) return 'Clé Groq invalide ou expirée. Régénère-la sur console.groq.com.'
  if (status === 429) return 'Quota Groq dépassé. Attends quelques minutes.'
  return ''
}

async function call(apiKey: string, messages: ChatMessage[], temperature = 0.5): Promise<GroqResult> {
  if (!apiKey) {
    return {
      ok: false, content: '',
      error: 'Clé API Groq manquante.',
      hint: 'Ajoute une clé gratuite (console.groq.com) dans Réglages.',
    }
  }
  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature,
        max_tokens: 1500,
      }),
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      return { ok: false, content: '', error: `Groq HTTP ${res.status} — ${txt.slice(0, 160)}`, hint: hintFor(res.status) }
    }
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content ?? ''
    return { ok: true, content }
  } catch (e) {
    return {
      ok: false, content: '',
      error: e instanceof Error ? e.message : String(e),
      hint: 'Vérifie ta connexion internet ou ta clé Groq.',
    }
  }
}

export async function chatBusinessGPT(
  apiKey: string,
  modeId: string,
  history: ChatMessage[]
): Promise<GroqResult> {
  const mode = getMode(modeId)
  const system: ChatMessage = {
    role: 'system',
    content: `${BUSINESSGPT_CORE}\n\n${mode.system}`,
    ts: 0,
  }
  return call(apiKey, [system, ...history], 0.6)
}

export async function chiefOfStaffAnalysis(
  apiKey: string,
  portfolioSummary: string
): Promise<GroqResult> {
  const system: ChatMessage = {
    role: 'system',
    content: `${BUSINESSGPT_CORE}\n\nTu agis ici comme CHIEF OF STAFF. On te donne l'état brut d'un portefeuille de projets. Produis une analyse courte et actionnable structurée en markdown avec EXACTEMENT ces sections :\n## Synthèse\n## Risques détectés\n## Recommandations\n## Question d'arbitrage\nLa dernière section contient UNE seule question décisive. Sois direct, pas de flatterie.`,
    ts: 0,
  }
  const user: ChatMessage = { role: 'user', content: portfolioSummary, ts: 0 }
  return call(apiKey, [system, user], 0.4)
}
