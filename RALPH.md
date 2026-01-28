# Ralph Loops - Autonomous AI Coding Method

## What is Ralph?

**Ralph** (aka "Ralph Wiggum") is an autonomous AI coding technique created by Geoffrey Huntley. The core idea is elegantly simple:

```bash
while :; do cat PROMPT.md | ai-agent ; done
```

Instead of having a human constantly guide an AI coding agent, Ralph runs the agent in a **loop** until all specified tasks are complete. Each iteration starts with **fresh context**, and progress persists through files and git history.

### Key Principles

1. **Loop, Don't Chat**: Run an AI agent repeatedly until a specification is fulfilled
2. **Fresh Context Each Iteration**: Each loop starts clean - no context window bloat
3. **File-Based Memory**: Progress persists via `prd.json`, `progress.txt`, and git history
4. **Backpressure Validation**: Tests, lints, and type checks validate each iteration
5. **Small Tasks**: Each story should be completable in one context window
6. **"Sit on the loop, not in it"**: Let the AI work autonomously

### Why It Works

- **No Context Rot**: Fresh context each iteration avoids degraded performance
- **Deterministic Progress**: Each iteration either completes a task or documents why not
- **Recoverable**: If something breaks, the next iteration can fix it
- **Scalable**: Run overnight, wake up to completed features

---

## Project Structure

```
friends-radar/
├── ralph.sh              # Main loop script - runs AI agent repeatedly
├── PROMPT_build.md       # Build mode: implement one story per iteration
├── PROMPT_plan.md        # Plan mode: create specs and prd.json
├── AGENTS.md             # Project context (tech stack, commands, patterns)
├── RALPH.md              # This file - method documentation
├── prd.json              # Product requirements with story status
├── progress.txt          # Append-only learnings from iterations
├── specs/                # Feature specifications
│   └── TEMPLATE.md       # Template for new features
└── src/                  # Application source code
```

---

## How to Use Ralph

### Phase 1: Planning (Human + AI)

1. **Write a feature spec** in `specs/feature-name.md`:
   - What problem are you solving?
   - What are the acceptance criteria?
   - What's out of scope?

2. **Generate the PRD** using plan mode:
   ```
   Read PROMPT_plan.md and create a prd.json for specs/feature-name.md
   ```

3. **Review the PRD** - ensure stories are small enough (one per context window)

### Phase 2: Building (Autonomous)

Run the Ralph loop:

```bash
# Default: 10 iterations with opencode
./ralph.sh

# Custom iterations
./ralph.sh 20

# Different AI tool
./ralph.sh 10 claude    # Use Claude Code
./ralph.sh 10 amp       # Use Amp
./ralph.sh 10 opencode  # Use OpenCode (default)
```

The loop will:
1. Read `prd.json` to find the next incomplete story
2. Implement that single story
3. Run quality checks (`npm run build`)
4. Commit if checks pass
5. Mark story as `passes: true`
6. Append learnings to `progress.txt`
7. Repeat until all stories complete

### Phase 3: Review (Human)

- Review git history for implemented changes
- Check `progress.txt` for any blockers or issues
- Test the application manually
- Create new specs for additional features

---

## For AI Agents: How to Pick Up Work

When you start a new session on this project, follow this sequence:

### 1. Read Context Files (in order)
```
1. RALPH.md        → Understand the methodology
2. AGENTS.md       → Project-specific context (tech stack, commands)
3. prd.json        → Current stories and their status
4. progress.txt    → Learnings from previous iterations
```

### 2. Determine Your Mode

**If running in Ralph loop** (PROMPT_build.md was provided):
- Find the highest priority story where `passes: false`
- Implement ONLY that single story
- Run quality checks
- Commit and update prd.json
- Append learnings to progress.txt
- Exit

**If interactive session** (human is chatting):
- Help with planning, debugging, or specific tasks
- Don't run the full Ralph workflow unless asked
- Update AGENTS.md with any new patterns discovered

### 3. Quality Checks

Always run before committing:
```bash
npm run build    # TypeScript compilation
npm run test     # If tests exist
npm run lint     # If linter configured
```

### 4. Exit Conditions

- **Story completed**: Commit, update prd.json, exit with success
- **All stories done**: Output `<promise>COMPLETE</promise>`
- **Blocked**: Document in progress.txt, exit (next iteration will try)

---

## PRD Format (prd.json)

```json
{
  "branchName": "feature/feature-name",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short descriptive title",
      "description": "What needs to be implemented",
      "acceptanceCriteria": [
        "Specific testable criterion 1",
        "Specific testable criterion 2"
      ],
      "priority": 1,
      "passes": false
    }
  ]
}
```

### Story Size Guidelines

**Good (right-sized)**:
- Add a single Vue component
- Create one API service function
- Add form validation for one form
- Implement one route/page skeleton

**Bad (too big - split these)**:
- "Build the user dashboard"
- "Add authentication"
- "Implement all API endpoints"

---

## Progress Tracking (progress.txt)

Each iteration appends learnings:

```markdown
## Iteration N - YYYY-MM-DD HH:MM
- Story: US-XXX - Story Title
- Status: Completed / Blocked
- Changes: Brief description of what was done
- Learnings: Patterns discovered, gotchas found
- Blockers: Any issues for next iteration
```

This file is **append-only** - never delete previous entries.

---

## Updating AGENTS.md

When you discover patterns or gotchas, add them to AGENTS.md:

```markdown
## Known Patterns
- This codebase uses X for Y
- Always import Z from this location

## Gotchas
- Don't forget to update W when changing X
- The settings are in an unexpected location
```

These learnings help future iterations (and human developers).

---

## Troubleshooting

### Loop Not Progressing
- Check `progress.txt` for blockers
- Verify stories are small enough
- Ensure quality checks are passing

### Context Too Large
- Break stories into smaller pieces
- Keep AGENTS.md under 60 lines
- Use git history instead of documenting everything

### Repeated Failures
- Add more detail to acceptance criteria
- Document the failing pattern in progress.txt
- Consider manual intervention for complex issues

---

## References

- [Original Ralph Article](https://ghuntley.com/ralph/) - Geoffrey Huntley
- [Everything is a Ralph Loop](https://ghuntley.com/loop/)
- [Awesome Ralph](https://github.com/snwfdhmp/awesome-ralph) - Curated resources
- [snarktank/ralph](https://github.com/snarktank/ralph) - Popular implementation

---

## Quick Commands

```bash
# Start development server
npm run dev

# Build (required before commit)
npm run build

# Run Ralph loop
./ralph.sh [iterations] [tool]

# Check story status
cat prd.json | jq '.userStories[] | {id, title, passes}'

# View recent learnings
tail -50 progress.txt
```
