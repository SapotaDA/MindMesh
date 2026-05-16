import { Loader2 } from 'lucide-react'

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 flex flex-col items-center justify-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-cyan-500/30 border border-white/10 flex items-center justify-center shadow-glow animate-float">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-200" />
      </div>
      <div className="text-sm text-white/70">Generating diagram…</div>
    </div>
  )
}

