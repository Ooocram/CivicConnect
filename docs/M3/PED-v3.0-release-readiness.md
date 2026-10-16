# CivicConnect — PED v3.0 Milestone 3 release evidence index

**Compiler:** Marco Armando Rentroia  
**Evidence snapshot:** 16 October 2026, main commit `aa1cd96d90bab21935ee61e5c879b2d59f86a247`  
**Classification:** **NOT READY FOR RELEASE — evidence gates outstanding**  
**Scope:** Release-candidate readiness, not production approval.

## 1. Controlled baseline and implemented scope
The M2 baseline uses Node.js/Express, Sequelize/PostgreSQL and Jest. Current repository integration suites cover FR-01 request creation and FR-04 request resolution. Frontend and full-stack E2E coverage must not be assumed from backend integration tests.

## 2. Executed evidence
| Gate | Result | Evidence |
| --- | --- | --- |
| Locked dependency installation (`npm ci`) | PASS | [Main CI run 38877419497](https://github.com/Ooocram/CivicConnect/actions/runs/38877419497) |
| Static JavaScript syntax checks | PASS | [Main CI run 38877419497](https://github.com/Ooocram/CivicConnect/actions/runs/38877419497) |
| Dependency audit (high/critical fail threshold) | PASS at run time | [Main CI run 38877419497](https://github.com/Ooocram/CivicConnect/actions/runs/38877419497) |
| PostgreSQL migrations and Jest tests | PASS | [Main CI run 38877419497](https://github.com/Ooocram/CivicConnect/actions/runs/38877419497) |
| Nkosana's QA changes merged | YES | [PR #4](https://github.com/Ooocram/CivicConnect/pull/4) |
| Marco's CI/staging setup merged | YES | [PR #3](https://github.com/Ooocram/CivicConnect/pull/3) |
| Staging workflow deployed and smoke-tested | NOT VERIFIED | [Staging workflow](../../.github/workflows/m3-staging.yml); no staging run in inspected Actions history |
| Two independent non-author approvals for PRs #3 and #4 | NOT MET in inspected review records | GitHub PR review API returned no submitted reviews |
| Branch protection / ruleset enforcing two reviews and CI | NOT VERIFIED / no repository rulesets returned | Repository ruleset query; administrator follow-up required |
| Two critical full-stack E2E journeys | NOT VERIFIED | Team must supply execution evidence |
| Performance exercise, M2 deviation review, ADRs | NOT VERIFIED | Otsile to supply evidence |

## 3. Nkosana's quality assurance and traceability
[QA strategy](../../qa/M3_QA_Test_Strategy.md) describes equivalence partitioning and boundary value analysis; [unit suite](../../tests/unit/serviceRequest.rules.test.js) contains nine domain tests. [RTM M3 update](../../qa/RTM_M3_Update.md) links FR-01 and FR-04 to repository evidence; it is explicitly a draft and does not replace the M1 baseline. [Defect register](../../qa/Defect_Register_M3.md) has one open investigation observation, **not** a confirmed product defect. CI has passed after Nkosana's merge, but test-case-by-test-case execution details and full RTM reconciliation are not documented here. Five separately identified black-box functional tests and their formal technique mapping remain to be evidenced.

## 4. Governance and release control
The CI job fails on failing tests, syntax errors, or high/critical dependency audit findings. This does **not** automatically block a merge without a required status check. Configure main branch protection/ruleset to require the exact CI check name `Test, static checks and dependency audit`, two approvals from non-authors, no direct pushes and no bypass. Re-review any already merged exceptions as governance deviations; do not retroactively claim approval.

## 5. Staging deployment
[Manual staging workflow](../../.github/workflows/m3-staging.yml) provisions an ephemeral PostgreSQL instance, runs migrations, starts Node and checks HTTP reachability. This is simulated staging only; it is not persistent hosting, external availability, functional E2E validation, or a production deployment. Execute via GitHub Actions and attach the run URL and logs. Confirm Sequelize supports `NODE_ENV=staging` before marking success.

## 6. Release readiness classification
**NOT READY FOR RELEASE.** CI and Nkosana's merged QA contribution have positive evidence, but missing staging execution, two full-stack E2E journeys, performance and architecture evidence, baseline RTM reconciliation, and required peer-review controls prevent sign-off.

## 7. Final residual risk statement
Residual risks: incomplete requirement-to-execution traceability; unverified end-to-end integration and performance; lack of demonstrated staging execution; unverified branch protection and absent submitted PR reviews; possible changes in dependency vulnerability findings after the recorded audit; and no proof of durable production infrastructure. No confirmed defect should be inferred from the QA observation alone. Risk acceptance remains with the team and assessor, subject to documented sign-off.

## 8. Release sign-off checklist
- [x] CI workflow committed and successfully executed on main
- [x] Nkosana QA branch merged and included in successful main CI
- [ ] Execute and document staging workflow
- [ ] Confirm required status checks and two-reviewer main protection
- [ ] Execute and record two critical E2E journeys
- [ ] Complete black-box evidence and reconcile RTM with baseline
- [ ] Add performance exercise and ADR/M2 conformance evidence
- [ ] Resolve or disposition QA investigation observation
- [ ] Record two independent reviews for release changes and team sign-off

**Decision owner:** All team members. **Decision:** Release blocked pending the unchecked evidence gates.
