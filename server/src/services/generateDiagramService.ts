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

  console.log('[Fallback] Gemini API is currently unavailable or rate-limited. Serving intelligent local fallback mind-map layout.')
  return generateFallbackDiagram(notes)
}

/**
 * Intelligent local mind-map generator that parses notes line-by-line,
 * identifies subjects/themes, and lays them out as structured React Flow nodes & edges.
 */
export function generateFallbackDiagram(notes: string): { nodes: any[]; edges: any[] } {
  const lines = notes
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  if (lines.length === 0) {
    return {
      nodes: [
        {
          id: 'root',
          position: { x: 0, y: 0 },
          data: { label: 'Empty Notes' }
        }
      ],
      edges: []
    }
  }

  interface Category {
    title: string
    items: string[]
  }

  const categories: Category[] = []
  let currentCategory: Category | null = null

  for (const line of lines) {
    // A line is considered a bullet/fact (rather than a category header) if:
    // 1. It starts with common bullet symbols or numbering
    // 2. It ends with a period punctuation mark
    // 3. It is relatively long (longer than 30 characters)
    const startsWithBulletSymbol = /^[-\*\•\d+\.\)]/.test(line)
    const endsWithPeriod = line.endsWith('.')
    const isLong = line.length > 30

    const isBullet = startsWithBulletSymbol || endsWithPeriod || isLong

    if (!isBullet) {
      // It's a category header!
      currentCategory = { title: line, items: [] }
      categories.push(currentCategory)
    } else {
      // It's a list item or detailed fact under a category
      const cleanItem = line.replace(/^[-\*\•\d+\.\)\s]+/, '').trim()
      if (cleanItem) {
        if (!currentCategory) {
          // If no category header was found yet, create a default one
          currentCategory = { title: 'General Notes', items: [] }
          categories.push(currentCategory)
        }
        currentCategory.items.push(cleanItem)
      }
    }
  }

  // If no category blocks were populated, group everything under a default category
  if (categories.length === 0) {
    categories.push({
      title: 'General Notes',
      items: lines.map(line => line.replace(/^[-\*\•\d+\.\)\s]+/, '').trim()).filter(Boolean)
    })
  }

  const nodes: any[] = []
  const edges: any[] = []

  // 1. Central Root Node
  nodes.push({
    id: 'root',
    position: { x: 0, y: 0 },
    data: { label: 'Knowledge Map' }
  })

  // Horizontal layout parameters for categories
  const numCategories = categories.length
  const xSpacing = 350
  const startX = -((numCategories - 1) * xSpacing) / 2

  categories.forEach((cat, catIdx) => {
    const catId = `cat_${catIdx}`
    const catX = startX + catIdx * xSpacing
    const catY = 150

    // 2. Category Header Node
    nodes.push({
      id: catId,
      position: { x: catX, y: catY },
      data: { label: cat.title }
    })

    // Connect Root -> Category
    edges.push({
      id: `e-root-${catId}`,
      source: 'root',
      target: catId
    })

    // 3. Child nodes arranged vertically under the category
    let prevNodeId = catId
    cat.items.forEach((item, itemIdx) => {
      const itemId = `item_${catIdx}_${itemIdx}`
      const itemY = 300 + itemIdx * 150

      // Shorten display label if it's exceptionally long to maintain node aesthetics
      let displayLabel = item
      if (displayLabel.length > 40) {
        displayLabel = displayLabel.slice(0, 37) + '...'
      }

      nodes.push({
        id: itemId,
        position: { x: catX, y: itemY },
        data: { label: displayLabel }
      })

      // Connect sequentially: Category -> Sub-node 1 -> Sub-node 2 ...
      edges.push({
        id: `e-${prevNodeId}-${itemId}`,
        source: prevNodeId,
        target: itemId
      })

      prevNodeId = itemId
    })
  })

  return { nodes, edges }
}


