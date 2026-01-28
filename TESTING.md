# Testing Requirements

## Overview

All code changes **must pass the test suite** before being merged or marking user stories as passed. The build process now automatically runs tests first.

## Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Build Process

The `npm run build` command now:
1. Runs all tests (`npm run test`)
2. Type checks with TypeScript (`vue-tsc -b`)
3. Builds with Vite (`vite build`)

**If tests fail, the build will not proceed.**

## Test Coverage

### Current Test Suites

1. **colorUtils.test.ts** - Tests color calculation logic
   - Green/yellow/red thresholds
   - Boundary conditions
   - Edge cases (future timestamps)
   - Time mocking

2. **useFriends.test.ts** - Tests friends state management
   - Adding friends
   - Removing friends
   - Updating last contact
   - LocalStorage persistence
   - State isolation

3. **FriendTile.test.ts** - Tests friend tile component
   - Rendering
   - Color indicators
   - Click events
   - Delete functionality
   - Event propagation

### Test Statistics

- **Total Tests**: 29
- **Test Files**: 3
- **All Passing**: ✅

## Test Structure

```
src/
├── tests/
│   ├── setup.ts              # Test environment setup
│   ├── colorUtils.test.ts    # Unit tests for color utilities
│   ├── useFriends.test.ts    # Unit tests for friends composable
│   └── FriendTile.test.ts    # Component tests for FriendTile
└── ...
```

## Writing Tests

### Best Practices

1. **Use descriptive test names** - Clearly state what is being tested
2. **Test one thing at a time** - Each test should verify a single behavior
3. **Use beforeEach/afterEach** - Clean up state between tests
4. **Mock external dependencies** - Use Vitest's mocking capabilities
5. **Test edge cases** - Boundary conditions, null values, etc.

### Example Test

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../utils/myFunction'

describe('myFunction', () => {
  it('returns correct value for valid input', () => {
    const result = myFunction('test')
    expect(result).toBe('expected value')
  })
  
  it('handles edge case gracefully', () => {
    const result = myFunction('')
    expect(result).toBeDefined()
  })
})
```

## Critical Bug Fixed

### Color Transition Bug

**Issue**: Friend tiles were not transitioning from green → yellow → red over time.

**Root Cause**: The computed property `indicatorColor` was calculated once and never re-evaluated because Vue doesn't track `Date.now()` changes.

**Solution**: Added a reactive `currentTime` ref that updates every second, triggering the computed property to recalculate:

```typescript
// Reactive time reference that updates every second
const currentTime = ref(Date.now())
let intervalId: number | undefined

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

// Computed property now re-evaluates every second
const indicatorColor = computed(() => {
  currentTime.value // Make this reactive to time changes
  return getContactColor(props.friend.lastContact)
})
```

**Location**: `src/components/FriendTile.vue:15-32`

## Continuous Integration

Before committing:
1. Run `npm run build` to ensure tests pass
2. Fix any failing tests
3. Commit only when build succeeds

## User Story Acceptance Criteria

All user stories must now include:
- Functional requirements
- **Tests pass** (`npm run test`)
- Build succeeds (`npm run build`)

## Future Test Improvements

- [ ] Add integration tests for full app flow
- [ ] Add E2E tests with Playwright
- [ ] Increase coverage to 90%+
- [ ] Add visual regression tests
- [ ] Add performance tests
