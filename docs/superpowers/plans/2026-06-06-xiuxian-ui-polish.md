# Xiuxian UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve mobile UI hierarchy so only the practice page uses the full status dashboard while other pages show compact status and content remains visible above the bottom navigation.

**Architecture:** Keep the current static vanilla HTML/CSS/ES module app. Move dashboard markup into the practice panel, add a reusable compact status header for non-practice panels, reduce bottom navigation to five entries, and route realm/help/save/settings into a More panel. Keep gameplay logic unchanged except display formatting and feedback helpers.

**Tech Stack:** Vanilla JavaScript, HTML, CSS, Node test runner, Browser visual QA.

---

### Task 1: Static UI Contract Tests

**Files:**
- Modify: `test/browser-entry.test.js`

- [ ] Add failing assertions for five bottom tabs and the absence of Help as a primary tab.
- [ ] Add failing assertions for `fullStatusDashboard`, `compactStatusHeader`, `morePanel`, inventory filters, and progress reached copy.
- [ ] Run `npm test` and confirm the new assertions fail.

### Task 2: Markup Restructure

**Files:**
- Modify: `index.html`
- Modify: `src/app.js`

- [ ] Move hero, resource grid, progress, message, actions, and log into `practicePanel`.
- [ ] Add `compactStatusHeader` inside non-practice panels.
- [ ] Reduce bottom tabs to `practice`, `encounter`, `bag`, `npc`, and `more`.
- [ ] Move realm and help content into `morePanel`.
- [ ] Add top menu button and panel actions for fullscreen/reset/help/settings.

### Task 3: Rendering Improvements

**Files:**
- Modify: `src/app.js`

- [ ] Render compact Chinese-number status text.
- [ ] Clamp progress to 100% and show `已满足突破条件` when cultivation reaches the target.
- [ ] Add inventory category filters and rename the usable control to `可使用`.
- [ ] Limit visible logs to five and merge consecutive duplicate messages.
- [ ] Add disabled action reasons through button titles.

### Task 4: Visual System and Mobile Spacing

**Files:**
- Modify: `styles.css`

- [ ] Add safe-area bottom avoidance to the scroll shell and TabBar.
- [ ] Use unified card radius, border, shadow, and font scale.
- [ ] Make practice action buttons visible earlier and give buttons semantic colors.
- [ ] Convert inventory items to a stable two-column bag grid.
- [ ] Give the character/radar area fixed mobile-friendly dimensions.

### Task 5: Verification

**Files:**
- Test: `test/browser-entry.test.js`
- Test: `test/game.test.js`

- [ ] Run `npm test`.
- [ ] Start a local static server.
- [ ] Use Browser at mobile and desktop widths to verify no bottom overlap and primary content is visible.
