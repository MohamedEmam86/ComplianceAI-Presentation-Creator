# Presentation Creator Tool – README

## Overview
This repository contains a **single‑file, server‑less web application** (`index.html`) that lets users upload business data files, select a visual theme, toggle visualization components, and generate a **stand‑alone HTML presentation** (`presentation.html`). The UI runs entirely in the browser and includes a **Demo Mode** that simulates the three Gemini API calls with sample data.

## Files
- `index.html` – The complete SPA (HTML, CSS, JavaScript). Open it locally to test the demo.
- `walkthrough.md` – Documentation of the development steps, verification, and next actions.
- `implementation_plan.md` – Detailed implementation and deployment plan (already reviewed).
- `task.md` – Checklist of work items.

## Local Development
1. Clone or copy the repository to a local folder.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
3. Click **Demo Mode** and **Generate Presentation** to see the workflow.
4. The generated `presentation.html` will be offered for download. Open it offline to verify all components work.

## Production Deployment (Vercel)
1. **Create a Git repository** (GitHub, GitLab, Bitbucket) and push the files.
2. Sign in to **Vercel** and select **"Import Project"** → **"From Git Repository"**.
3. Choose the repository and keep the default settings (static site, output directory `.`).
4. **Add Environment Variable**:
   - Name: `GEMINI_API_KEY`
   - Value: *Your Gemini API key* (keep it secret).
5. Deploy – Vercel will build and serve `index.html` at `<your‑project>.vercel.app`.
6. The live UI will now be able to make real Gemini calls (replace the `parseUserFiles()` stub with actual file‑parsing logic).

## Next Development Steps
- Implement real file parsing for Excel, CSV, PDF, PPTX (e.g., `xlsx`, `pdfjs`).
- Replace the demo‑mode hard‑coded data with actual Gemini API calls using the stored `GEMINI_API_KEY`.
- Add automated tests (Cypress) for the generate flow.
- Optionally create additional visual themes.

---
*Prepared by Antigravity – Lead Architect*
