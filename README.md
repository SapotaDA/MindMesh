# 🌌 MindMesh AI — Intelligent Mind Maps & Flowcharts

MindMesh AI is a state-of-the-art, high-performance web application that instantly converts raw, unstructured notes into highly organized, beautifully grouped, and perfectly spaced mind-map diagrams using **Gemini AI** and **React Flow**.

Featuring an elegant dark glassmorphic design and intelligent coordinate calculation, it makes notes review, topic planning, and document visualization beautiful and effortless.

---

## 🛠️ Architecture Overview

MindMesh AI uses a highly responsive, decoupled architecture designed for speed and modularity:

```mermaid
graph TD
    User([User's Web Browser]) -->|Paste Notes & Request| Client[Vite + React Frontend]
    Client -->|POST /generate-diagram| Server[Express + TS Backend]
    Server -->|Generate Request| Gemini[Google Gemini 2.0 Flash]
    Gemini -->|Strict JSON Response| Server
    Server -->|Dynamic X/Y Spacing & Math| Server
    Server -->|Structured Nodes & Edges| Client
    Client -->|Center Viewport & Connect Lines| User
```

---

## ✨ Core Features

*   **Intelligent Mind-Mapping**: Automatically categorizes unstructured notes, creates central root nodes, branches out categories, and cascading details vertically with custom math to ensure **zero overlaps**.
*   **Decoupled Architecture**: High-speed React client paired with a robust Express & TypeScript watch server.
*   **Resilient API Pipeline**: Configured with strict JSON-only outputs, robust regex trailing comma/comment cleaners, and a **3-attempt automatic retry loop** to survive LLM hiccups.
*   **Premium Interactive Board**: Full pan/zoom canvas, interactive mini-map navigation, custom glassmorphic React Flow nodes, animated connection paths, and seamless **PNG diagram exports**.
*   **Recruit-Ready Aesthetics**: Stunning dark-mode layout built using rich CSS tokens, harmony colors, elegant backdrop blurs, and premium micro-animations.

---

## 🚀 Premium Intelligent Layout & Parsing Engine

Unlike basic flowchart systems, MindMesh AI features an **advanced logical layout parser** and **rich visual schema**:

*   **Smart Sentence-Splitting Preprocessor**: Automatically breaks down dense, continuous paragraphs of text into distinct, logically flowing sentences.
*   **Rich Category Node Tagging**: Renders dynamic glowing cards based on semantic categories:
    *   `📥 Input` (Emerald) — Starting root nodes
    *   `📦 Group` (Slate) — Subject category headers
    *   `⚙️ Process` (Indigo) — Sequential workflow steps
    *   `📤 Output` (Rose) — Fanned-out parallel facts
    *   `⚡ Decision` (Amber) — Conditional logic
*   **Detailed Sub-Descriptions**: Renders secondary contextual text below labels without cluttering the flowchart view.
*   **Animated Smoothstep Edges**: Connects nodes with perfectly orthogonal, pulsing animated transition lines instead of rigid static edges.

---

## 🔧 NPM Workspaces Monorepo Architecture

MindMesh AI is structured as a professional **NPM Workspaces Monorepo**. This elegantly binds the Vite frontend (`client/`) and Express backend (`server/`) into a single cohesive project, allowing you to run both servers concurrently with one command.

---

## 🚀 Setup & Local Execution

### Prerequisites
*   **Node.js**: v18 or later
*   **Gemini API Key**: Secure from [Google AI Studio](https://aistudio.google.com/)

### 1️⃣ Environment Variables Setup
You must configure the environment variables for both the client and server.
```bash
# Backend Env
cd server
cp .env.example .env  # Add your GEMINI_API_KEY inside

# Frontend Env
cd ../client
cp .env.example .env  # Maps VITE_API_URL
cd ..
```

### 2️⃣ Install & Run (Single Unified Command)
Thanks to the monorepo setup, you can install dependencies and launch both the frontend and backend simultaneously from the root directory!

```bash
# Install all dependencies across the entire workspace
npm install

# Start both Vite (frontend) and Express (backend) development servers concurrently!
npm run dev
```

*   **Client Interface**: Active at [http://localhost:5173](http://localhost:5173)
*   **Backend API**: Running on [http://localhost:3001](http://localhost:3001)

---

## 📦 Production Builds

To compile and package the assets for high-performance deployments, run the unified build command from the root directory:

```bash
# Compiles both the backend TypeScript files and the frontend Vite assets sequentially
npm run build
```


