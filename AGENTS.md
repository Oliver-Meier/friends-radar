# Friends Radar - AI Agent Instructions

> **New to this project?** Read `RALPH.md` first for the full methodology.

## Quick Start for AI Agents

1. **Read these files in order**:
   - `RALPH.md` → Methodology (read once to understand)
   - `AGENTS.md` → This file (project-specific context)
   - `prd.json` → Current stories and status
   - `progress.txt` → Recent learnings and blockers

2. **Determine your mode**:
   - **Ralph Loop**: Implement ONE story, commit, exit
   - **Interactive**: Help human with specific tasks

3. **Always before committing**: `npm run build`

---

## Project Overview

**Friends Radar** is a Vue.js + TypeScript application built with Vite.

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Composition API
- **Build Tool**: Vite
- **Package Manager**: npm
- **Methodology**: Ralph Loops (spec-driven autonomous AI coding)

## Commands
```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production (REQUIRED before commit)
npm run preview  # Preview production build
```

## Project Structure
```
friends-radar/
├── src/
│   ├── components/    # Vue components
│   ├── assets/        # Static assets
│   ├── App.vue        # Root component
│   └── main.ts        # Entry point
├── public/            # Public static files
├── specs/             # Feature specifications (write specs here)
├── prd.json           # User stories with pass/fail status
├── progress.txt       # Append-only iteration learnings
├── RALPH.md           # Full methodology documentation
├── PROMPT_build.md    # Build mode prompt
├── PROMPT_plan.md     # Plan mode prompt
└── ralph.sh           # Loop runner script
```

## Development Guidelines
1. Write TypeScript with strict types
2. Use Vue 3 Composition API (`<script setup lang="ts">`)
3. Keep components small and focused
4. Run `npm run build` before every commit
5. One story per iteration in Ralph mode

## Current Focus
- Initial project setup complete
- Ready for feature development
- Next: Define core features in `specs/`

## Known Patterns
- Vite dev server: `http://localhost:5173`
- TypeScript strict mode enabled
- Vue single-file components in `src/components/`

## Gotchas
(Add issues discovered during development)

---

## For Ralph Loop Mode

If you're running in the Ralph loop:

1. Read `prd.json` → Find highest priority story with `passes: false`
2. Implement ONLY that story
3. Run `npm run build` → Must pass
4. Commit with descriptive message
5. Update `prd.json` → Set `passes: true`
6. Append to `progress.txt` → Document learnings
7. Exit

**Exit signals**:
- Story done: Exit normally
- All done: Output `<promise>COMPLETE</promise>`
- Blocked: Document in progress.txt, exit
