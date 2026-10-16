# CivicConnect PED v3.0 — M3 Release Evidence Index (Draft)

**Owner:** Marco Armando Rentroia  
**Status:** Draft pending team integration and execution evidence  
**Baseline:** M2 architecture; Node.js/Express, Sequelize/PostgreSQL, Jest

## 1. Construction and architecture
- API implementation and three integration tests: Otsile — evidence link **pending**.
- M2 conformance, ADR updates and performance exercise: Otsile — **pending**.
- Unit tests (at least five), black-box tests (at least five, using two techniques), evolved RTM and defect register: Nkosana — **pending**.
- Two critical end-to-end journeys: shared — **pending**.

## 2. Governance and automation
- CI workflow: [M3 CI](../../.github/workflows/m3-ci.yml) — execution status **not yet verified**.
- Static syntax checks and high/critical dependency audit: CI workflow — execution status **not yet verified**.
- Simulated staging workflow: [M3 Staging](../../.github/workflows/m3-staging.yml) — execution status **not yet verified**.
- Configuration, procedures and evidence instructions: [Marco runbook](Marco-CI-Staging-Runbook.md).
- Two non-author reviews and required status check: **administrator configuration and PR evidence pending**.

## 3. Release readiness classification
**PROVISIONAL: NOT READY FOR RELEASE.** This is an evidence-based classification, not an assertion that the implementation is defective. CI results, staging execution, required tests, peer review and E2E results have not yet been verified. Reclassify only after all acceptance evidence is linked, blocking defects are resolved and reviewers approve.

## 4. Residual risk statement
Outstanding risks include unverified dependency vulnerability status, unverified database migration and deployment behavior, possible API/test changes during parallel development, missing end-to-end evidence, and missing branch protection verification. The staging environment is ephemeral and does not establish production availability, durability, external connectivity or security posture. Risk acceptance must be signed off by the team after evidence review.

## 5. Evidence completion table
| Evidence | Responsible | Status | Link / run ID |
| --- | --- | --- | --- |
| CI build, tests, audit and syntax checks | Marco | Pending run | TBD |
| Simulated staging smoke test | Marco | Pending run | TBD |
| Branch protection / two approvals | Marco / reviewers | Pending verification | TBD |
| Integration tests and load test | Otsile | Pending | TBD |
| Unit tests, black-box tests, RTM, defects | Nkosana | Pending | TBD |
| Two E2E journeys | All | Pending | TBD |
| Final release decision and sign-off | All | Pending | TBD |
