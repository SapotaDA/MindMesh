const MODELS_URL = 'https://generativelanguage.googleapis.com/v1/models'

type Req = { body?: any }

type Res = { status: (code: number) => Res; json: (body: any) => void }

export async function geminiListModelsController(req: Req, res: Res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is missing' })

    const url = `${MODELS_URL}?key=${encodeURIComponent(apiKey)}`
    const r = await fetch(url, { method: 'GET' })
    const text = await r.text()

    if (!r.ok) {
      return res.status(r.status).json({ error: 'Gemini list models failed', details: text })
    }

    // Best-effort parse
    let json: any = null
    try {
      json = JSON.parse(text)
    } catch {
      json = { raw: text }
    }

    // Return a trimmed view
    const models = Array.isArray(json?.models) ? json.models : []
    const simplified = models
      .slice(0, 50)
      .map((m: any) => ({ name: m?.name, displayName: m?.displayName }))

    return res.json({ count: models.length, sample: simplified, raw: undefined })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to list Gemini models'
    return res.status(500).json({ error: message })
  }
}

