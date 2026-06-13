import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Loader2, Plus, Trash2, KeyRound } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { Card, Btn } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'
import { BUSINESS_MODES, getMode } from '@/lib/businessgpt/modes'
import { chatBusinessGPT } from '@/lib/businessgpt/client'
import type { ChatConversation, ChatMessage } from '@/lib/store/types'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function BusinessGPT() {
  const { data, settings, setData, uid } = useStore()
  const [activeId, setActiveId] = useState<string | null>(data.conversations[0]?.id ?? null)
  const [modeId, setModeId] = useState<string>('mentor')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const conv = data.conversations.find((c) => c.id === activeId) ?? null

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [conv?.messages.length, loading])

  function upsertConv(c: ChatConversation) {
    setData((prev) => {
      const exists = prev.conversations.some((x) => x.id === c.id)
      return {
        ...prev,
        conversations: exists
          ? prev.conversations.map((x) => (x.id === c.id ? c : x))
          : [c, ...prev.conversations],
      }
    })
  }

  function newConversation() {
    setActiveId(null)
    setError(null)
  }

  function deleteConversation(id: string) {
    setData((prev) => ({ ...prev, conversations: prev.conversations.filter((c) => c.id !== id) }))
    if (activeId === id) setActiveId(null)
  }

  async function send() {
    if (!input.trim() || loading) return
    setError(null)
    const userMsg: ChatMessage = { role: 'user', content: input.trim(), ts: Date.now() }

    let current = conv
    if (!current) {
      current = {
        id: uid('conv'), mode: modeId,
        title: input.trim().slice(0, 40),
        messages: [], createdAt: Date.now(), updatedAt: Date.now(),
      }
      setActiveId(current.id)
    }
    const withUser: ChatConversation = {
      ...current, messages: [...current.messages, userMsg], updatedAt: Date.now(),
    }
    upsertConv(withUser)
    setInput('')
    setLoading(true)

    const res = await chatBusinessGPT(settings.groqApiKey, withUser.mode, withUser.messages)
    if (res.ok) {
      upsertConv({
        ...withUser,
        messages: [...withUser.messages, { role: 'assistant', content: res.content, ts: Date.now() }],
        updatedAt: Date.now(),
      })
    } else {
      setError(`${res.error}${res.hint ? ' — ' + res.hint : ''}`)
    }
    setLoading(false)
  }

  const mode = getMode(conv?.mode ?? modeId)

  return (
    <div className="flex gap-4 h-[calc(100vh-9rem)]">
      {/* Historique */}
      <div className="hidden md:flex flex-col w-56 shrink-0">
        <Btn variant="primary" onClick={newConversation} className="mb-3 justify-center">
          <Plus className="w-4 h-4" /> Nouvelle
        </Btn>
        <div className="flex-1 overflow-y-auto space-y-1">
          {data.conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                'group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer',
                activeId === c.id ? 'bg-accent-500/10 text-accent-300' : 'text-fg-muted hover:bg-bg-elevated'
              )}
              onClick={() => setActiveId(c.id)}
            >
              <span className="truncate">{c.title}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteConversation(c.id) }} className="opacity-0 group-hover:opacity-100 text-fg-faint hover:text-danger">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modes */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {BUSINESS_MODES.map((m) => {
            const selected = (conv?.mode ?? modeId) === m.id
            return (
              <button
                key={m.id}
                onClick={() => { if (!conv) setModeId(m.id) }}
                disabled={!!conv}
                title={m.tagline}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                  selected ? 'bg-accent-500/15 text-accent-300 border-accent-500/40' : 'border-border text-fg-muted hover:text-fg',
                  conv && !selected && 'opacity-40'
                )}
              >
                <m.icon className="w-3.5 h-3.5" /> {m.label}
              </button>
            )
          })}
        </div>

        {!settings.groqApiKey && (
          <Card className="mb-3 border-warning/30">
            <div className="flex items-start gap-3">
              <KeyRound className="w-4 h-4 text-warning mt-0.5" />
              <div className="text-sm text-fg-muted">
                Aucune clé API Groq. BusinessGPT a besoin d'une clé <strong>gratuite</strong>.{' '}
                Crée-la sur <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-accent-400 underline">console.groq.com</a>, puis ajoute-la dans{' '}
                <Link to="/settings" className="text-accent-400 underline">Réglages</Link>.
              </div>
            </div>
          </Card>
        )}

        <Card className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {!conv && (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <mode.icon className="w-8 h-8 text-accent-400 mb-3" />
                <p className="text-fg font-medium">Mode {mode.label}</p>
                <p className="text-sm text-fg-subtle mt-1 max-w-sm">{mode.tagline}. Pose ta question, je challenge tes idées sans flatterie.</p>
              </div>
            )}
            {conv?.messages.map((m, i) => (
              <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[85%] rounded-xl px-4 py-2.5 text-sm',
                  m.role === 'user' ? 'bg-accent-500/15 text-fg' : 'bg-bg-elevated text-fg-muted'
                )}>
                  {m.role === 'assistant' ? <MarkdownRenderer content={m.content} scrollToHash={false} /> : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-bg-elevated rounded-xl px-4 py-2.5"><Loader2 className="w-4 h-4 animate-spin text-accent-400" /></div>
              </div>
            )}
            {error && <p className="text-xs text-danger">{error}</p>}
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <textarea
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Écris ton message…"
              rows={1}
              className="flex-1 resize-none bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-accent-500/50 focus:outline-none"
            />
            <Btn variant="primary" onClick={send} disabled={loading}><Send className="w-4 h-4" /></Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}
