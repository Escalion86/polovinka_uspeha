# Event Offline Save Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local retry queue for event create/update operations so temporary network failures do not lose submitted event data.

**Architecture:** Store pending event mutations in browser `localStorage` before sending the request. Integrate the queue only into `itemsFuncAtom.event.set`, then expose a small client indicator that can retry or clear queued operations for the current location.

**Tech Stack:** Next.js App Router, React client components, Jotai, existing `helpers/CRUD.js` fetch helpers, `localStorage`.

---

### Task 1: Pending Event Queue Utility

**Files:**
- Create: `utils/pendingEventMutations.js`

- [ ] **Step 1: Add storage helpers**

Create browser-safe helpers for reading, writing, upserting, removing, marking failed, clearing by location, and emitting a custom update event.

- [ ] **Step 2: Verify syntax**

Run: `npx eslint utils/pendingEventMutations.js`

Expected: no lint errors.

### Task 2: Integrate Event Save With Queue

**Files:**
- Modify: `state/itemsFuncAtom.js`

- [ ] **Step 1: Import queue helpers**

Import the helper functions from `@utils/pendingEventMutations`.

- [ ] **Step 2: Save event mutation before request**

For `itemName === 'event'`, upsert a queue item before `PUT` or `POST`.

- [ ] **Step 3: Remove queue item after success**

Remove the matching queue item inside the existing success callbacks.

- [ ] **Step 4: Mark queue item failed after request error**

Mark the matching queue item failed inside the existing error callbacks while preserving current snackbar and error modal behavior.

- [ ] **Step 5: Add retry function**

Add `obj.event.retryPending` that replays queued event mutations for the active `location`, updates Jotai state on success, and keeps failed entries if the retry fails.

### Task 3: Add UI Indicator And Auto-Retry

**Files:**
- Create: `components/PendingEventMutationsSync.js`
- Modify: `app/providers.jsx`

- [ ] **Step 1: Add client component**

Create a small fixed indicator that reads local queue state, shows queued count, and offers "Повторить" and "Сбросить".

- [ ] **Step 2: Auto retry**

Retry on component mount and on `window.online`.

- [ ] **Step 3: Mount in providers**

Render the component from `app/providers.jsx` so it is available across admin/client screens without changing each page.

### Task 4: Verify

**Files:**
- Verify: changed files

- [ ] **Step 1: Run lint**

Run: `npx eslint utils/pendingEventMutations.js components/PendingEventMutationsSync.js state/itemsFuncAtom.js app/providers.jsx`

Expected: no lint errors.

- [ ] **Step 2: Run project lint if scoped lint passes**

Run: `npx eslint .`

Expected: no new lint errors from changed files.

- [ ] **Step 3: Start dev server**

Run: `npm run dev`

Expected: Next.js dev server starts.

- [ ] **Step 4: Manual smoke**

Use browser DevTools offline mode on an event edit form. Submit changes, confirm local pending indicator appears, restore network, retry, and confirm the indicator disappears after successful save.
