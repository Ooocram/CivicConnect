# SEN381 FINAL — Evidence and submission closure

**Assessed software:** `3b86b25aec7ad423f3ddb155c2d5ec9087210240`; [CI: 69/69 passed](https://github.com/Ooocram/CivicConnect/actions/runs/39158865119).

## Verified evidence
- [x] FR-01 and FR-04 backend API, 46 unit + 21 integration + 2 API/database journeys.
- [x] CI passed with migrations, ESLint, dependency audit and tests.
- [x] Six-run FR-01 load test and documented limitations.
- [x] RSK-05 retry/locking evidence; original defect fixed.
- [x] PED v4.0 closure addendum and final evidence index drafted.

## Submission-target governance status
- [ ] **ACTIVE ruleset on main before submission** — team intends to activate; [ruleset #25349686](https://github.com/Ooocram/CivicConnect/rules/25349686) still read `disabled` at 18 Oct inspection. Confirm and tick after activation.
- [ ] Required status check `Test, static checks and dependency audit` added to ruleset; empty in inspected configuration.
- [ ] Two genuine independent non-author reviews for final PR.

## Remaining final obligations
- [ ] Reconcile official M1 acceptance-criterion denominator and calculate signed scope percentage (current seven-heading indicative values below 80%).
- [ ] Preserve and finalise existing PED, RTM, Risk, Defect, ADR/Decision, Technical Debt and AI Usage registers; collect team sign-off.
- [ ] Complete or explicitly disposition FR-02, FR-03, FR-05, missing frontend and authentication.
- [ ] Execute manual staging workflow, capture link and limitations, or report not executed.
- [ ] Freeze exact submission commit/tag after reviewed merge; align evidence to it.
- [ ] Export controlled PED v4.0 Final PDF and submit repo URL, frozen release ID, evidence links and any required team demonstration.
- [ ] Record final GO/NO-GO decision and signed residual-risk acceptance.

**Planned submission statement:** “Main branch ruleset **ACTIVE** with two independent approvals and required CI gate,” **only after administrator verification**. Until then this is a future-state statement, not an observed fact.

## Functional closure PR (verification pending)
- [ ] FR-02 public tracking lookup/history, FR-03 staff list/filter/assignment and FR-05 status summary have been **proposed** in `feature/final-functional-closure`. They are **not yet verified by CI**, reviewed or merged. Overdue summary remains unavailable without an SLA definition.
- [x] Staging workflow actually executed successfully: https://github.com/Ooocram/CivicConnect/actions/runs/39161570217. The current workflow only verifies HTTP reachability; a functional POST smoke test is still outstanding.
- [x] Current main CI succeeded: https://github.com/Ooocram/CivicConnect/actions/runs/39163445921 on `aade76b5b0cec41a7b88c2bdfab1a065f93fca2e`.
- [ ] Repository administrator must activate ruleset #25349686 and select required job `Test, static checks and dependency audit`. The integration cannot change admin rulesets.


## M4 functional and security closure update (PR #11 — conditional)

The proposed feature branch adds FR-02 tracking lookup/history, FR-03 staff filtering/self-assignment, FR-05 management status counts, a process-local POST rate limiter, CORS origin allowlist and functional staging smoke checks. These are **proposed changes pending green CI, review and merge**, not verified delivered functionality. The original M1 baseline contains seven criteria; [M1 reconciliation](../M4/M1-Scope-Reconciliation.md) proposes a conservative **3.5/7 = 50.0%** after successful PR acceptance, below the 80% target. FR-02 lacks requester-owned list, FR-03 lacks search/sort and UI, FR-05 lacks overdue SLA metric. See [technical debt](../M4/Technical-Debt-Register-Final.md), [risk/signoff](../M4/Release-Decision-and-Risk-Signoff.md) and [AI addendum](../M4/AI-Usage-Addendum.md).

**Corrected staging history:** [Run 39161570217](https://github.com/Ooocram/CivicConnect/actions/runs/39161570217) succeeded using the **old reachability-only workflow**. The new POST+database smoke test must be run after merge; no new staging result is asserted.
