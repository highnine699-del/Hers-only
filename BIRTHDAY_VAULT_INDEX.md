# BIRTHDAY VAULT — BUILD SYSTEM INDEX

**Three documents. One project. Zero guesswork.**

---

## OVERVIEW

You now have a **production-ready, self-sufficient build system** for Birthday Vault.

Three files work together:

1. **BIRTHDAY_VAULT_BUILD_PROMPT.md** — The Master Plan
   - Architecture (non-negotiable rules)
   - Phase-by-phase build specifications
   - Exact file paths, exports, and implementations
   - Verification checklists for each phase

2. **PHASE_VALIDATION.md** — Pass/Fail Gates
   - Step-by-step validation for every phase
   - Console tests that prove correctness
   - Exit criteria (do not advance without passing)
   - Mobile verification steps

3. **QUICK_REFERENCE.md** — Survival Guide
   - Common operations (how to do X)
   - Debugging (when something breaks)
   - Performance tips
   - Mobile-specific issues
   - Git workflows

---

## HOW TO USE (WORKFLOW)

### START OF EACH PHASE

1. **Read Master Plan** (`BIRTHDAY_VAULT_BUILD_PROMPT.md`)
   - Go to the relevant PHASE section (e.g., "PHASE 3 — ENVELOPE & LETTER")
   - Read **Deliverables** (exact files to create)
   - Read **Verification** (what happens after)

2. **Build the Phase**
   - Copy code blocks from Master Plan directly into IDE
   - Follow file paths exactly (`src/engine/director/director.js`, not `engine/director.js`)
   - Do not improvise or "refactor" while building
   - Commit each file as you create it

3. **Run Validation** (`PHASE_VALIDATION.md`)
   - Go to relevant PHASE VALIDATION section
   - Run each test step in order
   - If any fails, consult QUICK_REFERENCE troubleshooting
   - Do not proceed to next phase until ALL pass

### WHEN STUCK

1. **Open QUICK_REFERENCE.md**
   - Search for symptom in "DEBUGGING CHECKLIST"
   - Follow suggested fix
   - Test in browser console

2. **If not listed:**
   - Check COMMON MISTAKES at end of relevant phase (Master Plan)
   - Run validation tests (PHASE_VALIDATION)
   - Check git diff to see what changed (`git diff HEAD~1`)

3. **If still stuck:**
   - Run `git log --oneline | head -20` and find last working state
   - `git checkout <hash>` to restore
   - Re-read Master Plan section (you may have misunderstood)

### END OF EACH PHASE

1. **All tests pass** (PHASE_VALIDATION)
2. **Console is clean** (no red errors)
3. **Commit cleanly:** `git commit -m "phase-X: [description]"`
4. **Update progress in this file** (mark ✓)

---

## DOCUMENT MAP

### Master Plan (`BIRTHDAY_VAULT_BUILD_PROMPT.md`)

**Read when:** Starting a phase, implementing a feature, understanding architecture

**Sections:**
- **PART A: Architectural Law** — The 5 rules that prevent bugs
  - A.1: Director Never Uses String Keys
  - A.2: Director Uses GSAP Context
  - A.3: Recovery Syncs State
  - A.4: Zero Magic Numbers
  - A.5: Assets Centralized
- **PART B: Codebase Verification** — Self-checks to run
- **PART C: Phase-by-Phase Build Spec** — Detailed implementation per phase
  - PHASE 1: Shell & Director
  - PHASE 2: Countdown & Vault
  - PHASE 3: Envelope & Letter
  - PHASE 4-9: (abbreviated, same structure)
- **PART D: Critical Runtime Checks** — Validation code
- **PART E: Deployment Checklist** — Before GitHub Pages
- **PART F: Emergency Recovery** — Last resort if corrupted

**Key tables:**
- File architecture (Part C)
- MorphRegistry validation (Part B.5)
- Common mistakes (end of each phase)

---

### Phase Validation (`PHASE_VALIDATION.md`)

**Read when:** Finishing a phase, testing implementation, verifying correctness

**Sections:**
- **PHASE 1-7 VALIDATION** — 10 step verification for each
  - Visual checks (what you see)
  - Logical checks (what console shows)
  - Code checks (imports and functions)
  - Interaction checks (user tests)
- **EXIT CRITERIA** — Must-pass checklist before advancing
- **Abbreviated validation** — Phase 4-7 (follow same pattern)
- **Phase 8-9** — Polish and content fill
- **Deployment validation** — Pre-launch tests

**Key tables:**
- Phase 1-3 full specs (10 steps each)
- Phase 4-7 abbreviated (5 checks each)
- Deployment checklist

---

### Quick Reference (`QUICK_REFERENCE.md`)

**Read when:** Stuck, need syntax, debugging, mobile issues

**Sections:**
- **Quick Start** — Copy/paste to get running
- **File Structure Cheat Sheet** — Where everything lives
- **Common Operations** — How to...
  - Update a magic number
  - Add new audio
  - Change timing
  - Test a morph in isolation
  - Force scene recovery
- **Debugging Checklist** — Symptom → Cause → Fix (table)
- **Performance Tips** — GSAP best practices
- **Mobile Debugging** — iOS/Android specific issues
- **Git Workflow** — Commit/branch strategy
- **Lighthouse Checklist** — SEO/accessibility before launch
- **Emergency Commands** — Full cache clear, kill hung process
- **Quick Checklists** — Before each phase, before deploy, before delivery

**Key tables:**
- Debugging checklist (15 common issues)
- Mobile breakpoints
- Lighthouse targets

---

## PHASE PROGRESS TRACKER

Mark ✓ when validation completes.

```
PHASE 1: Shell & Director
  [ ] Master Plan read (PART A + PART C, PHASE 1)
  [ ] Files created (8 files: config, assets, director, state, etc.)
  [ ] Validation tests run (PHASE_VALIDATION, PHASE 1)
  [ ] All tests pass
  [ ] Console clean
  [ ] Git committed
  [✓] PHASE 1 COMPLETE

PHASE 2: Countdown & Vault
  [ ] Master Plan read (PART C, PHASE 2)
  [ ] countdown.js created
  [ ] vault.js created
  [ ] keypad.js component created
  [ ] 2 morph functions created
  [ ] Validation tests run (PHASE_VALIDATION, PHASE 2)
  [ ] All tests pass
  [ ] Console clean
  [ ] Mobile tested
  [ ] Git committed
  [ ] PHASE 2 COMPLETE

PHASE 3: Envelope & Letter
  [ ] Master Plan read (PART C, PHASE 3)
  [ ] letter.js created
  [ ] 2 morph functions created
  [ ] Validation tests run (PHASE_VALIDATION, PHASE 3)
  [ ] All tests pass
  [ ] Console clean
  [ ] Mobile tested
  [ ] Git committed
  [ ] PHASE 3 COMPLETE

PHASE 4: Promises & Memory
  [ ] ...

PHASE 5: Fate Engine
  [ ] ...

PHASE 6: Constellation
  [ ] ...

PHASE 7: Afterglow & Closing
  [ ] ...

PHASE 8: Polish
  [ ] ...

PHASE 9: Content Fill
  [ ] ...

DEPLOYMENT: GitHub Pages
  [ ] ...
```

---

## QUICK COMMAND REFERENCE

```bash
# Start dev
npm run dev

# Test a specific phase
npm run dev
# [go to http://localhost:5173]
# [run PHASE_VALIDATION steps]

# Build for deploy
npm run build

# Preview production build
npm run preview

# Check git status
git status

# See what changed
git diff HEAD~1

# Undo last commit (keep files)
git reset --soft HEAD~1

# Restore to last commit
git checkout -- .

# View commit history
git log --oneline -10

# Stash work (temporary save)
git stash

# Unstash
git stash pop
```

---

## CRITICAL PATHS

If you forget everything else, remember these:

1. **Before coding:** Read Master Plan PART A (5 rules)
2. **After coding:** Run PHASE_VALIDATION for that phase
3. **When stuck:** Check QUICK_REFERENCE Debugging Checklist
4. **Before deploy:** Run PHASE_VALIDATION Deployment section

---

## ARCHITECTURE AT A GLANCE

```
main.js (bootstrap)
  ↓
  ├→ state.init()         [tracks: current scene]
  ├→ director.init()      [tracks: busy flag, morphing]
  └→ collectAllElements() [tracks: all 8 scene DOMs]
       ↓
       scenes/ [countdown, vault, letter, etc.]
         ↓ (user interaction)
         ├→ state.requestTransition()
         └→ director.morph(from, to)
              ↓ (GSAP context)
              morphRegistry.getMorphFn(key)
              ↓
              morphs/ [specific animation code]
                ↓ (timeline completes)
                ├→ state.current = next
                └→ storage.save(next)
```

Key principle: **State owns logic, Director owns timing, Scenes own content.**

---

## DECISION TREE

### "What do I do next?"

```
Are you starting a new phase?
├─ YES → Read Master Plan (PART C, relevant PHASE)
└─ NO → Go to "Are you stuck?"

Are you stuck?
├─ YES
│  ├─ (error in console?) → Read QUICK_REFERENCE Debugging
│  ├─ (not sure if right?) → Run PHASE_VALIDATION tests
│  └─ (still stuck?) → Git checkout to last working, re-read Master Plan
└─ NO → Continue building

Do you need to know how to do X?
├─ Magic number → QUICK_REFERENCE: Update Magic Number
├─ Add audio → QUICK_REFERENCE: Add New Audio
├─ Change timing → QUICK_REFERENCE: Change Timing
├─ Test in isolation → QUICK_REFERENCE: Test Morph
├─ Emergency recovery → QUICK_REFERENCE: Force Scene
└─ [other] → Search QUICK_REFERENCE for keyword

Is it time to deploy?
├─ YES → Run PHASE_VALIDATION: Deployment Validation
└─ NO → Continue building
```

---

## WHAT'S GUARANTEED

With these three documents:

1. **No ambiguity.** Exact file paths, exact exports, exact code.
2. **No surprises.** Verification tests before advancing.
3. **No dead ends.** Debugging table covers 15+ common issues.
4. **No rework.** Architecture locked; no refactoring mid-project.
5. **No guessing.** Config centralized; magic numbers traceable.

---

## WHAT'S ON YOU

1. **Reading carefully.** Skim = bugs. Read thoroughly.
2. **Testing after each phase.** Validation isn't optional.
3. **Committing cleanly.** One feature per commit.
4. **Asking for help early.** 30-min stuck → check Quick Reference → ask.
5. **Mobile testing.** Not just desktop.

---

## FINAL CHECKLIST (LAUNCH DAY)

```
✓ All 9 phases complete and passing validation
✓ Console clean of errors (warnings ok)
✓ Mobile tested (iOS + Android)
✓ Reduced motion tested
✓ Lighthouse >90 all categories
✓ npm run build succeeds
✓ GitHub Pages deployed
✓ URL accessible: https://highnine699-del.github.io/birthday-vault/
✓ Countdown ticks (if before Nov 7, 2026)
✓ Passcode works (1107)
✓ Full flow works: countdown → vault → envelope → letter → ... → afterglow
✓ Audio plays
✓ No 404s in network tab
✓ Ready for Nov 7, 2026 delivery
```

---

## QUESTIONS?

1. **"Where is X?"** → Search this file (Ctrl+F)
2. **"How do I do X?"** → QUICK_REFERENCE
3. **"Is this working?"** → PHASE_VALIDATION
4. **"What is the rule?"** → Master Plan PART A
5. **"What's the file structure?"** → Master Plan PART C (intro) or QUICK_REFERENCE File Cheat Sheet

---

**You've got this. Build with confidence.**

---

**Document created:** June 27, 2026
**Birthday:** November 7, 2026
**Days to launch:** 133

*This system was designed for you to build, validate, and deploy with minimal external input. Every answer is in these three documents. Use them.*
