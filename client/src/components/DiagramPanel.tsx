import { useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  useStore
} from 'reactflow'

import type { Node, Edge } from 'reactflow'


import LoadingOverlay from './LoadingOverlay'
import DiagramNode from './DiagramNode'



const nodeTypes = {
  diagramNode: DiagramNode
}

function DiagramContent({
  nodes,
  edges,
  isLoading,
  onExportPng
}: {
  nodes: Node[]
  edges: Edge[]
  isLoading: boolean
  onExportPng: () => Promise<void>
}) {
  const flowWrapper = useRef<HTMLDivElement | null>(null)
  const { fitView } = useReactFlow()

  const didFit = useRef(false)

  // Fit viewport on first meaningful update
  useMemo(() => {
    if (!didFit.current && nodes.length) {
      didFit.current = true
      queueMicrotask(() => fitView({ padding: 0.2, duration: 600 }))
    }
  }, [nodes, fitView])

  const zoom = useStore((s: any) => s.transform[2])


  return (
    <div ref={flowWrapper} className="relative h-[520px] sm:h-[580px] rounded-2xl overflow-hidden border border-white/10 bg-black/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        zoomOnScroll
        panOnDrag
        fitView={false}
        proOptions={{ hideAttribution: true }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        elevateEdgesOnSelect
        snapToGrid
      >
        <Background variant="dots" gap={22} size={1} color="rgba(255,255,255,0.08)" />
        <MiniMap
          nodeColor={(n: any) => {
            return 'rgba(99,102,241,0.35)'
          }}

          maskColor="rgba(0,0,0,0.65)"
        />
        <Controls
          position="bottom-right"
          showInteractive={false}
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14
          }}
        />
      </ReactFlow>

      {isLoading && <LoadingOverlay />}

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 backdrop-blur">
          Zoom: {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={onExportPng}
          className="px-3 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-white/10 hover:border-white/20 transition text-xs"
        >
          Export PNG
        </button>
      </div>
    </div>
  )
}

export default function DiagramPanel({
  nodes,
  edges,
  isLoading,
  onExportPng
}: {
  nodes: Node[]
  edges: Edge[]
  isLoading: boolean
  onExportPng: () => Promise<void>
}) {
  return (
    <ReactFlowProvider>
      <DiagramContent nodes={nodes} edges={edges} isLoading={isLoading} onExportPng={onExportPng} />
    </ReactFlowProvider>
  )
}

