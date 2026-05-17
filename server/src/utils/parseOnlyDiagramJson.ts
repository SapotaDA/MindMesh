export function parseOnlyDiagramJson(raw: string): { nodes: any[]; edges: any[] } {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')

  // Extract first JSON object if there is surrounding text.
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  let candidate = firstBrace >= 0 && lastBrace > firstBrace ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned

  // Strip trailing commas before closing braces/brackets to prevent JSON parse errors
  candidate = candidate.replace(/,(\s*[\]}])/g, '$1')

  // Strip single-line JS-style comments (e.g., // comment) that LLMs occasionally insert
  candidate = candidate.replace(/(?<!https?:)\/\/.*$/gm, '')

  let parsed: any
  try {
    parsed = JSON.parse(candidate)
  } catch (e) {
    console.error('Failed to parse Gemini response as JSON. Raw response:', raw)
    console.error('Parsing candidate:', candidate)
    console.error('Error details:', e)
    throw new Error('Gemini did not return valid JSON')
  }

  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid AI JSON')
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) throw new Error('AI JSON must contain nodes and edges')

  // Minimal validation
  for (const n of parsed.nodes) {
    if (!n?.id || !n?.data?.label || !n?.position) throw new Error('Node format invalid')
  }
  for (const e of parsed.edges) {
    if (!e?.id || !e?.source || !e?.target) throw new Error('Edge format invalid')
  }

  return parsed
}

