import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import NotesInputCard from '../components/NotesInputCard'
import DiagramPanel from '../components/DiagramPanel'
import GlassCard from '../components/GlassCard'

import { generateDiagram } from '../api/generateDiagram'
import { toast } from '../utils/toast'


export default function HomePage() {
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  async function handleGenerate() {
    setError(undefined)
    const trimmed = notes.trim()
    if (!trimmed) return

    setIsLoading(true)
    try {
      const diagram = await generateDiagram(trimmed)
      setNodes(
        diagram.nodes.map((n: any) => ({
          ...n,
          type: 'diagramNode'
        }))
      )
      setEdges(
        diagram.edges.map((e: any, idx: number) => ({
          ...e,
          id: e.id || `e-${e.source}-${e.target}-${idx}`,
          animated: true
        }))
      )
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to generate diagram'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleCopyNotes() {
    navigator.clipboard.writeText(notes)
    toast('Notes copied')
  }

  function handleClear() {
    setNotes('')
    setError(undefined)
    setNodes([])
    setEdges([])
  }

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[920px] bg-gradient-to-r from-indigo-500/25 via-fuchsia-500/20 to-cyan-500/20 blur-3xl animate-[shimmer_10s_ease_infinite]" />
        <div className="absolute top-20 left-10 h-64 w-64 bg-indigo-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-60 right-10 h-72 w-72 bg-fuchsia-500/10 rounded-full blur-2xl animate-float" />

        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 relative">
          {/* Hero */}
          <section className="glass-card p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  AI-powered visualization
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                  Convert Notes into Intelligent Diagrams
                </h1>
                <p className="mt-3 text-white/70 max-w-2xl">
                  Paste your notes and instantly generate a clean, structured flowchart using Gemini and React Flow.
                  Designed for clarity, speed, and premium readability.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="text-sm font-semibold">Flowchart-ready</div>
                    <div className="text-xs text-white/60 mt-1">Processes → nodes, relationships → edges.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="text-sm font-semibold">Clean layout</div>
                    <div className="text-xs text-white/60 mt-1">Readable structure with minimal clutter.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="text-sm font-semibold">Exportable</div>
                    <div className="text-xs text-white/60 mt-1">Save your diagram as PNG or PDF.</div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <NotesInputCard
                  value={notes}
                  onChange={(v) => setNotes(v)}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  error={error}
                  onCopyNotes={handleCopyNotes}
                  onClear={handleClear}
                />
              </div>
            </div>
          </section>

          {/* Diagram */}
          <section className="mt-8">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <div className="text-sm text-white/60">Diagram Output</div>
                <div className="text-lg font-semibold tracking-tight">Generated flowchart</div>
              </div>
              <div className="text-xs text-white/60">Zoom, pan, and export anytime.</div>
            </div>

            <DiagramPanel nodes={nodes} edges={edges} isLoading={isLoading} />
          </section>

          <footer className="mt-10 text-center text-xs text-white/50">
            <div className="glass-card py-4">
              © {new Date().getFullYear()} MindMesh AI — MVP prototype (no authentication, no database).
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

