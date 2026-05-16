import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { generateDiagramController } from './routes/controllers/generateDiagramController'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/generate-diagram', generateDiagramController)

// Debug endpoint for Gemini API connectivity/model discovery (MVP-only)
app.get('/gemini/models', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is missing' })
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`
    const r = await fetch(url, { method: 'GET' })
    const text = await r.text()
    if (!r.ok) return res.status(r.status).json({ error: 'Gemini list models failed', details: text })
    let json: any = null
    try {
      json = JSON.parse(text)
    } catch {
      json = { raw: text }
    }
    const models = Array.isArray(json?.models) ? json.models : []
    const simplified = models.slice(0, 50).map((m: any) => ({ name: m?.name, displayName: m?.displayName }))
    return res.json({ count: models.length, sample: simplified })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to list Gemini models'
    return res.status(500).json({ error: message })
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(port, () => {
  console.log(`MindMesh AI server listening on http://localhost:${port}`)
})

