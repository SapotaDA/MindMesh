import { callGemini } from './geminiClient'
import { parseOnlyDiagramJson } from '../utils/parseOnlyDiagramJson'

const SYSTEM_INSTRUCTIONS = `You are an expert diagram architect and mind map designer. You excel at grouping disjointed notes into highly structured, beautiful, hierarchical flowcharts with perfect non-overlapping layouts.`

export async function generateDiagramService(notes: string): Promise<{ nodes: any[]; edges: any[] }> {
  const prompt = `Analyze the following user notes and convert them into a highly intelligent, structured mind map/flowchart diagram.

Architecture Rules:
1. **Hierarchical Grouping**:
   - Identify high-level categories, subjects, or themes in the notes.
   - If there are multiple separate categories (e.g., "Web Development", "AI/Tech", "Career"), create a single central root node (e.g., "Knowledge Map").
   - Create category nodes (e.g., "Web Dev", "AI & Tech") that branch out from the central root node.
   - Group the specific facts, details, or steps under their corresponding category nodes.
   - If there is only one linear topic, create a clear start-to-finish flowchart.

2. **Perfect Visual Layout (Coordinates)**:
   - Place the central root node at x: 0, y: 0.
   - Space the category nodes widely along the X-axis (e.g., x: -600, -300, 0, 300, 600) and slightly down the Y-axis (y: 150).
   - Lay out the sub-points, details, or processes vertically under each category node (e.g., y: 300, 450, 600...) maintaining the same category X coordinate, or staggered slightly for readability.
   - Avoid node overlaps at all costs by keeping X spacing at least 300px and Y spacing at least 150px.

3. **Node & Edge Specifications**:
   - Keep node labels concise, clean, and highly professional (maximum 6 words per label).
   - Connect the nodes logically with edges: Root -> Category -> Sub-point 1 -> Sub-point 2, etc.

Required JSON Schema:
{
  "nodes": [
    {
      "id": "root",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "Notes Overview" }
    },
    {
      "id": "cat1",
      "position": { "x": -300, "y": 150 },
      "data": { "label": "Web Development" }
    }
  ],
  "edges": [
    {
      "id": "e-root-cat1",
      "source": "root",
      "target": "cat1"
    }
  ]
}

User Notes:
"""
${notes}
"""`

  let attempts = 3
  let lastError: any = null

  for (let i = 0; i < attempts; i++) {
    try {
      console.log(`Diagram generation attempt ${i + 1} of ${attempts}...`)
      const raw = await callGemini({ prompt, systemInstructions: SYSTEM_INSTRUCTIONS })
      const diagram = parseOnlyDiagramJson(raw)
      return diagram
    } catch (err) {
      console.warn(`Attempt ${i + 1} failed:`, err instanceof Error ? err.message : err)
      lastError = err
    }
  }

  throw lastError || new Error('Failed to generate valid diagram JSON after multiple attempts')
}

