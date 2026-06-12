// Charge tous les fichiers .md du projet MasterXS via Vite import.meta.glob
// Le parent dossier est autorisé via vite.config.ts (server.fs.allow)

const rawModules = import.meta.glob('../../../*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const rawNested = import.meta.glob(
  [
    '../../../00-os-personnel/**/*.md',
    '../../../01-knowledge-base/**/*.md',
    '../../../02-discovery/**/*.md',
    '../../../03-scoring/**/*.md',
    '../../../04-build/**/*.md',
    '../../../05-gtm/**/*.md',
    '../../../06-retention/**/*.md',
    '../../../07-portfolio/**/*.md',
    '../../../08-meta/**/*.md',
    '../../../_templates/**/*.md',
  ],
  {
    query: '?raw',
    import: 'default',
    eager: true,
  }
) as Record<string, string>

export interface ContentFile {
  /** Path relative to MasterXS root, e.g. "00-os-personnel/identity.md" */
  path: string
  /** Just the filename, e.g. "identity.md" */
  filename: string
  /** Module slug if applicable, e.g. "00-os-personnel" */
  module: string | null
  /** Full markdown content */
  content: string
  /** Title extracted from first H1 or filename */
  title: string
  /** Whether this is just a stub or has real content */
  isStub: boolean
  /** Size in bytes */
  size: number
}

function normalizePath(absPath: string): string {
  // absPath like '../../../00-os-personnel/identity.md'
  // -> '00-os-personnel/identity.md'
  const cleaned = absPath.replace(/^(\.\.\/)+/, '').replace(/\\/g, '/')
  return cleaned
}

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) return match[1].trim()
  return fallback.replace(/\.md$/, '').replace(/[-_]/g, ' ')
}

function isStubContent(content: string): boolean {
  return /^_Stub initial/.test(content.replace(/^#[^\n]*\n+>?\s*/m, '').trim())
    || content.length < 250
}

function buildContentFile(rawPath: string, content: string): ContentFile {
  const path = normalizePath(rawPath)
  const segments = path.split('/')
  const filename = segments[segments.length - 1]
  const module = segments.length > 1 ? segments[0] : null
  return {
    path,
    filename,
    module,
    content,
    title: extractTitle(content, filename),
    isStub: isStubContent(content),
    size: new Blob([content]).size,
  }
}

const allRaw: Record<string, string> = { ...rawModules, ...rawNested }

export const allFiles: ContentFile[] = Object.entries(allRaw)
  .map(([k, v]) => buildContentFile(k, v))
  .sort((a, b) => a.path.localeCompare(b.path))

export const filesByPath: Record<string, ContentFile> = Object.fromEntries(
  allFiles.map((f) => [f.path, f])
)

export function getFile(path: string): ContentFile | undefined {
  return filesByPath[path]
}

export function getModuleFiles(moduleSlug: string): ContentFile[] {
  return allFiles.filter((f) => f.module === moduleSlug)
}

export function getPlaybook(): ContentFile | undefined {
  return filesByPath['MASTERXS-PLAYBOOK.md']
}

export function getReadme(): ContentFile | undefined {
  return filesByPath['README.md']
}

export function getChangelog(): ContentFile | undefined {
  return filesByPath['CHANGELOG.md']
}

// Statistics
export const stats = {
  totalFiles: allFiles.length,
  filledFiles: allFiles.filter((f) => !f.isStub).length,
  stubFiles: allFiles.filter((f) => f.isStub).length,
  totalSize: allFiles.reduce((sum, f) => sum + f.size, 0),
  modulesCount: new Set(allFiles.map((f) => f.module).filter(Boolean)).size,
}
