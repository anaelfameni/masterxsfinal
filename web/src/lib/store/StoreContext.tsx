import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  persistence,
  exportData as serialize,
  parseImport,
} from './persistence'
import { emptyData, type MasterXSData, type Settings } from './types'
import { seedData } from './seed'

function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

interface StoreContextValue {
  data: MasterXSData
  settings: Settings
  setData: (updater: (prev: MasterXSData) => MasterXSData) => void
  updateSettings: (patch: Partial<Settings>) => void
  uid: (prefix?: string) => string
  touchProject: (projectId: string) => void
  loadSeed: () => void
  resetAll: () => void
  exportJSON: () => string
  importJSON: (json: string) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<MasterXSData>(() => persistence.load())
  const [settings, setSettings] = useState<Settings>(() => persistence.loadSettings())

  useEffect(() => {
    persistence.save(data)
  }, [data])

  useEffect(() => {
    persistence.saveSettings(settings)
    const root = document.documentElement
    if (settings.theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    }
  }, [settings])

  const setData = useCallback((updater: (prev: MasterXSData) => MasterXSData) => {
    setDataState((prev) => updater(prev))
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const touchProject = useCallback((projectId: string) => {
    setDataState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId ? { ...p, lastActivityAt: Date.now(), updatedAt: Date.now() } : p
      ),
    }))
  }, [])

  const loadSeed = useCallback(() => setDataState(seedData()), [])
  const resetAll = useCallback(() => setDataState(emptyData()), [])

  const exportJSON = useCallback(() => serialize(data, settings), [data, settings])
  const importJSON = useCallback((json: string) => {
    const next = parseImport(json)
    setDataState(next)
  }, [])

  const value = useMemo<StoreContextValue>(
    () => ({
      data, settings, setData, updateSettings, uid, touchProject,
      loadSeed, resetAll, exportJSON, importJSON,
    }),
    [data, settings, setData, updateSettings, touchProject, loadSeed, resetAll, exportJSON, importJSON]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
