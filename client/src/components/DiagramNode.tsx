import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'

type Data = {
  label: string
}

export default function DiagramNode({ data, selected }: NodeProps<Data>) {
  return (
    <div
      className={
        'relative rounded-2xl px-5 py-3 bg-white/10 border border-white/20 backdrop-blur-xl text-white shadow-glow text-center min-w-[140px] ' +
        (selected ? 'ring-2 ring-indigo-400/50 border-indigo-400/40' : '')
      }
    >
      {/* Top Handle for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-indigo-400 !border-white/20 !w-2.5 !h-2.5 !-top-1.5"
      />

      <div className="text-sm font-semibold leading-snug">{data.label}</div>
      <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-indigo-400/0 via-indigo-400/40 to-cyan-400/0" />

      {/* Bottom Handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-cyan-400 !border-white/20 !w-2.5 !h-2.5 !-bottom-1.5"
      />
    </div>
  )
}

