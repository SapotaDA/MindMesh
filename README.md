# MindMesh AI

MindMesh AI is a modern AI-powered MVP that converts pasted notes into structured flowchart diagrams using **Gemini** and **React Flow**.

## Features
- Single-page app (Home only)
- Paste notes → **Generate Diagram**
- Loading + error UI
- React Flow diagram rendering (custom nodes, animated edges, controls, grid)
- Export diagram to **PNG**
- No authentication, no database (MVP)

## Prerequisites
- Node.js 18+
- Gemini API key

## Setup
### 1) Server
```bash
cd server
cp .env.example .env
# set GEMINI_API_KEY
npm install
npm run dev
```

### 2) Client
In a new terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs on Vite (typically `http://localhost:5173`) and calls backend at `VITE_API_URL`.

## API
### `POST /generate-diagram`
- URL: `http://localhost:3001/generate-diagram`
- Body: `{ "notes": "..." }`
- Returns: `{ "nodes": [...], "edges": [...] }`

## Project Structure
- `client/` React + Vite + Tailwind + React Flow
- `server/` Express + Gemini API

