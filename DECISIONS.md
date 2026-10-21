# TLDR

First push the product necessity, refacto can be long, or priority may change, **product first**.
I didn't rewrite in ts, this is not production build it's a test showing implementation it's more important than loosing time on config
I did use claude for **test writing, and record my decisions**, I also strongly suggest using it for task of migration like the rest of need to be done here or migrating TS
My approach was of a generic class and overriding it for special cases, using inheritance and factory, it's testable, readable and quite flexible if need be. I took the hypothesis that needing a release for a new product, and the quantity of expected product didn't need a more configuration approach

The code is far from great and does not meet production standard, I balance the quality and the delivery to give and idea at first glance of the architectural idea

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
- **[19:30]** Add the Fervex class. It will be the example PR for creating a skill, or the baseline for a prompt.
- **[19:41]** Add the Factory class. to demonstrate how we will use the difference of the .
- **[19:54]** Finish read me 
- **[20:03]** auto review fix some mistake 
## Decision log

Use one entry per decision, in this format:

###  Delivery order: product change first, then refactor PR by PR

- **Decision:**
  1. Push the old JS version together with the test suite.
  2. Push the product change (Dafalgan) next.
  3. Then refactor in small PRs, one at a time.
- **Why:** In real conditions, we can't be sure how long the refactor will take, or whether other input will come in along the way. Shipping the product change first means the feature is delivered no matter what. Small refactor PRs can then follow, each covered by the tests.
- **Alternatives considered:** Refactor first and add Dafalgan on top of the clean code. Rejected because that blocks the feature until the refactor is finished.


### 001 — Overall strategy

- **Decision:** Work in two parallel tracks:
  - **Step 1:** I add the new product (Dafalgan) directly to `pharmacy.js`.
  - **In parallel:** Claude writes a complete test suite covering every drug rule, as a safety net for the refactor.
- **Why:** The test suite protects the refactor and helps me analyze the solution I have in mind before committing to it.

### 002 — Refactoring approach

- **Decision:** This is step 2, after the product change has shipped:
  1. Write a cleaner, leaner version of the class. It becomes the base class that each drug will later inherit from.
  2. Check the new version against the old one: both must give the same results.
  3. Migrate progressively to standalone classes, one per drug.
  4. Deliver the refactor as a stack of PRs. Each PR branches from the previous one, and the base class PR is the first in the stack.
- **Why:** Standalone classes are easier to test and easier to read. Comparing against the old version at each step shows the behaviour hasn't changed.

### 004 — Testing strategy

- **Decision:** A complete test suite, written by Claude, coverage is complete and the files has been verified, to support the refactor (see 001).
- **Why:** To use red / green testing and give the agent quick feedback


### 006 — Fervex as the reference migration PR

- **Decision:** Migrate Fervex first, by hand. Its PR becomes the example for a skill, or the baseline for a prompt, used to migrate the remaining drugs.
- **Why:** Fervex's rules are straightforward, which makes it a clean, easy-to-follow example of one drug migration.

### Time dedicated 
~1H30
