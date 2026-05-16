import { callGemini } from './geminiClient'
import { parseOnlyDiagramJson } from '../utils/parseOnlyDiagramJson'

const SYSTEM_INSTRUCTIONS = `You are an expert diagram architect. Convert user notes into a clean flowchart.`

export async function generateDiagramService(notes: string): Promise<{ nodes: any[]; edges: any[] }> {
  const prompt = `Analyze the following notes and convert them into a structured flowchart.

Requirements:
- Return ONLY valid JSON (no markdown, no extra text).
- The JSON MUST match this format:
{
  "nodes": [
    {
      "id": "1",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "Start" }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}

Additional rules:
- Keep nodes clean and readable (short labels).
- Avoid overlapping nodes; lay out nodes in a left-to-right or top-to-bottom structure.
- Identify processes and relationships.
- Ensure at least 2 nodes when possible.

Notes:
"""
${notes}
"""`

  const raw = await callGemini({ prompt, systemInstructions: SYSTEM_INSTRUCTIONS })
  const diagram = parseOnlyDiagramJson(raw)

  return diagram
}

