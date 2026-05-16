export function parseDiagramResponse(raw: string): { nodes: any[]; edges: any[] } {
  // Strip markdown fences if Gemini returns them.
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')

  const parsed = JSON.parse(cleaned)

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI response is not a JSON object')
  }
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error('AI response must contain { nodes: [], edges: [] }')
  }

  return { nodes: parsed.nodes, edges: parsed.edges }
}

