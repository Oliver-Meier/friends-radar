# Friends Radar - AI Agent Instructions

> **New to this project?** Read `RALPH.md` first for the full methodology.

## 🚨 MANDATORY COMPLIANCE REQUIREMENTS 🚨

**READ [COMPLIANCE.md](COMPLIANCE.md) BEFORE ANY CODE CHANGES**

**ALL CODE CHANGES MUST:**

1. ✅ **Pass all tests** - Run `npm run test` (33 tests must pass)
2. ✅ **Pass build** - Run `npm run build` (automatically runs tests + type check + build)
3. ✅ **Include tests** - Write tests for ANY new functionality
4. ✅ **Update tests** - Fix/update tests if changing existing code

**NEVER mark a user story as `passes: true` unless:**
- All tests pass (`npm run test`)
- Build succeeds (`npm run build`)
- If you added functionality, you added tests for it

**Build process enforces this:**
```bash
npm run build
  → runs tests first (BLOCKS if tests fail)
  → then type checks
  → then builds
```

See `TESTING.md` for full details.

---

## Quick Start for AI Agents

1. **Read these files in order**:
   - `COMPLIANCE.md` → **MANDATORY** - Testing requirements (read first!)
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
npm run test     # Run test suite (REQUIRED before marking stories complete)
npm run build    # Build for production (runs tests automatically, REQUIRED before commit)
npm run preview  # Preview production build
```

## Testing Requirements

**CRITICAL**: All changes must pass the test suite before:
- Marking user stories as complete (`passes: true`)
- Creating commits
- Merging to main branch

Run `npm run build` to verify - it will:
1. Run all tests (`npm run test`)
2. Type check with TypeScript
3. Build if tests pass

See `TESTING.md` for comprehensive testing documentation.

### Current Test Coverage
- **33 tests** across 3 test suites
- Unit tests: colorUtils, useFriends
- Component tests: FriendTile
- All tests must pass for build to succeed

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
3. **Write tests** for any new functionality
4. Run `npm run test` → All 33+ tests must pass
5. Run `npm run build` → Must pass (includes tests)
6. Commit with descriptive message
7. Update `prd.json` → Set `passes: true` and `tested: true`
8. Append to `progress.txt` → Document learnings
9. Exit

**Exit signals**:
- Story done: Exit normally
- All done: Output `<promise>COMPLETE</promise>`
- Blocked: Document in progress.txt, exit

**Critical Reminders**:
- Tests MUST pass before marking story complete
- If you modify existing code, update/fix affected tests
- If you add new features, write tests for them
- Never skip testing requirements
