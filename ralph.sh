#!/bin/bash

# Ralph Loop - Autonomous AI Agent Loop
# Runs AI coding agent repeatedly until all PRD items complete

set -e

# Configuration
MAX_ITERATIONS=${1:-10}
TOOL=${2:-"opencode"}  # Default to opencode, can be "claude", "amp", etc.
PROMPT_FILE="PROMPT_build.md"

echo "=========================================="
echo "  Ralph Loop - Friends Radar"
echo "=========================================="
echo "Max iterations: $MAX_ITERATIONS"
echo "AI Tool: $TOOL"
echo ""

iteration=0

while [ $iteration -lt $MAX_ITERATIONS ]; do
    iteration=$((iteration + 1))
    
    echo ""
    echo "=========================================="
    echo "  Iteration $iteration of $MAX_ITERATIONS"
    echo "=========================================="
    echo ""
    
    # Check if all stories are complete
    if [ -f "prd.json" ]; then
        incomplete=$(jq '[.userStories[] | select(.passes == false)] | length' prd.json 2>/dev/null || echo "0")
        if [ "$incomplete" = "0" ]; then
            echo "<promise>COMPLETE</promise>"
            echo ""
            echo "All stories complete! Exiting Ralph loop."
            exit 0
        fi
        echo "Remaining stories: $incomplete"
    else
        echo "No prd.json found. Please create one first."
        echo "Run: Load the plan prompt and create specs for your feature"
        exit 1
    fi
    
    # Run the AI agent with fresh context
    case $TOOL in
        "claude")
            cat "$PROMPT_FILE" | claude-code
            ;;
        "amp")
            cat "$PROMPT_FILE" | amp
            ;;
        "opencode")
            cat "$PROMPT_FILE" | opencode
            ;;
        *)
            echo "Unknown tool: $TOOL"
            echo "Supported: claude, amp, opencode"
            exit 1
            ;;
    esac
    
    echo ""
    echo "Iteration $iteration complete. Sleeping 5s before next iteration..."
    sleep 5
done

echo ""
echo "Max iterations ($MAX_ITERATIONS) reached."
echo "Check progress.txt and prd.json for status."
