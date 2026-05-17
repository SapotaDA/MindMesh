import { parseDiagramResponse } from '../utils/parseDiagramJson'

export type DiagramNode = {
  id: string
  position: { x: number; y: number }
  data: { label: string }
}

export type DiagramEdge = {
  id: string
  source: string
  target: string
}

export async function generateDiagram(notes: string) { 

  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/generate-diagram`, {


    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  })

  const text = await res.text()
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const j = JSON.parse(text)
      message = j?.error || message
    } catch {
      message = text || message
    }
    throw new Error(message)
  }

  // Backend returns JSON; parse defensively.
  const raw = typeof text === 'string' ? text : JSON.stringify(text)
  const { nodes, edges } = parseDiagramResponse(raw)

  return { nodes: nodes as DiagramNode[], edges: edges as DiagramEdge[] }
}

