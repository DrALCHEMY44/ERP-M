"use client"

import * as React from "react"
import { FileText, Loader2, Eye } from "lucide-react"

export function DocumentPreview({ url, name, onOpen }: { url: string; name: string; onOpen: () => void }) {
  const container = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)
  const [preview, setPreview] = React.useState<{ kind: string; source: string } | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '100px' })
    if (container.current) observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!visible) return
    const controller = new AbortController()
    let objectUrl: string | undefined
    setPreview(null)
    setLoading(true)
    void (async () => {
      try {
        const target = new URL(url, window.location.origin)
        // Preview only authenticated application files, never arbitrary external HTML.
        if (target.origin !== window.location.origin || target.pathname !== '/api/files') return
        const response = await fetch(target, { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) return
        const blob = await response.blob()
        if (controller.signal.aborted) return
        const mime = blob.type.split(';')[0]
        if (['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(mime) || mime === 'application/pdf') {
          objectUrl = URL.createObjectURL(blob)
          setPreview({ kind: mime === 'application/pdf' ? 'pdf' : 'image', source: objectUrl })
        } else if (['text/plain', 'text/csv', 'application/json'].includes(mime)) {
          const text = await blob.slice(0, 5000).text()
          if (!controller.signal.aborted) setPreview({ kind: 'text', source: text })
        }
      } catch { /* Keep the document accessible when a thumbnail cannot load. */ }
      finally { if (!controller.signal.aborted) setLoading(false) }
    })()
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [url, visible])

  return <div ref={container} className="relative h-56 overflow-hidden border-b bg-slate-100">
    {loading ? <div className="grid h-full place-items-center" role="status"><Loader2 className="size-6 animate-spin text-muted-foreground" /><span className="sr-only">Loading preview</span></div>
      : preview?.kind === 'image' ? /* eslint-disable-next-line @next/next/no-img-element */
        <img src={preview.source} alt={`Contents of ${name}`} className="h-full w-full object-contain p-3" onError={() => setPreview(null)} />
      : preview?.kind === 'pdf' ? <iframe src={`${preview.source}#page=1&toolbar=0&navpanes=0&scrollbar=0`} title={`Preview of ${name}`} className="pointer-events-none h-full w-full border-0" tabIndex={-1} />
      : preview?.kind === 'text' ? <pre className="m-4 h-full overflow-hidden whitespace-pre-wrap break-words rounded bg-white p-4 font-mono text-[11px] leading-5 text-slate-700 shadow-sm">{preview.source}</pre>
      : <div className="flex h-full flex-col items-center justify-center gap-2 p-5 text-muted-foreground"><FileText className="size-9" /><span className="text-sm">Preview unavailable</span><span className="text-xs">Open to view this document</span></div>}
    <button type="button" onClick={onOpen} aria-label={`View ${name}`} className="absolute inset-0 flex items-end justify-center bg-transparent p-3 transition-colors hover:bg-slate-900/10 focus-visible:bg-slate-900/10">
      <span className="inline-flex items-center gap-2 rounded-full border bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"><Eye className="size-3.5" />Open document</span>
    </button>
  </div>
}
