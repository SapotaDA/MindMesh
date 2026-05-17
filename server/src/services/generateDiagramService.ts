import { callGemini } from './geminiClient'
import { parseOnlyDiagramJson } from '../utils/parseOnlyDiagramJson'

const SYSTEM_INSTRUCTIONS = `You are a world-class diagram architect, knowledge engineer, and mind-map layout specialist.
Your goal is to parse unstructured, technical notes and transform them into logically rigorous, highly valid, and visually flawless mind maps.

Quality Standards:
1. **Core Fact Extraction**: Extract only the absolute key points, crucial technical facts, and valid concepts. Do not include fluff, conversational filler, or redundant text.
2. **Strict Logical Rigor**:
   - Connection types must be logical. If sub-items are independent facts under a category, they must branch in parallel directly from the category node (Category -> Sub-point 1, Category -> Sub-point 2).
   - If sub-items represent a sequential step-by-step process or logical progression (e.g. "Step 1 -> Step 2 -> Step 3"), connect them sequentially in a vertical chain.
3. **No Hallucinations**: Only represent facts explicitly stated or directly inferred from the user's notes. Do not invent unrelated technical details.
4. **Visually Perfect Non-overlapping Coordinates**: Ensure horizontal spacing of at least 350px and vertical spacing of at least 150px. Alternating or offsetting coordinates is encouraged to prevent crossing lines.`

export async function generateDiagramService(notes: string): Promise<{ nodes: any[]; edges: any[] }> {
  const prompt = `Analyze the following user notes and convert them into a highly intelligent, structured mind map/flowchart diagram.

Core Information & Logical Linking Rules:
1. **Accurate Fact Extraction**:
   - Focus exclusively on the valid core key points and technical principles in the text.
   - Summarize every key point into a concise, professional label (maximum 5-6 words) that retains its complete meaning and validity.
2. **Logical Flowchart Structure**:
   - Root Node: Create a single central "Knowledge Map" node at (0, 0) if there are multiple topics.
   - Category Nodes: Branch high-level categories/subjects out from the root at y: 150.
   - Parallel Key Points: If points are independent facts or examples under a category (e.g., facts about React), branch them **in parallel** directly out of their Category node (Category -> Point 1, Category -> Point 2).
   - Sequential Processes: If points represent a process, chronological sequence, or logical cause-and-effect chain (e.g., step 1 leads to step 2), link them **sequentially** in a linear chain (Step 1 -> Step 2 -> Step 3).
3. **Flawless Layout Math**:
   - Place categories widely along the X-axis (e.g., -600, -300, 0, 300, 600) to keep columns completely separated.
   - For parallel branching under a category, stagger or offset their X coordinates slightly (e.g., catX - 45, catX + 45) or arrange them vertically with direct edge connections from the category, ensuring no overlaps occur.
   - Avoid crossings and overlapping nodes.

Required JSON Schema:
{
  "nodes": [
    {
      "id": "root",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "Knowledge Map" }
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
        position: { x: itemX, y: itemY },
        data: { label: displayLabel }
      })

      if (isSequential) {
        // Sequential progression layout
        edges.push({
          id: `e-${prevNodeId}-${itemId}`,
          source: prevNodeId,
          target: itemId
        })
        prevNodeId = itemId
      } else {
        // Parallel branching layout
        edges.push({
          id: `e-${catId}-${itemId}`,
          source: catId,
          target: itemId
        })
      }
    })
  })

  return { nodes, edges }
}


