import { callGemini } from './geminiClient'
import { parseOnlyDiagramJson } from '../utils/parseOnlyDiagramJson'

const SYSTEM_INSTRUCTIONS = `You are an advanced AI system specialized in converting unstructured notes into intelligent visual diagrams for React Flow.
Your goal is to deeply analyze the user's notes and generate a professional, visually organized, and logically connected flowchart structure.

TASKS:
1. Understand the semantic meaning of the notes
2. Detect workflows, dependencies, hierarchies, and relationships
3. Identify:
   - main processes (category: process)
   - sub-processes (category: process)
   - decision points (category: decision)
   - parallel flows (category: process)
   - loops/repeated actions (category: process)
4. Remove redundant information
5. Merge similar concepts intelligently
6. Generate a clean and readable diagram structure
7. Automatically determine flow direction
8. Create balanced node spacing for visualization (horizontal spacing at least 350px, vertical at least 150px)
9. Group related concepts together
10. Prioritize important steps in the workflow

OUTPUT REQUIREMENTS:
Return ONLY valid JSON.

FORMAT:
{
  "nodes": [],
  "edges": []
}

NODE FORMAT:
{
  "id": "unique_id",
  "type": "diagramNode",
  "position": {
    "x": number,
    "y": number
  },
  "data": {
    "label": "Short concise label (max 5 words)",
    "description": "Brief explanation or description",
    "category": "process | decision | input | output | group"
  }
}

EDGE FORMAT:
{
  "id": "edge_id",
  "source": "source_node_id",
  "target": "target_node_id",
  "label": "optional relationship label",
  "animated": true,
  "type": "smoothstep"
}

ADVANCED RULES:
- Keep labels concise and professional
- Avoid duplicate nodes
- Detect chronological order automatically
- Detect cause-effect relationships
- Detect branching logic
- Generate scalable node positions: Root node should start near top-center (x: 0, y: 0)
- Parallel flows should branch horizontally (stagger X by at least 350px)
- Avoid overlapping nodes at all costs
- Return JSON only. No markdown, no extra text.`

export async function generateDiagramService(notes: string): Promise<{ nodes: any[]; edges: any[] }> {
  const prompt = `Analyze the following user notes and convert them into a highly intelligent, structured mind map/flowchart diagram following the requested React Flow advanced JSON format.

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
  let lines = notes
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  // Smart Preprocessor: If the input consists of a single large continuous paragraph (or extremely long lines),
  // split it by sentences to extract structured, logical key points instead of treating it as one massive block.
  if (lines.length <= 2 && lines.some(line => line.length > 120)) {
    const allSentences: string[] = []
    lines.forEach(line => {
      // Split by punctuation marks followed by spaces
      const sentences = line
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
      allSentences.push(...sentences)
    })
    lines = allSentences
  }

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
    type: 'diagramNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Knowledge Map',
      description: 'Starting entry point of visual notes',
      category: 'input'
    }
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
      type: 'diagramNode',
      position: { x: catX, y: catY },
      data: { 
        label: cat.title,
        description: 'Subject category group',
        category: 'group'
      }
    })

    // Connect Root -> Category
    edges.push({
      id: `e-root-${catId}`,
      source: 'root',
      target: catId,
      animated: true,
      type: 'smoothstep'
    })

    // Detect if this entire category represents a sequence/progression or independent facts
    const isSequential = cat.items.some(item => {
      const lower = item.toLowerCase()
      return (
        /^(step|then|after|finally|first|second|third|sends|receives|\d+[\.\)])/i.test(lower) ||
        lower.includes('then') ||
        lower.includes('leads to') ||
        lower.includes('sends') ||
        lower.includes('receives') ||
        lower.includes('processes') ||
        lower.includes('workflow') ||
        lower.includes('pipeline') ||
        lower.includes('->') ||
        lower.includes('=>')
      )
    })

    let prevNodeId = catId
    cat.items.forEach((item, itemIdx) => {
      const itemId = `item_${catIdx}_${itemIdx}`
      const itemY = 300 + itemIdx * 150

      // To spread parallel child nodes slightly horizontally (preventing crossing lines and looking fanned out)
      const xOffset = isSequential ? 0 : (itemIdx % 2 === 0 ? -45 : 45)
      const itemX = catX + xOffset

      // Shorten display label if it's exceptionally long to maintain node aesthetics
      let displayLabel = item
      if (displayLabel.length > 40) {
        displayLabel = displayLabel.slice(0, 37) + '...'
      }

      nodes.push({
        id: itemId,
        type: 'diagramNode',
        position: { x: itemX, y: itemY },
        data: { 
          label: displayLabel,
          description: 'Key point / extracted fact',
          category: isSequential ? 'process' : 'output'
        }
      })

      if (isSequential) {
        // Sequential progression layout
        edges.push({
          id: `e-${prevNodeId}-${itemId}`,
          source: prevNodeId,
          target: itemId,
          animated: true,
          type: 'smoothstep'
        })
        prevNodeId = itemId
      } else {
        // Parallel branching layout
        edges.push({
          id: `e-${catId}-${itemId}`,
          source: catId,
          target: itemId,
          animated: true,
          type: 'smoothstep'
        })
      }
    })
  })

  return { nodes, edges }
}


