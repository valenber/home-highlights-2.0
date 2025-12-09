# Test Coverage Analysis - Home Highlights 2.0

**Generated:** 2025-12-09
**Overall Coverage:** 79.77% lines, 76.12% branches, 76.47% functions

## Executive Summary

The Home Highlights 2.0 codebase has a solid foundation of test coverage with 17 test files covering 104 test cases. However, there are significant gaps in coverage, particularly in critical service layer components and user-facing React components. This document identifies priority areas for improvement.

---

## Coverage Overview

| Category | % Statements | % Branch | % Functions | % Lines |
|----------|--------------|----------|-------------|---------|
| **Overall** | 79.72 | 76.12 | 76.47 | 79.77 |
| data/ | 100.00 | 95.23 | 100.00 | 100.00 |
| features/edit-event/ | 54.16 | 16.66 | 60.00 | 52.17 |
| features/event-expiration/ | 100.00 | 100.00 | 100.00 | 100.00 |
| features/event-search/ | 100.00 | 100.00 | 100.00 | 100.00 |
| features/shared/ | 89.65 | 71.42 | 100.00 | 89.65 |
| features/view-highlighted-events/ | 100.00 | 66.66 | 100.00 | 100.00 |
| pages/api/v1/ | 88.33 | 84.00 | 100.00 | 88.33 |
| pages/api/v2/ | 91.17 | 100.00 | 50.00 | 91.17 |
| **services/** | **38.55** | **27.27** | **27.77** | **39.74** |
| store/ | 100.00 | 75.00 | 100.00 | 100.00 |
| store/selectors/ | 100.00 | 87.50 | 100.00 | 100.00 |

---

## 🚨 Critical Priorities (High Impact)

### 1. services/api.ts - **3.03% Coverage**

**Impact:** CRITICAL
**Current Coverage:** 3.03% statements, 0% branches, 0% functions

This is the most critical gap. The API service handles all HTTP communication with the backend and is virtually untested.

**Uncovered Functionality:**
- Event CRUD operations (createEvent, updateEvent, deleteEvent, getAllEvents)
- Error handling and retry logic
- Request/response transformation
- Network failure scenarios

**Recommended Tests:**
```typescript
// services/api.spec.ts
describe('api service', () => {
  describe('getAllEvents', () => {
    it('should fetch and return all events')
    it('should handle network errors gracefully')
    it('should retry on failure')
  })

  describe('createEvent', () => {
    it('should create a new event with valid data')
    it('should reject invalid event data')
    it('should handle server errors')
  })

  describe('updateEvent', () => {
    it('should update an existing event')
    it('should handle 404 for non-existent events')
  })

  describe('deleteEvent', () => {
    it('should delete an event by ID')
    it('should handle deletion failures')
  })
})
```

**Effort Estimate:** 2-3 hours

---

### 2. services/auth.tsx - **60.86% Coverage**

**Impact:** HIGH
**Current Coverage:** 60.86% statements, 42.85% branches, 55.55% functions

Authentication is critical for security. Missing coverage includes:

**Uncovered Lines:** 41, 52-53, 70, 76, 81-95, 99-111

**Recommended Tests:**
```typescript
// Additional test cases needed:
describe('AuthProvider', () => {
  describe('session refresh', () => {
    it('should refresh expired sessions automatically')
    it('should handle refresh token expiration')
  })

  describe('error handling', () => {
    it('should handle network failures during auth check')
    it('should log out user on invalid session')
  })

  describe('edge cases', () => {
    it('should handle concurrent auth requests')
    it('should manage race conditions during session refresh')
  })
})
```

**Effort Estimate:** 1-2 hours

---

## 📊 High Priority (User-Facing Components)

### 3. features/edit-event/EditorForm.tsx - **NO TESTS**

**Impact:** HIGH
**Reason:** Core functionality for creating/editing events

**Recommended Tests:**
- Form field validation (name, dates, categories)
- Submit button state (enabled/disabled)
- Error message display
- Form reset after successful submission
- Draft state persistence
- Date picker validation (start date before end date)

**Effort Estimate:** 2-3 hours

---

### 4. features/view-candidate-events/CandidatesList.tsx - **NO TESTS**

**Impact:** HIGH
**Reason:** Primary view for managing candidate events

**Recommended Tests:**
- Renders candidate events for selected category
- Handles empty state (no candidates)
- Event action buttons work correctly
- Filters out non-candidate events
- Sorts events correctly

**Effort Estimate:** 1-2 hours

---

### 5. features/view-candidate-events/getCandidatesForSelectedCategory.ts - **NO TESTS**

**Impact:** MEDIUM
**Reason:** Redux selector that needs memoization

**Recommended Tests:**
- Filters candidates by category
- Returns empty array when no candidates
- Properly memoizes results (prevents unnecessary rerenders)

**Note:** This selector likely has the same memoization issue as `getHighlightsForSelectedCategory` (see Performance Issues section).

**Effort Estimate:** 30 minutes

---

### 6. pages/login.tsx - **NO TESTS**

**Impact:** HIGH
**Reason:** Authentication entry point

**Recommended Tests:**
- Renders login form
- Email/password validation
- Submit button disabled with invalid input
- Displays error messages on auth failure
- Redirects to homepage on successful login
- "Remember me" functionality

**Effort Estimate:** 1-2 hours

---

### 7. pages/index.tsx - **NO TESTS**

**Impact:** HIGH
**Reason:** Main application page

**Recommended Tests:**
- Renders with protected route
- Shows loading state while fetching events
- Displays error state on fetch failure
- Renders CategoriesTabs component
- Renders EventsView component
- Handles authentication redirects

**Effort Estimate:** 1-2 hours

---

## 🔧 Medium Priority (Supporting Components)

### 8. components/ProtectedRoute.tsx - **NO TESTS**

**Impact:** MEDIUM
**Reason:** Security component

**Recommended Tests:**
- Redirects unauthenticated users to login
- Allows authenticated users to access content
- Shows loading state during auth check
- Handles auth errors gracefully

**Effort Estimate:** 1 hour

---

### 9. features/edit-event/useForm.ts - **NO TESTS**

**Impact:** MEDIUM
**Reason:** Custom hook managing form state

**Recommended Tests:**
- Initializes with default values
- Updates field values correctly
- Validates form data
- Handles form submission
- Resets form state

**Effort Estimate:** 1 hour

---

### 10. features/event-search/useEventSearch.ts - **NO TESTS**

**Impact:** MEDIUM
**Reason:** Search functionality custom hook

**Recommended Tests:**
- Updates search query
- Filters events based on query
- Debounces search input
- Handles empty search results

**Effort Estimate:** 1 hour

---

### 11. Shared UI Components - **NO TESTS**

Multiple shared components lack tests:

- **CategoriesTabs.tsx** - Category navigation
- **EventsLoadingError.tsx** - Error display component
- **EventsLoadingProgressSpinner.tsx** - Loading indicator
- **EventsView.tsx** - Main events display container
- **NewEventButton.tsx** - Button to create new events
- **MatchedEventButton.tsx** - Button for matched events

**Recommended Tests (per component):**
- Renders correctly with props
- Handles user interactions
- Displays correct content
- Applies correct styling

**Effort Estimate:** 30 minutes per component (3 hours total)

---

### 12. Redux Selectors - **NO TESTS**

**Missing tests:**
- store/selectors/getAllStoreEvents.ts
- store/selectors/getSelectedCategory.tsx

**Recommended Tests:**
- Returns correct data from state
- Handles empty state
- Memoizes results properly

**Effort Estimate:** 30 minutes total

---

## ⚡ Performance Issues Identified

### Selector Memoization Warning

**File:** `features/view-highlighted-events/getHighlightsForSelectedCategory.ts`
**Issue:** Selector returns new array reference on each call, causing unnecessary rerenders

**Warning Message:**
```
Selector getHighlightsForSelectedCategory returned a different result when called
with the same parameters. This can lead to unnecessary rerenders.
```

**Fix Required:**
```typescript
// Use createSelector from @reduxjs/toolkit for proper memoization
import { createSelector } from '@reduxjs/toolkit';

export const getHighlightsForSelectedCategory = createSelector(
  [getAllStoreEvents, getSelectedCategory],
  (events, category) => events.filter(/* ... */)
);
```

**Same issue likely affects:**
- features/view-candidate-events/getCandidatesForSelectedCategory.ts

**Effort Estimate:** 15 minutes per selector

---

## 🎯 Component Coverage Improvements

### features/edit-event/EventButtonGroup.tsx - **52.17% Coverage**

**Uncovered Lines:** 49-83

**Missing Tests:**
- Event state transitions (candidate → highlight → mainfocus)
- Button visibility based on event state
- Delete event confirmation flow
- Error handling during state updates

**Effort Estimate:** 1 hour

---

### services/rollbar.tsx - **75% Coverage, 0% Functions**

**Uncovered Lines:** 16

**Missing Tests:**
- Error logging functionality
- Environment-specific configuration
- Error sanitization

**Effort Estimate:** 30 minutes

---

## 📋 Testing Infrastructure Improvements

### 1. Add Coverage Thresholds

Update `jest.config.js` to enforce minimum coverage:

```javascript
module.exports = {
  // ... existing config
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 75,
      lines: 80
    },
    './services/**/*.ts': {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90
    }
  }
};
```

**Effort Estimate:** 5 minutes

---

### 2. Add HTML Coverage Reports

Update `jest.config.js`:

```javascript
coverageReporters: ['text', 'html', 'json-summary'],
```

Add to `.gitignore`:
```
coverage/
```

**Benefit:** Visual coverage reports make it easier to identify gaps.

**Effort Estimate:** 5 minutes

---

### 3. Integration Tests

**Current Gap:** No end-to-end or integration tests

**Recommended:**
- Add Playwright or Cypress for E2E tests
- Test critical user flows:
  - Login → View events → Create event → Edit event → Delete event
  - Category switching
  - Event search
  - State transitions (candidate → highlight → mainfocus)

**Effort Estimate:** 4-8 hours

---

### 4. CI/CD Integration

**Recommendations:**
- Run tests on every PR
- Block merges if tests fail
- Generate and publish coverage reports
- Fail build if coverage drops below threshold

**Effort Estimate:** 1 hour (GitHub Actions workflow)

---

## 🎓 Testing Best Practices

### Current Strengths

1. ✅ Good test organization (co-located with source files)
2. ✅ Comprehensive data layer tests (100% coverage)
3. ✅ API endpoint tests
4. ✅ Redux state management tests
5. ✅ Custom test utilities (`renderWithProviders`)

### Areas for Improvement

1. **Component Tests:** Many React components lack tests
2. **Custom Hooks:** No tests for `useForm` and `useEventSearch`
3. **Error Scenarios:** Limited testing of error handling paths
4. **Edge Cases:** Missing tests for race conditions, concurrent requests
5. **Accessibility:** No tests for keyboard navigation, screen readers
6. **Performance:** Selector memoization issues

---

## 📊 Recommended Testing Roadmap

### Phase 1: Critical Fixes (Week 1)
**Effort:** 8-12 hours

1. ✅ Add tests for `services/api.ts` (3.03% → 90%)
2. ✅ Improve `services/auth.tsx` coverage (60% → 85%)
3. ✅ Fix selector memoization issues
4. ✅ Add coverage thresholds to Jest config

**Impact:** Addresses most critical gaps in service layer

---

### Phase 2: User-Facing Components (Week 2)
**Effort:** 8-12 hours

1. ✅ Test `pages/login.tsx`
2. ✅ Test `pages/index.tsx`
3. ✅ Test `features/edit-event/EditorForm.tsx`
4. ✅ Test `features/view-candidate-events/CandidatesList.tsx`
5. ✅ Test `components/ProtectedRoute.tsx`

**Impact:** Ensures core user flows are tested

---

### Phase 3: Supporting Components (Week 3)
**Effort:** 6-8 hours

1. ✅ Test custom hooks (`useForm`, `useEventSearch`)
2. ✅ Test shared UI components
3. ✅ Test remaining selectors
4. ✅ Improve `EventButtonGroup` coverage (52% → 90%)

**Impact:** Achieves comprehensive unit test coverage

---

### Phase 4: Integration & E2E (Week 4)
**Effort:** 8-12 hours

1. ✅ Set up Playwright or Cypress
2. ✅ Write E2E tests for critical user flows
3. ✅ Add visual regression testing
4. ✅ Configure CI/CD pipeline

**Impact:** Full testing pyramid with confidence in production

---

## 🎯 Success Metrics

**Target Coverage:**
- Overall: 85%+ line coverage
- Service Layer: 90%+ coverage
- Data Layer: Maintain 100%
- Components: 80%+ coverage

**Target Test Count:**
- Current: 104 tests in 17 files
- Goal: 200+ tests in 35+ files

**CI/CD Goals:**
- All PRs must pass tests
- Coverage must not decrease
- E2E tests run on staging deployments

---

## 📎 Useful Commands

```bash
# Run all tests with coverage
pnpm test --coverage

# Run specific test file
pnpm test path/to/file.spec.ts

# Run tests matching description
pnpm test -- -t "test name"

# Run tests in watch mode
pnpm test -- --watch

# Generate HTML coverage report
pnpm test --coverage --coverageReporters=html
# Open coverage/index.html in browser
```

---

## 🔍 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Redux Testing Guide](https://redux.js.org/usage/writing-tests)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Generated by Test Coverage Analysis Tool**
**Next Review:** After Phase 1 completion
