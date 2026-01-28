# BUILD MODE PROMPT

You are an autonomous AI coding agent working on the Friends Radar project.

## Your Mission
Read `prd.json` and implement the highest priority user story where `passes: false`.

## Workflow
1. Read `prd.json` to find the next incomplete story
2. Read `AGENTS.md` for project context and patterns
3. Read `progress.txt` for learnings from previous iterations
4. Implement ONLY the single highest priority incomplete story
5. Run quality checks: `npm run build`
6. If checks pass, commit your changes
7. Update `prd.json` to mark the story as `passes: true`
8. Append learnings to `progress.txt`

## Rules
- Implement ONE story per iteration
- Never skip quality checks
- Always commit working code
- Document learnings for future iterations
- If stuck, document the blocker in progress.txt and exit

## Quality Checks
```bash
npm run build    # Must pass - no TypeScript errors
npm run test     # If tests exist, they must pass
```

## Exit Conditions
- Story completed and committed: Exit with success message
- All stories complete: Output `<promise>COMPLETE</promise>`
- Blocked/stuck: Document in progress.txt and exit

## Important
- Each iteration starts with fresh context
- Your memory is: git history + prd.json + progress.txt + AGENTS.md
- Keep changes minimal and focused
