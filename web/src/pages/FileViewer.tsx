import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Pencil,
  Save,
  Eye,
  X,
  Loader2,
  Check,
  Columns2,
} from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { getFile } from '@/lib/content'
import { modulesBySlug } from '@/lib/playbook-data'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type ViewMode = 'preview' | 'edit' | 'split'

export default function FileViewer() {
  const params = useParams()
  const rawPath = params['*'] || ''
  const path = decodeURIComponent(rawPath)
  const file = getFile(path)

  const [mode, setMode] = useState<ViewMode>('preview')
  const [draft, setDraft] = useState<string>('')
  const [original, setOriginal] = useState<string>('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState<string>('')

  // Initialise draft when file changes
  useEffect(() => {
    if (file) {
      setDraft(file.content)
      setOriginal(file.content)
      setSaveState('idle')
    }
  }, [file?.path, file?.content])

  const isDirty = draft !== original

  const handleSave = useCallback(async () => {
    if (!file || !isDirty || saveState === 'saving') return
    setSaveState('saving')
    setSaveError('')
    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(file.path)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'unknown' }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      setOriginal(draft)
      setSaveState('saved')
      // Brief flash
      setTimeout(() => setSaveState('idle'), 1800)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e))
      setSaveState('error')
    }
  }, [file, draft, isDirty, saveState])

  // Ctrl+S save shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && mode !== 'preview') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave, mode])

  // Warn on unload if dirty
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  if (!file) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-8 h-8 text-warning mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-fg">Fichier introuvable</h2>
        <p className="mt-1 text-sm text-fg-muted font-mono">{path}</p>
        <Link
          to="/modules"
          className="mt-4 inline-flex items-center gap-2 text-accent-300 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Voir les modules
        </Link>
      </div>
    )
  }

  const module = file.module ? modulesBySlug[file.module] : undefined

  function discardChanges() {
    if (isDirty && !confirm('Annuler tes modifications non sauvegardées ?')) return
    setDraft(original)
    setMode('preview')
    setSaveState('idle')
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb back */}
      <div className="flex items-center gap-2 text-sm text-fg-muted">
        <Link to="/modules" className="hover:text-accent-300 transition-colors">
          Modules
        </Link>
        {module && (
          <>
            <span className="text-fg-faint">/</span>
            <Link
              to={`/modules/${file.module}`}
              className="hover:text-accent-300 transition-colors"
            >
              {module.shortTitle}
            </Link>
          </>
        )}
        <span className="text-fg-faint">/</span>
        <span className="text-fg font-medium truncate">{file.filename}</span>
      </div>

      {/* Stub warning */}
      {file.isStub && mode === 'preview' && (
        <div className="card p-4 bg-warning/5 border-warning/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-warning">Stub à enrichir</div>
            <p className="mt-1 text-xs text-fg-muted">
              Ce fichier est un squelette initial. Clique sur Éditer pour le remplir.
            </p>
          </div>
        </div>
      )}

      {/* File header + toolbar */}
      <header className="pb-4 border-b border-border flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-2xs uppercase tracking-widest text-accent-300 font-mono">
          <FileText className="w-3.5 h-3.5" />
          {file.path}
          {isDirty && (
            <span className="ml-2 inline-flex items-center gap-1 text-warning normal-case tracking-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              modifié
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switcher */}
          <div className="flex items-center bg-bg-elevated rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition ${
                mode === 'preview'
                  ? 'bg-accent-500/15 text-accent-300'
                  : 'text-fg-muted hover:text-fg'
              }`}
              title="Aperçu"
            >
              <Eye className="w-3.5 h-3.5" /> Aperçu
            </button>
            <button
              onClick={() => setMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition ${
                mode === 'split'
                  ? 'bg-accent-500/15 text-accent-300'
                  : 'text-fg-muted hover:text-fg'
              }`}
              title="Split (édition + preview live)"
            >
              <Columns2 className="w-3.5 h-3.5" /> Split
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition ${
                mode === 'edit'
                  ? 'bg-accent-500/15 text-accent-300'
                  : 'text-fg-muted hover:text-fg'
              }`}
              title="Édition"
            >
              <Pencil className="w-3.5 h-3.5" /> Éditer
            </button>
          </div>

          {mode !== 'preview' && (
            <>
              {isDirty && (
                <button
                  onClick={discardChanges}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md text-fg-muted hover:text-fg hover:bg-bg-elevated transition"
                  title="Annuler les modifications"
                >
                  <X className="w-3.5 h-3.5" /> Annuler
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!isDirty || saveState === 'saving'}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-accent-500 hover:bg-accent-400 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-glow-sm transition"
                title="Sauvegarder (Ctrl+S)"
              >
                {saveState === 'saving' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saveState === 'saved' && <Check className="w-3.5 h-3.5" />}
                {(saveState === 'idle' || saveState === 'error') && <Save className="w-3.5 h-3.5" />}
                {saveState === 'saving'
                  ? 'Sauvegarde...'
                  : saveState === 'saved'
                  ? 'Sauvegardé'
                  : 'Sauvegarder'}
              </button>
            </>
          )}
        </div>
      </header>

      {saveState === 'error' && (
        <div className="card p-3 bg-danger/5 border-danger/30 text-sm text-danger flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Erreur lors de la sauvegarde : {saveError}</span>
        </div>
      )}

      {/* Content area depending on mode */}
      {mode === 'preview' && (
        <article>
          <MarkdownRenderer content={original} />
        </article>
      )}

      {mode === 'edit' && (
        <div className="card overflow-hidden border-border">
          <CodeMirror
            value={draft}
            height="calc(100vh - 240px)"
            theme={oneDark}
            extensions={[markdown(), EditorView.lineWrapping]}
            onChange={(v) => setDraft(v)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              foldGutter: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: true,
              tabSize: 2,
            }}
          />
        </div>
      )}

      {mode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card overflow-hidden border-border">
            <div className="px-3 py-2 border-b border-border text-2xs uppercase tracking-widest text-fg-subtle font-mono bg-bg-elevated/50">
              Édition
            </div>
            <CodeMirror
              value={draft}
              height="calc(100vh - 280px)"
              theme={oneDark}
              extensions={[markdown(), EditorView.lineWrapping]}
              onChange={(v) => setDraft(v)}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                foldGutter: true,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                tabSize: 2,
              }}
            />
          </div>
          <div className="card border-border flex flex-col">
            <div className="px-3 py-2 border-b border-border text-2xs uppercase tracking-widest text-fg-subtle font-mono bg-bg-elevated/50">
              Aperçu live
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <MarkdownRenderer content={draft} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

