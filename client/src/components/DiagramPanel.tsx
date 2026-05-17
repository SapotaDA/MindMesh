import { useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  useStore
} from 'reactflow'

import type { Node, Edge } from 'reactflow'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

import LoadingOverlay from './LoadingOverlay'
import DiagramNode from './DiagramNode'

const nodeTypes = {
  diagramNode: DiagramNode
}

function DiagramContent({
  nodes,
  edges,
  isLoading
}: {
  nodes: Node[]
  edges: Edge[]
  isLoading: boolean
}) {
  const flowWrapper = useRef<HTMLDivElement | null>(null)
  const { fitView, getNodes } = useReactFlow()
  const [isExporting, setIsExporting] = useState(false)

  const lastNodesLength = useRef(0)

  // Fit viewport on meaningful updates
  useEffect(() => {
    if (nodes.length > 0 && lastNodesLength.current === 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.2, duration: 600 })
      }, 100)
      return () => clearTimeout(timer)
    }
    lastNodesLength.current = nodes.length
  }, [nodes, fitView])

  const zoom = useStore((s: any) => s.transform[2])

  const handleExport = async (format: 'png' | 'pdf') => {
    try {
      const currentNodes = getNodes()
      if (currentNodes.length === 0) return

      setIsExporting(true)

      // Manually compute bounding box from node positions + estimated node size
      const NODE_W = 220
      const NODE_H = 100
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const n of currentNodes) {
        const x = n.position.x
        const y = n.position.y
        const w = (n as any).width ?? NODE_W
        const h = (n as any).height ?? NODE_H
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x + w > maxX) maxX = x + w
        if (y + h > maxY) maxY = y + h
      }

      const padding = 100
      const graphW = maxX - minX
      const graphH = maxY - minY
      const width = graphW + padding * 2
      const height = graphH + padding * 2

      // Compute scale so the whole graph fits inside the image dimensions
      const scale = Math.min(width / graphW, height / graphH, 2)
      const tx = padding - minX * scale
      const ty = padding - minY * scale

      // Capture only the react-flow viewport layer (excludes controls & minimap)
      const flowElement = document.querySelector('.react-flow__viewport') as HTMLElement
      if (!flowElement) return

      const dataUrl = await htmlToImage.toPng(flowElement, {
        backgroundColor: '#070A12',
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: 'top left'
        }
      })

      if (format === 'png') {
        const link = document.createElement('a')
        link.download = 'mindmesh-diagram.png'
        link.href = dataUrl
        link.click()
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height]
        })
        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height)
        pdf.save('mindmesh-diagram.pdf')
      }
    } catch (err) {
      console.error('Export failed', err)
    } finally {
      setIsExporting(false)
    }
  }

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
          nodeColor={() => 'rgba(99,102,241,0.35)'}
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
      
      {isExporting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <div className="text-sm font-semibold text-white tracking-widest uppercase">Exporting Diagram...</div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 backdrop-blur">
          Zoom: {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => handleExport('png')}
          disabled={isExporting || nodes.length === 0}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-white/10 hover:border-white/20 transition text-xs font-semibold disabled:opacity-50"
        >
          Export PNG
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting || nodes.length === 0}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-white/10 hover:border-white/20 transition text-xs font-semibold disabled:opacity-50"
        >
          Export PDF
        </button>
      </div>
    </div>
  )
}

export default function DiagramPanel({
  nodes,
  edges,
  isLoading
}: {
  nodes: Node[]
  edges: Edge[]
  isLoading: boolean
}) {
  return (
    <ReactFlowProvider>
      <DiagramContent nodes={nodes} edges={edges} isLoading={isLoading} />
    </ReactFlowProvider>
  )
}

