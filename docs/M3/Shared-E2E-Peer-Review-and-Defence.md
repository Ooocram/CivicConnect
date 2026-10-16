# M3 shared responsibilities — execution and review record

**Owner:** All team members (Otsile Sebola, Nkosana Mtsweni, Marco Rentroia).  
**Status:** Test implementations committed; execution, reviews and live defence still require verification.

## Critical end-to-end journeys
| ID | Journey | Test evidence | Acceptance | Status |
| --- | --- | --- | --- | --- |
| E2E-01 | Citizen submits a service request; backend persists it and returns a tracking ID | [critical-journeys.test.js](../../tests/e2e/critical-journeys.test.js) | HTTP 201, tracking ID format, Open row in PostgreSQL | Pending CI run |
| E2E-02 | Citizen submits request; non-staff resolution is rejected; staff resolves it and creates audit comment | [critical-journeys.test.js](../../tests/e2e/critical-journeys.test.js) | 201 then 403 then 200, Resolved row, correct actor and one comment | Pending CI run |

**Scope limitation:** These are automated system-level API/database journeys (Express -> domain -> persistence -> PostgreSQL). They do not exercise a browser or React UI. Do not claim full frontend-to-backend E2E until a deployed frontend and browser journey exist. Jest configuration must discover `tests/e2e/*.test.js`, which it does via `tests/**/*.test.js`.

## Formal QA technique mapping
The existing [FR-01 integration tests](../../tests/integration/fr01-create-request.test.js) cover valid/invalid partitions and title-length boundary. [FR-04 integration tests](../../tests/integration/fr04-resolve-request.test.js) cover unauthenticated/non-staff partitions, missing comments and already-resolved conflict. [Nkosana's QA strategy](../../qa/M3_QA_Test_Strategy.md) describes equivalence partitioning and boundary value analysis. The final RTM should link named test cases to exact CI execution evidence and baseline acceptance criteria.

## Peer-review governance
For this PR, require **two manual approvals from non-authors** before merging. Record reviewer GitHub usernames, timestamps, review links, commit SHA and any requested fixes. Automated CI success is not a substitute for manual approval. Branch protection must require the CI check. Existing PRs without review evidence must be documented as exceptions, not represented as compliant.

## Individual engineering defence prompts
- **Marco:** Why must CI include database-backed tests, audit and static checks? What is the difference between a failing CI job and enforced branch protection? Why is ephemeral staging not production?
- **Nkosana:** Show FR-01/FR-04 traceability from requirement to boundary/negative cases and test execution; explain defect classification and why observations are not confirmed bugs.
- **Otsile:** Demonstrate the layered API, atomic resolution transaction, concurrency handling, migration strategy, performance workload and architecture deviations.
- **All:** Explain E2E-01 and E2E-02 outcomes, access-control negative path, rollback evidence, residual risks and why release sign-off is still conditional.

## Remaining verification
- [ ] CI run including both new tests is successful
- [ ] Manual staging run succeeds with isolated configuration
- [ ] Two independent non-author approvals are submitted
- [ ] Final RTM is reconciled with M1 baseline and linked to execution
- [ ] Otsile's performance/ADR evidence is integrated
- [ ] Team signs release readiness decision
