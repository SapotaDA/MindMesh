import type { Request, Response } from 'express'
import { generateDiagramService } from '../../services/generateDiagramService'

export async function generateDiagramController(req: Request, res: Response) {
  try {
    const notes = typeof req.body?.notes === 'string' ? req.body.notes : ''
    if (!notes.trim()) {
      return res.status(400).json({ error: 'notes is required' })
    }

    const diagram = await generateDiagramService(notes)
    return res.json(diagram)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate diagram'
    return res.status(500).json({ error: message })
  }
}

