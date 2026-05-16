import { Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-cyan-500/30 border border-white/10 flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-indigo-200" />
          </div>
          <div>
            <div className="text-sm text-white/60">MindMesh AI</div>
            <div className="text-lg font-semibold tracking-tight">MindMesh AI</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            MVP Prototype
          </span>
        </div>
      </div>
    </header>
  )
}

