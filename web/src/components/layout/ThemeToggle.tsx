import { Moon, Sun } from 'lucide-react'
import { useStore } from '@/lib/store/StoreContext'

export default function ThemeToggle() {
  const { settings, updateSettings } = useStore()
  const isDark = settings.theme === 'dark'
  return (
    <button
      onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
      className="p-2 rounded-md hover:bg-bg-elevated text-fg-muted hover:text-fg transition-colors"
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
