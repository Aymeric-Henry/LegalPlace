# Decisions

This file records the choices made while doing the take-home test described in [README.md](README.md), with the reasons behind them.

## Context

- Feature to add: **Dafalgan** loses Benefit twice as fast as normal drugs.
- Constraints from the spec:
  - Keep the public API of `Drug` and `Pharmacy` unchanged. New methods can be added.
  - `yarn start` must still produce an `output.json` identical to the current one.

## Timeline

- **[18:24]** Start the test after reading the specification
- **[18:40]** Push the old JS version and the test suite
- **[18:58]** The base class is done and the tests still give the same results. Start a new branch to open a PR; it is the first PR of the refactor stack.

## Decision log

Use one entry per decision, in this format:

### NNN — Title

- **Decision:** what was chosen
- **Why:** the reason
- **Alternatives considered:** what was rejected, and why

---

### 001 — Overall strategy

- **Decision:** Work in two parallel tracks:
  - **Step 1:** I add the new product (Dafalgan) directly to `pharmacy.js`.
  - **In parallel:** Claude writes a complete test suite covering every drug rule, as a safety net for the refactor.
- **Why:** The test suite protects the refactor and helps me analyze the solution I have in mind before committing to it.
- **Alternatives considered:** _TBD_

### 002 — Refactoring approach

- **Decision:** This is step 2, after the product change has shipped:
  1. Write a cleaner, leaner version of the class. It becomes the base class that each drug will later inherit from.
  2. Check the new version against the old one: both must give the same results.
  3. Migrate progressively to standalone classes, one per drug.
  4. Deliver the refactor as a stack of PRs. Each PR branches from the previous one, and the base class PR is the first in the stack.
- **Why:** Standalone classes are easier to test and easier to read. Comparing against the old version at each step shows the behaviour hasn't changed.
- **Alternatives considered:** _TBD_

### 003 — Dafalgan behaviour after expiry

- **Decision:** _TBD_
- **Why:** _TBD_
- **Alternatives considered:** _TBD_

### 004 — Testing strategy

- **Decision:** A complete test suite, written by Claude, to support the refactor (see 001).
- **Why:** _TBD_
- **Alternatives considered:** _TBD_

### 005 — Delivery order: product change first, then refactor PR by PR

- **Decision:**
  1. Push the old JS version together with the test suite.
  2. Push the product change (Dafalgan) next.
  3. Then refactor in small PRs, one at a time.
- **Why:** In real conditions, we can't be sure how long the refactor will take, or whether other input will come in along the way. Shipping the product change first means the feature is delivered no matter what. Small refactor PRs can then follow, each covered by the tests.
- **Alternatives considered:** Refactor first and add Dafalgan on top of the clean code. Rejected because that blocks the feature until the refactor is finished.

## Out of scope

- _TBD_

## Time spent

- _TBD_
