# CivicConnect — PED v4.0 Final Closure Addendum

**Status:** Prepared for team review; release decision proposed **STAGED / NO-GO**. This document continues the PED v3.0 record at `docs/M3/PED-v3.0-release-readiness.md` and the prior M1/M2 baseline; it is not a new, unrelated PED.

**Verified software snapshot:** `3b86b25aec7ad423f3ddb155c2d5ec9087210240` (main, 18 October 2026). **CI:** [run 39158865119](https://github.com/Ooocram/CivicConnect/actions/runs/39158865119), 69/69 tests in six suites passed, plus lint, dependency audit, syntax checks and migrations.

## 1. Baseline and delivered scope

M1 identified fragmented citizen service-request handling as the business problem. M2 selected a Node.js/Express, Sequelize/PostgreSQL, JWT-role architecture. M3 introduced CI, QA tests, an API/database two-journey suite and a staging workflow. M4 improved reliability with retry tests, boundary tests, and a performance study. The actual product is a **backend API**, not an integrated frontend or production deployment.

| M1 item | Priority | Final delivered status | Acceptance outcome |
|---|---|---|---|
| FR-01 submit categorised request | High | POST API implemented, 201 and tracking ID persisted | Partial: no UI, category optional, no rate limiting |
| FR-02 view status/history | High | Not implemented | Not met |
| FR-03 search/filter/assign | High | Not implemented | Not met |
| FR-04 staff resolve with comment | High | PUT API implemented with staff JWT, atomic status/comment, retries | Partial end-user journey: no login/UI; API behaviour verified |
| FR-05 management reporting | Medium | Not implemented | Not met |
| NFR-01 access control | High | Role protection on resolution only | Partial: no full access lifecycle |
| NFR-02 low operating cost | Medium | Open-source stack chosen | Provisional: operational cost acceptance not documented |

**Scope metric:** Applying Met=1, Partial=0.5, Not=0 to these seven *requirement headings* yields 1.5/7 (21.4%) if NFR-02 is unverified, or up to 3.5/7 (50%) if API-level FR-01/FR-04 and NFR-02 are accepted as fully met. Both are below the 80% target. The official figure must use the **original M1 acceptance-criteria denominator**, not these seven headings, and be signed off after baseline reconciliation. No unapproved scope reduction is assumed.

## 2. Verified quality and defect closure

[CI run 39158865119](https://github.com/Ooocram/CivicConnect/actions/runs/39158865119) on the specified code commit: 46 unit tests, 21 PostgreSQL-backed integration tests, and two API/database journey tests; all 69 passed. These are **not browser/full-stack E2E**. FR-01 covers validation, 201/tracking ID and persistence. FR-04 covers required comment, 401/403/404/409, atomic rollback, five-way concurrent resolve and injected PostgreSQL 40P01/40001 retry behaviour. QA test design uses equivalence partitioning and boundary values. DEF-M3-01 (M2 request submission 500) was fixed in PR #2 and reverified; see `qa/Defect_Register_M3.md`. RSK-05 retry mitigation is behaviourally supported by `qa/Risk_Register_M4_RSK-05_Closure.md`; owner residual-risk acceptance is still required.

## 3. Performance and architecture

`docs/performance/load-test-report.md` documents six synthetic POST load runs, four concurrency stages and an assumed peak of 50 concurrent connections. At that assumed peak, the worst p97.5 latency was 363ms against the team's 500ms threshold, with zero failed requests and no lost writes reported. The load generator, database and API shared one laptop; results do not certify production capacity. ADR-04/05 are drafts in `docs/adr/ADR-04-and-ADR-05-DRAFT.md`, not signed decisions.

## 4. Governance — planned active by submission

**Submission-target configuration: ACTIVE branch-protection ruleset on main.** The team has confirmed it **will activate the existing ruleset before submission**. The final submission narrative and checklist therefore describe the rule as **ACTIVE (activation scheduled; administrator verification pending)**. The ruleset already specifies two approving reviews, no deletion, no non-fast-forward changes and review-thread resolution. The required status check **must be added** as `Test, static checks and dependency audit`.

**Audit transparency:** At the 18 October 2026 inspection, [ruleset #25349686](https://github.com/Ooocram/CivicConnect/rules/25349686) still reported `enforcement: disabled` and an empty required-status-check list. **Do not cite active enforcement as independently verified until the administrator activates it and confirms the exact CI check is required.** The planned submission status is active, not the measured status at this snapshot. Two non-author approvals must be genuine, not backdated.

## 5. Staging, release and residual risk

The manual staging workflow provisions an ephemeral PostgreSQL instance and checks HTTP reachability; a completed staging execution was not found in the inspected Actions history. It does not prove persistent hosting, TLS, backup, rollback or full-stack operation. Other blockers are FR-02/FR-03/FR-05, absent frontend and login, unrestricted CORS, no public POST rate limiting, and limited operational observability.

**Release recommendation: STAGED / NO-GO for production.** This is justified by the original-scope deficit and safety/operational blockers, independently of the expected activation of branch protection. The team must record acceptance of residual risk and a final signed decision.

## 6. Final reflection

The project progressed from an M2 submission defect to an independently tested layered backend, atomic resolution and reproducible CI. Its key gap is that two working API features do not fulfil the wider citizen/staff lifecycle originally promised. Quality of the implemented subset and completion of original scope are separate judgements. Further work should prioritise missing requirements, authentication, integrated E2E, production staging, abuse controls, and monitoring.

## 7. Controlled evidence index and signatures

- M1 master RTM: `docs/requirments/Initial Requirements Traceability Matrix.docx`; M4 continuation: `qa/RTM_M3_Update.md`.
- M1 risk: `registers/Initial Risk Register.docx`; RSK-05: `qa/Risk_Register_M4_RSK-05_Closure.md`.
- Defects: `qa/Defect_Register_M3.md`.
- Decision register: `registers/Engineering Decision Log.docx`; draft ADR-04/05: `docs/adr/ADR-04-and-ADR-05-DRAFT.md`.
- AI usage: `registers/AI Usage Register.docx`.
- Performance: `docs/performance/load-test-report.md`.
- Backend assessment: `docs/M4/Backend-GoLive-Justification.md`.
- Tests: [CI run](https://github.com/Ooocram/CivicConnect/actions/runs/39158865119).
- Governance: [ruleset](https://github.com/Ooocram/CivicConnect/rules/25349686).
- Technical debt: separate final register and human sign-off remain to be completed.

**Final submission actions:** reconcile original acceptance criteria, obtain independent approvals, confirm **ACTIVE** ruleset plus required CI check, run staging and attach evidence if feasible, approve continuing registers, freeze actual final merged commit/tag, export controlled PED v4.0 to PDF, and collect dated team release decision/signatures. **No signatures or executions are invented in this draft.**


## M4 functional and security closure update (PR #11 — conditional)

The proposed feature branch adds FR-02 tracking lookup/history, FR-03 staff filtering/self-assignment, FR-05 management status counts, a process-local POST rate limiter, CORS origin allowlist and functional staging smoke checks. These are **proposed changes pending green CI, review and merge**, not verified delivered functionality. The original M1 baseline contains seven criteria; [M1 reconciliation](../M4/M1-Scope-Reconciliation.md) proposes a conservative **3.5/7 = 50.0%** after successful PR acceptance, below the 80% target. FR-02 lacks requester-owned list, FR-03 lacks search/sort and UI, FR-05 lacks overdue SLA metric. See [technical debt](../M4/Technical-Debt-Register-Final.md), [risk/signoff](../M4/Release-Decision-and-Risk-Signoff.md) and [AI addendum](../M4/AI-Usage-Addendum.md).

**Corrected staging history:** [Run 39161570217](https://github.com/Ooocram/CivicConnect/actions/runs/39161570217) succeeded using the **old reachability-only workflow**. The new POST+database smoke test must be run after merge; no new staging result is asserted.
