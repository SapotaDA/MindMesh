import { useMemo, useState } from 'react'
import { Copy, Sparkles, Trash2 } from 'lucide-react'
import LoadingOverlay from './LoadingOverlay'

const exampleNotes = `MindMesh AI is designed to convert notes into diagrams.

1. Paste notes
2. Generate Diagram
3. Review flowchart

Key relationships:
- Notes describe processes
- Processes become nodes
- Relationships become edges

Output should be clean and readable.`

export default function NotesInputCard({
  value,
  onChange,
  onGenerate,
  isLoading,
  error,
  onCopyNotes,
  onClear
}: {
  value: string
  onChange: (v: string) => void
  onGenerate: () => void
  isLoading: boolean
  error?: string
  onCopyNotes: () => void
  onClear: () => void
}) {
  const isEmpty = useMemo(() => value.trim().length === 0, [value])

  return (
    <div className="relative glass-card overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/60">Your Notes</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">Paste and visualize instantly</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(exampleNotes)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition text-sm text-white/80"
            type="button"
          >
            Example
          </button>
          <button
            onClick={onCopyNotes}
            disabled={isEmpty}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 disabled:opacity-50 transition"
            type="button"
            aria-label="Copy notes"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={onClear}
            disabled={isEmpty}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 disabled:opacity-50 transition"
            type="button"
            aria-label="Clear notes"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your notes here…"
          className="w-full h-44 sm:h-48 rounded-2xl bg-black/20 border border-white/10 px-4 py-3 resize-none outline-none focus:border-indigo-400/40 focus:ring-1 focus:ring-indigo-400/30 transition text-sm"
        />

        {error && (
          <div className="mt-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs text-white/60">
          Tip: Use headings, numbered steps, or bullet points.
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || isEmpty}
          className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/25 to-cyan-500/30 border border-white/15 hover:border-white/25 hover:shadow-glow transition disabled:opacity-50"
          type="button"
        >
          <Sparkles className="h-4 w-4 text-indigo-200 group-hover:animate-float" />
          <span className="font-semibold">Generate Diagram</span>
        </button>
      </div>

      {isLoading && <LoadingOverlay />}
    </div>
  )
}

