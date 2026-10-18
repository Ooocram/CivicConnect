# SEN381 FINAL — Verified Baseline and Submission Closure (18 October 2026)

This document is the current M4 evidence supplement to the existing PED v4.0 and RTM. It corrects older M4 documents that still refer to unmerged PR #11, 69 tests, absent security controls, or no staging run.

## Verified software
- **Merged baseline:** `1d37c3b7688a0a01da8ec5c75d1417a5dd70c2eb` on `main`.
- **PR #11:** merged; implemented API-level FR-02 tracking lookup/history, FR-03 staff filter/list/self-assignment, FR-05 management status counts, process-local public POST rate limit, and CORS origin allowlist.
- **Latest main CI:** [successful run 39166915153](https://github.com/Ooocram/CivicConnect/actions/runs/39166915153); 8 suites / 76 tests passed (unit, integration, API/database journeys and security controls). Migrations, static checks, lint and dependency audit passed.
- **Staging:** [run 39161570217](https://github.com/Ooocram/CivicConnect/actions/runs/39161570217) passed **before** the new functional smoke test. The enhanced workflow is now merged but **has not been independently evidenced as executed** on this baseline.

## Scope and outcome
The original M1 requirements document specifies seven acceptance criteria, FR-01 through FR-05 and NFR-01 through NFR-02. [Detailed mapping](./M1-Scope-Reconciliation.md). Conservative outcome: seven **partially met** criteria × 0.5 = **3.5/7 = 50.0%**, below the 80% target. This is a provisional team-review estimate, not a signed assessor result. FR-01 category optional/no UI; FR-02 no requester-owned list/UI; FR-03 no search/sort/UI; FR-04 no login/UI; FR-05 no overdue SLA or management UI; NFR-01 no full identity lifecycle; NFR-02 no approved cost schedule. Do not claim complete original scope.

## Defect, risk, security and debt
Earlier ESLint unused imports and an invalid resolved-request fixture were fixed; the final merged baseline passes CI. The rate limiter is in-memory per-process (not distributed) and CORS is an origin allowlist (not authentication). Existing FR-01 and FR-04 transaction tests, load-test evidence and RSK-05 mitigation remain applicable. [Technical debt](./Technical-Debt-Register-Final.md), [release/risk decision](./Release-Decision-and-Risk-Signoff.md), [AI addendum](./AI-Usage-Addendum.md), [RTM](../../qa/RTM_M3_Update.md), [defects](../../qa/Defect_Register_M3.md).

## Governance and release recommendation
**PROPOSED STAGED / NO-GO FOR PRODUCTION** because original scope is below target, there is no user-facing application or real login, overdue reporting is incomplete, and operational hosting/rollback evidence is absent. The team must sign the final decision.

**Ruleset #25349686 currently DISABLED** as verified on 18 October 2026; its required CI checks list is empty. Administrator must set enforcement **Active** and add the exact check `Test, static checks and dependency audit`. Two non-author reviews and required review-thread resolution should be enforced. Do not describe these as already enforced.

## Final submission handoff
1. Administrator activates ruleset and required check, verifies settings.
2. Maintainer manually runs the enhanced [M3 Staging Validation workflow](https://github.com/Ooocram/CivicConnect/actions/workflows/m3-staging.yml) on the final release candidate, inspects HTTP 201, tracking ID and DB persistence and records run URL. The workflow is ephemeral, not persistent deployment.
3. Team signs scope assessment, risk/technical-debt acceptance, ADR decisions and AI usage; reconcile original DOCX registers.
4. Review and merge this documentation branch, freeze final merge SHA/tag, update final PED PDF and evidence index to the frozen SHA. The SHA above is the *verified code baseline*, not necessarily the final documentation merge SHA.
5. Submit controlled PED v4.0 Final PDF, repository URL, frozen commit/tag and access/demonstration instructions.

**Human sign-off: PENDING.** **Production release: NO-GO proposed.** **Enhanced staging: execution pending.**
