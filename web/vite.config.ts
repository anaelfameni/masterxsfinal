import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

// MasterXS root = parent of /web
const MASTERXS_ROOT = fileURLToPath(new URL('..', import.meta.url))

const ALLOWED_DIRS = [
  '00-os-personnel',
  '01-knowledge-base',
  '02-discovery',
  '03-scoring',
  '04-build',
  '05-gtm',
  '06-retention',
  '07-portfolio',
  '08-meta',
  '_templates',
]

const ALLOWED_ROOT_FILES = new Set([
  'MASTERXS-PLAYBOOK.md',
  'README.md',
  'CHANGELOG.md',
])

function safeResolve(relPath: string): string | null {
  // Reject anything weird
  if (!relPath || relPath.includes('\0')) return null
  const normalized = relPath.replace(/\\/g, '/').replace(/^\/+/, '')
  // Only .md
  if (!normalized.endsWith('.md')) return null
  // No traversal
  if (normalized.split('/').includes('..')) return null

  const segments = normalized.split('/')
  if (segments.length === 1) {
    if (!ALLOWED_ROOT_FILES.has(segments[0])) return null
  } else {
    if (!ALLOWED_DIRS.includes(segments[0])) return null
  }
  const absolute = resolve(MASTERXS_ROOT, ...normalized.split('/'))
  // Defense in depth: must still be under root
  const rootWithSep = resolve(MASTERXS_ROOT) + sep
  if (!(absolute + sep).startsWith(rootWithSep) && absolute !== resolve(MASTERXS_ROOT)) {
    return null
  }
  return absolute
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolveBody, rejectBody) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', rejectBody)
  })
}

function fileApiPlugin(): Plugin {
  return {
    name: 'masterxs-file-api',
    configureServer(server) {
      server.middlewares.use('/api/file', async (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const url = new URL(req.url || '', 'http://localhost')
          const relPath = url.searchParams.get('path') || ''
          const absolute = safeResolve(relPath)
          if (!absolute) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'invalid_path', path: relPath }))
            return
          }

          if (req.method === 'GET') {
            const content = await readFile(absolute, 'utf-8')
            const info = await stat(absolute)
            res.statusCode = 200
            res.end(JSON.stringify({ path: relPath, content, size: info.size, mtime: info.mtimeMs }))
            return
          }

          if (req.method === 'PUT') {
            const raw = await readBody(req)
            let parsed: { content?: string } = {}
            try {
              parsed = JSON.parse(raw)
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'invalid_json' }))
              return
            }
            if (typeof parsed.content !== 'string') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'missing_content' }))
              return
            }
            await mkdir(dirname(absolute), { recursive: true })
            await writeFile(absolute, parsed.content, 'utf-8')
            const info = await stat(absolute)
            res.statusCode = 200
            res.end(JSON.stringify({ path: relPath, size: info.size, mtime: info.mtimeMs, saved: true }))
            return
          }

          res.statusCode = 405
          res.end(JSON.stringify({ error: 'method_not_allowed' }))
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'server_error', message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), fileApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    fs: {
      // Allow reading markdown files from the parent MasterXS directory
      allow: ['..'],
    },
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-slug', 'rehype-autolink-headings', 'highlight.js'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
