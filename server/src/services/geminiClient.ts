import 'dotenv/config'

const DEFAULT_MODEL = 'gemini-2.0-flash'

type CallGeminiArgs = {
  prompt: string
  systemInstructions?: string
}

export async function callGemini({ prompt, systemInstructions }: CallGeminiArgs): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing')

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  // Gemini API (Google AI Studio) - generateContent endpoint.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`

  const body: Record<string, unknown> = {
    systemInstruction: systemInstructions ? { parts: [{ text: systemInstructions }] } : undefined,
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json'
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  const json: any = await res.json().catch(() => null)
  if (!res.ok) {
    const message = json?.error?.message || `Gemini request failed (${res.status})`
    throw new Error(message)
  }

  const text: string | undefined =
    json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join('') || undefined
  if (!text) throw new Error('Gemini returned empty response')
  return text
}





