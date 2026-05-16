# MindMesh AI

MindMesh AI converts your pasted notes into a structured flowchart diagram using **Gemini** + **React Flow**.

## Key Features
- Paste notes → generate a flowchart (nodes + edges)
- Loading + error states
- React Flow rendering (custom nodes, animated edges, zoom/pan, grid)
- Export diagram to **PNG**
- No authentication / no database (MVP)

## Architecture
- **Client** (`client/`): Vite + React + Tailwind + React Flow
- **Server** (`server/`): Express + Gemini API

## Prerequisites
- Node.js 18+
- Gemini API key

## Setup (Local)
### 1) Server
```bash
cd server
# create env file (see section below)
# cp .env.example .env
npm install
npm run dev
```

### 2) Client
In a new terminal:
```bash
cd client
# create env file (see section below)
# cp .env.example .env
npm install
npm run dev
```

- Client dev server: typically `http://localhost:5173`
- Backend: `http://localhost:3001`

## Environment Variables
> Note: This repo currently does not include `.env.example` files, so create them based on the variables used in code.

### Server (`server/`)
Create `server/.env`:
- `GEMINI_API_KEY` (required)
- `PORT` (optional, default: `3001`)

### Client (`client/`)
Create `client/.env`:
- `VITE_API_URL` (optional, default: `http://localhost:3001`)

## API
### `POST /generate-diagram`
- **URL**: `http://localhost:3001/generate-diagram`
- **Body**:
```json
{ "notes": "..." }
```
- **Response**:
```json
{ "nodes": [...], "edges": [...] }
```

### Health check
- `GET /health` → `{ "ok": true }`

## Development Scripts
### Server
- `npm run dev` – TypeScript watch server
- `npm run build` – build to `dist/`

### Client
- `npm run dev` – Vite dev server
- `npm run build` – production build

## Contributing
Contributions are welcome!

Suggested workflow:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-change`
3. Commit: `git commit -m "feat: ..."`
4. Push and open a PR

## License
MIT (if applicable) 


