// @ts-ignore - reactflow v11 exports these but tsc with Bundler resolution gets confused
import { Handle, Position } from 'reactflow'
// @ts-ignore
import type { NodeProps } from 'reactflow'

type Data = {
  label: string
  description?: string
  category?: 'process' | 'decision' | 'input' | 'output' | 'group'
}

export default function DiagramNode({ data, selected }: NodeProps<Data>) {
  let categoryTag = ''
  let categoryStyles = ''
  let handleColorClass = ''

  if (data.category === 'input') {
    categoryTag = '📥 Input'
    categoryStyles = 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
    handleColorClass = '!bg-emerald-400'
  } else if (data.category === 'decision') {
    categoryTag = '⚡ Decision'
    categoryStyles = 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
    handleColorClass = '!bg-amber-400'
  } else if (data.category === 'output') {
    categoryTag = '📤 Output'
    categoryStyles = 'border-rose-500/30 bg-rose-950/20 hover:border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.08)]'
    handleColorClass = '!bg-rose-400'
  } else if (data.category === 'group') {
    categoryTag = '📦 Group'
    categoryStyles = 'border-slate-500/20 bg-slate-900/40 hover:border-slate-400/40 shadow-[0_0_15px_rgba(148,163,184,0.04)]'
    handleColorClass = '!bg-slate-400'
  } else {
    categoryTag = '⚙️ Process'
    categoryStyles = 'border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.08)]'
    handleColorClass = '!bg-indigo-400'
  }

  return (
    <div
      className={
        `relative rounded-2xl px-5 pt-4 pb-3 border backdrop-blur-xl text-white shadow-glow text-center min-w-[160px] max-w-[240px] transition-all duration-200 ${categoryStyles} ` +
        (selected ? 'ring-2 ring-indigo-400/50 border-indigo-400/40 scale-[1.02]' : '')
      }
    >
      {/* Category floating badge */}
      <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-[#070A12] border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white/60 backdrop-blur">
        {categoryTag}
      </div>

      {/* Top Handle for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className={`${handleColorClass} !border-white/20 !w-2.5 !h-2.5 !-top-1.5`}
      />

      <div className="text-sm font-semibold leading-snug">{data.label}</div>
      
      {data.description && (
        <div className="mt-1.5 text-xs text-white/50 font-normal leading-relaxed text-center break-words">
          {data.description}
        </div>
      )}

      <div className="mt-2.5 h-[1px] w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

      {/* Bottom Handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${handleColorClass} !border-white/20 !w-2.5 !h-2.5 !-bottom-1.5`}
      />
    </div>
  )
}

