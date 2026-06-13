import { useRef, useState } from 'react'
import { Check, Download, Loader2, RotateCcw, Upload, Sparkles, Trash2 } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'
import { PageHeader, Card, Btn, Field, inputCls } from '@/components/ui/primitives'
import { GROQ_MODEL } from '@/lib/businessgpt/client'

export default function Settings() {
  const { settings, updateSettings, exportJSON, importJSON, loadSeed, resetAll } = useStore()
  const [keyDraft, setKeyDraft] = useState(settings.groqApiKey)
  const [testState, setTestState] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle')
  const [testMsg, setTestMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function saveKey() {
    updateSettings({ groqApiKey: keyDraft.trim() })
  }

  async function testKey() {
    setTestState('testing'); setTestMsg('')
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${keyDraft.trim()}` },
      })
      if (res.ok) { setTestState('ok'); setTestMsg('Clé valide.'); updateSettings({ groqApiKey: keyDraft.trim() }) }
      else { setTestState('fail'); setTestMsg(`HTTP ${res.status} — clé invalide ?`) }
    } catch (e) {
      setTestState('fail'); setTestMsg(e instanceof Error ? e.message : 'Erreur réseau')
    }
  }

  function doExport() {
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `masterxs-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function doImport(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importJSON(String(reader.result))
        alert('Sauvegarde importée avec succès.')
      } catch (e) {
        alert('Import échoué : ' + (e instanceof Error ? e.message : 'fichier invalide'))
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Réglages" subtitle="Clé API, thème, sauvegarde — tout reste sur ton appareil." />

      <div className="space-y-5">
        <Card className="space-y-3">
          <h2 className="font-medium text-fg">Clé API Groq (BusinessGPT)</h2>
          <p className="text-sm text-fg-muted">
            Gratuite sur <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-accent-400 underline">console.groq.com</a>.
            Modèle utilisé : <code className="text-accent-300">{GROQ_MODEL}</code>. Stockée uniquement en local.
          </p>
          <Field label="Clé API">
            <input type="password" value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} placeholder="gsk_…" className={inputCls} />
          </Field>
          <div className="flex items-center gap-2">
            <Btn variant="primary" onClick={saveKey}>Enregistrer</Btn>
            <Btn onClick={testKey} disabled={!keyDraft.trim() || testState === 'testing'}>
              {testState === 'testing' ? <Loader2 className="w-4 h-4 animate-spin" /> : testState === 'ok' ? <Check className="w-4 h-4 text-success" /> : null}
              Tester la connexion
            </Btn>
            {testMsg && <span className={`text-xs ${testState === 'ok' ? 'text-success' : 'text-danger'}`}>{testMsg}</span>}
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h2 className="font-medium text-fg">Thème</h2>
            <p className="text-sm text-fg-muted">Sombre par défaut.</p>
          </div>
          <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' })} className={`${inputCls} w-auto`}>
            <option value="dark">Sombre</option><option value="light">Clair</option>
          </select>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-medium text-fg">Sauvegarde des données</h2>
          <p className="text-sm text-fg-muted">Exporte ou restaure l'intégralité de MasterXS en JSON.</p>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={doExport}><Download className="w-4 h-4" /> Exporter JSON</Btn>
            <Btn onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4" /> Importer JSON</Btn>
            <input ref={fileRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = '' }} />
          </div>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-medium text-fg">Données de départ</h2>
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => { if (confirm('Charger le jeu d\'exemple ? Tes données actuelles seront remplacées.')) loadSeed() }}>
              <Sparkles className="w-4 h-4" /> Charger l'exemple
            </Btn>
            <Btn variant="danger" onClick={() => { if (confirm('Tout effacer ? Cette action est irréversible.')) resetAll() }}>
              <Trash2 className="w-4 h-4" /> Tout réinitialiser
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}
