# CrewSphere AI — Full-stack project

This package contains the React/Vite frontend and the self-contained FastAPI/CrewAI backend reconstructed from the source files shared in the conversation.

## Important deployment separation

- Frontend: deploy the `frontend/` directory as a Vercel project.
- Backend: deploy the `backend/` directory as a separate Render Web Service.
- The backend uses `GEMINI_API_KEY` as a Render environment variable.
- This package does not modify or include the submitted `CREWAI` repository or its Render deployment.

## Frontend local run

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Vercel settings: Root Directory `frontend`; Framework Preset `Vite`; Build Command `npm run build`; Output Directory `dist`.

The frontend default API base URL is `https://crewai-bpy1.onrender.com`. The initial state deliberately ignores an older `crewApi` localStorage value so a stale saved URL cannot override the configured default. The Settings dialog can still save a custom endpoint.

## Backend local run

Create a virtual environment, install requirements, set `GEMINI_API_KEY`, then:

```bash
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000
```

Render settings:
- Root Directory: `backend`
- Runtime: Python
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Environment Variable: `GEMINI_API_KEY` = your Gemini API key

## API checks

- `GET /health` (if registered by this source version)
- `GET /openapi.json`
- `POST /agent1` through `POST /agent10` (JSON body `{"input":"..."}`)
- Agent 10 review route: inspect `/openapi.json` for its exact request schema before calling.

## Important verification status

The source bundle has been assembled and Python syntax compilation is checked. Agent 1 on the live service was tested successfully in PowerShell during the conversation. This does **not** prove that every agent, frontend production build, Vercel deployment, or a fresh Render deployment has been end-to-end tested. Test each agent with its required input format and check Render logs before considering the deployment production-ready.
