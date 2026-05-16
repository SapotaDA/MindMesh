import 'dotenv/config'

export async function callGemini({
  prompt,
  systemInstructions
}: {
  prompt: string
  systemInstructions?: string
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing')

  // Gemini API (Google AI Studio) - generateContent endpoint.
  // Use a model that exists for the deployed API key.
  // (Validated via GET /gemini/models)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`



  const body = {
    systemInstruction: systemInstructions ? { parts: [{ text: systemInstructions }] } : undefined,
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const message = json?.error?.message || `Gemini request failed (${res.status})`
    throw new Error(message)
  }

  const text: string | undefined =
    json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join('') || undefined

  if (!text) throw new Error('Gemini returned empty response')
  return text
}

