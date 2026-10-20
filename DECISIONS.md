# Decisions

This file records the choices made while doing the take-home test described in [README.md](README.md), with the reasons behind them.

## Context

- Feature to add: **Dafalgan** loses Benefit twice as fast as normal drugs.
- Constraints from the spec:
  - Keep the public API of `Drug` and `Pharmacy` unchanged. New methods can be added.
  - `yarn start` must still produce an `output.json` identical to the current one.

## Timeline

- **[18:24]** Start the test after reading the specification

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

- **Decision:** _TBD_
- **Why:** _TBD_
- **Alternatives considered:** _TBD_

### 003 — Dafalgan behaviour after expiry

- **Decision:** _TBD_
- **Why:** _TBD_
- **Alternatives considered:** _TBD_

### 004 — Testing strategy

- **Decision:** A complete test suite, written by Claude, to support the refactor (see 001).
- **Why:** _TBD_
- **Alternatives considered:** _TBD_

## Out of scope

- _TBD_

## Time spent

- _TBD_
