# 🚨 COMPLIANCE REQUIREMENTS 🚨

**READ THIS FIRST - MANDATORY FOR ALL CODE CHANGES**

---

## Test Requirements

### Before ANY commit or marking stories complete:

1. ✅ **All tests MUST pass**
   ```bash
   npm run test
   ```
   - Currently: 29 tests must pass
   - Zero failures allowed

2. ✅ **Build MUST succeed**
   ```bash
   npm run build
   ```
   - Automatically runs tests first
   - Build will FAIL if tests fail
   - This is enforced at build time

3. ✅ **Write tests for new code**
   - Added a function? Write unit tests
   - Added a component? Write component tests
   - Changed behavior? Update existing tests

4. ✅ **Update tests when modifying code**
   - If tests fail after your changes, FIX THEM
   - Don't skip or disable tests
   - Ensure your changes don't break existing functionality

---

## Test Command Reference

```bash
# Run all tests once (use before commits)
npm run test

# Run tests in watch mode (use during development)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Build (includes tests automatically)
npm run build
```

---

## When Marking User Stories as Complete

A user story is **NOT complete** unless:

- [ ] All functional requirements met
- [ ] Tests written for new functionality
- [ ] All tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Set `passes: true` in prd.json
- [ ] Set `tested: true` in prd.json

---

## Build Process Workflow

```
npm run build
    ↓
[1] Run tests (npm run test)
    ↓
  PASS? → Continue
  FAIL? → STOP (build fails)
    ↓
[2] Type check (vue-tsc -b)
    ↓
  PASS? → Continue
  FAIL? → STOP (build fails)
    ↓
[3] Build (vite build)
    ↓
  SUCCESS! ✅
```

---

## Examples

### ✅ GOOD: Adding a feature with tests

1. Implement feature
2. Write tests for the feature
3. Run `npm run test` - all pass
4. Run `npm run build` - succeeds
5. Commit
6. Mark story as `passes: true, tested: true`

### ❌ BAD: Skipping tests

1. Implement feature
2. Skip writing tests ❌
3. Run `npm run build` - succeeds but no test coverage
4. Commit ❌
5. Mark story as complete ❌

**This is NOT acceptable!**

### ✅ GOOD: Fixing a bug

1. Reproduce bug
2. Write a test that fails (demonstrates bug)
3. Fix the bug
4. Test now passes ✅
5. Run `npm run build` - succeeds
6. Commit with test

### ❌ BAD: Breaking existing tests

1. Make changes
2. Run `npm run test` - 3 tests fail ❌
3. Disable those tests ❌❌❌
4. Commit ❌

**NEVER disable or skip tests! Fix the code or update the tests!**

---

## Documentation

For detailed testing documentation, see:
- **TESTING.md** - Comprehensive testing guide
- **AGENTS.md** - AI agent instructions
- **prd.json** - User stories with test requirements

---

## Current Test Statistics

- **Total Tests**: 29
- **Test Files**: 3
- **Must Pass**: 100%

Test locations:
- `src/tests/colorUtils.test.ts` - Color utility tests
- `src/tests/useFriends.test.ts` - Friends composable tests
- `src/tests/FriendTile.test.ts` - FriendTile component tests

---

## Questions?

If you're unsure about testing:
1. Read TESTING.md for examples
2. Look at existing test files
3. Ask before skipping tests

**Remember: Tests protect the codebase and catch bugs early!**
