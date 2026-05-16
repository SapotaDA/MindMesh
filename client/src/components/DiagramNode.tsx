import type { NodeProps } from 'react-flow-renderer'

type Data = {
  label: string
}

export default function DiagramNode({ data, selected }: NodeProps<Data>) {
  return (
    <div
      className={
        'relative rounded-2xl px-4 py-3 bg-white/5 border border-white/10 backdrop-blur-xl text-white shadow-glow ' +
        (selected ? 'ring-2 ring-indigo-400/40' : '')
      }
    >
      <div className="text-sm font-semibold leading-snug">{data.label}</div>
      <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-indigo-400/0 via-indigo-400/40 to-cyan-400/0" />
    </div>
  )
}

