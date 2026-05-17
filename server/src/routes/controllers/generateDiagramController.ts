import type { Request, Response } from 'express'
import { generateDiagramService } from '../../services/generateDiagramService'

export async function generateDiagramController(req: Request, res: Response) {
  try {
    const notes = typeof req.body?.notes === 'string' ? req.body.notes : ''
    if (!notes.trim()) {
      return res.status(400).json({ error: 'notes is required' })
    }

    console.log('Incoming notes to generate diagram:', JSON.stringify(notes))

    const diagram = await generateDiagramService(notes)
    return res.json(diagram)
  } catch (err) {
    let message = err instanceof Error ? err.message : 'Failed to generate diagram'
    
    if (message.includes('Quota exceeded') || message.includes('limit') || message.includes('429') || message.includes('rate-limit')) {
      message = 'Gemini API quota exceeded (Rate limit reached). Please wait a moment and try again.'
    }
    
    return res.status(500).json({ error: message })
  }
}

