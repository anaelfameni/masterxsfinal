// Couche de persistance abstraite. Implémentation localStorage par défaut.
// L'interface permet de brancher Supabase plus tard sans toucher au reste de l'app.

import { DATA_VERSION, emptyData, type MasterXSData, type Settings } from './types'

const DATA_KEY = 'masterxs:data:v1'
const SETTINGS_KEY = 'masterxs:settings:v1'
// Ancienne clé de l'analyseur d'idées, réutilisée pour ne pas perdre la clé Groq déjà saisie.
const LEGACY_GROQ_KEY = 'masterxs:idea-analyzer:groq-key'

export interface PersistenceAdapter {
  load(): MasterXSData
  save(data: MasterXSData): void
  loadSettings(): Settings
  saveSettings(settings: Settings): void
  clearAll(): void
}

function defaultSettings(): Settings {
  return {
    groqApiKey: localStorage.getItem(LEGACY_GROQ_KEY) || '',
    theme: 'dark',
  }
}

class LocalStorageAdapter implements PersistenceAdapter {
  load(): MasterXSData {
    try {
      const raw = localStorage.getItem(DATA_KEY)
      if (!raw) return emptyData()
      const parsed = JSON.parse(raw) as MasterXSData
      return this.migrate(parsed)
    } catch {
      return emptyData()
    }
  }

  save(data: MasterXSData): void {
    data.version = DATA_VERSION
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  }

  loadSettings(): Settings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (!raw) return defaultSettings()
      const parsed = JSON.parse(raw) as Partial<Settings>
      return { ...defaultSettings(), ...parsed }
    } catch {
      return defaultSettings()
    }
  }

  saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    // Compat : conserve la clé Groq sous l'ancienne clé pour l'analyseur existant.
    if (settings.groqApiKey) localStorage.setItem(LEGACY_GROQ_KEY, settings.groqApiKey)
    else localStorage.removeItem(LEGACY_GROQ_KEY)
  }

  clearAll(): void {
    localStorage.removeItem(DATA_KEY)
  }

  // Place pour les futures migrations de schéma.
  private migrate(data: MasterXSData): MasterXSData {
    const base = emptyData()
    return { ...base, ...data, version: DATA_VERSION }
  }
}

export const persistence: PersistenceAdapter = new LocalStorageAdapter()

// ── Export / Import JSON
export function exportData(data: MasterXSData, settings: Settings): string {
  return JSON.stringify(
    { kind: 'masterxs-backup', exportedAt: Date.now(), data, settings: { theme: settings.theme } },
    null,
    2
  )
}

export function parseImport(json: string): MasterXSData {
  const parsed = JSON.parse(json)
  const candidate = parsed?.data ?? parsed
  if (!candidate || typeof candidate !== 'object') {
    throw new Error('Fichier de sauvegarde invalide.')
  }
  const base = emptyData()
  return { ...base, ...candidate, version: DATA_VERSION }
}
