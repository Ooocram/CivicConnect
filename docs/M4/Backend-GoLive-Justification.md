# Backend Go-Live Technical Justification (Milestone 4)

**Author:** Otsile Sebola (Backend Stabilisation & Verification Evidence)
**Evidence snapshot:** `main` at `3875f37` (merge of PR #7). Backend scope only: FR-01 and FR-04.
**Status:** backend recommendation to the team. The final deployment state is a team decision.

## 1. Recommendation

**Stay in Staged (No-Go).** The backend is technically sound for the two requirements it implements, but it is not ready to face real users. The reasons are security, integration and governance gaps. **Performance is not a reason**: it met its thresholds (section 4).

| State (M4 brief)     | Backend position | Reason                                                         |
| -------------------- | ---------------- | -------------------------------------------------------------- |
| Production           | No               | Blockers B1 to B7 below are open.                              |
| Simulated Production | Not yet          | Reachable once conditions C1 to C6 in section 5 are evidenced. |
| Staged (No-Go)       | **Recommended**  | Defended by the evidence in sections 3 and 4.                  |

This is consistent with the team's release-readiness classification, **NOT READY FOR RELEASE** (`docs/M3/PED-v3.0-release-readiness.md`). Since that document was written, three of its gates gained evidence (unit tests now execute, API-level journeys exist, performance and ADR evidence is supplied). None of the blockers below changed.

## 2. What the backend does well

- **FR-04 is atomic.** The status change and the mandatory comment commit or roll back together, with a row lock and retry on deadlock (`src/application/request.service.js`). Closure evidence for RSK-05 is in `qa/Risk_Register_M4_RSK-05_Closure.md`.
- **69 tests pass in 6 suites** (unit, integration, API-level journeys), run in CI together with lint and a dependency audit that fails on high or critical findings (`.github/workflows/m3-ci.yml`).
- **A real defect was found and fixed**: DEF-M3-01 (M2 endpoint returned 500 for every valid request), reproduced at commit `4e8308a`, fixed in `1db839a`.
- **Errors do not leak internals**: unexpected failures return a generic 500 (`src/presentation/error.middleware.js`).

## 3. Blockers for production (each with evidence)

| #   | Blocker                                                                                                                                                                                                                           | Evidence                                                                                                                                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| B1  | **Public write endpoint with no abuse control (RSK-08).** Anyone can create requests without authentication, and nothing limits the rate.                                                                                         | Load test: up to 4,886 rows saved in one 15-second stage from one client (`docs/performance/load-test-report.md`). `src/presentation/request.routes.js` has no limiter. `src/app.js` uses `cors()` with no origin restriction. |
| B2  | **No authentication lifecycle (RSK-09).** There is no login endpoint; staff tokens come only from a development script. The shared HS256 secret has no rotation, and tokens cannot be revoked.                                    | `scripts/dev-seed-and-token.js`; no auth route exists; ADR-05 marks the design as interim.                                                                                                                                     |
| B3  | **The staff workflow cannot run end to end.** Citizens receive a Tracking ID, but resolving uses the numeric id, and the API has no read or look-up endpoint.                                                                     | `src/presentation/request.routes.js` defines only `POST /` and `PUT /:id/resolve`. The journey tests find the id directly in the database for this reason.                                                                     |
| B4  | **No full-stack E2E evidence.** The journeys that exist are API-level.                                                                                                                                                            | `tests/e2e/critical-journeys.test.js`; the team's own document says full-stack coverage must not be assumed.                                                                                                                   |
| B5  | **Deployment is only simulated.** The staging workflow uses an ephemeral database and checks that the HTTP listener answers. No persistent hosting, TLS termination, backup or rollback procedure is evidenced in the repository. | `.github/workflows/m3-staging.yml`; `docs/M3/Marco-CI-Staging-Runbook.md`.                                                                                                                                                     |
| B6  | **Governance controls are unverified.** Required status check, two non-author approvals and no-bypass protection on `main` were not confirmed.                                                                                    | `docs/M3/PED-v3.0-release-readiness.md`, section 4.                                                                                                                                                                            |
| B7  | **Little operational visibility.** Errors go to `console.error` only, and retries are not logged.                                                                                                                                 | `src/presentation/error.middleware.js`; `qa/Risk_Register_M4_RSK-05_Closure.md`.                                                                                                                                               |

Lesser gaps that do not block on their own: `categoryId` is optional although FR-01 says requests are categorised, and two moderate dependency findings (a transitive `uuid` issue in Sequelize) are accepted because the code never passes a buffer to it and the only automatic fix is a breaking downgrade.

## 4. Why performance is not the blocker

Six runs, four stages each, no failed request and no lost write in any of them. At the assumed peak of 50 concurrent connections the worst p97.5 latency was 363 ms against a 500 ms threshold. Throughput saturates near 300 requests per second on the test machine. These results come from one laptop with the load generator, API and database sharing it, so they support "no performance blocker was found", not "production capacity is proven". Full limits are in `docs/performance/load-test-report.md`.

## 5. Conditions to move to Simulated Production

| #   | Condition                                                                                                                                                                       | Closes |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| C1  | Per-IP rate limiting on `POST /api/v1/requests`, recorded in a new ADR, with a test and a repeat load run.                                                                      | B1     |
| C2  | A staff token issuance mechanism (login) or a documented stopgap accepted by the team, and CORS restricted to the frontend origin.                                              | B2, B1 |
| C3  | The minimum read or look-up endpoint the staff UI needs, or evidence that the UI does not need it.                                                                              | B3     |
| C4  | Two critical journeys executed against the integrated frontend and backend, with run evidence.                                                                                  | B4     |
| C5  | The staging workflow executed on the release candidate and its run attached, with a stronger smoke test than "the listener answers" (for example a valid `POST` returning 201). | B5     |
| C6  | Branch protection verified (required check `Test, static checks and dependency audit`, two non-author approvals, no bypass).                                                    | B6     |

Further conditions for Production: persistent hosting with TLS and managed secrets, backup and rollback, retry and error logging with alerting, and signed acceptance of the residual risks.

## 6. Residual risks if the team stays in staging

Abuse of the public endpoint is possible only in the staging environment; the authentication design is interim; integration risk remains until C4 is done; the dependency findings may change over time; the pool-size result is inconclusive. Risk acceptance belongs to the team and assessor.

## 7. Facts to confirm before this is submitted

- [x] Number of non-author approvals on PR #7 and on the PR that carries this file: PR #7 has 1 approval; current PR still pending.
- [x] Result of the CI run on the latest `main` commit, and its test count: **Passed, 69 tests executed successfully.** https://github.com/Ooocram/CivicConnect/actions/runs/39109979166 .
- [ ] Whether the staging workflow has been run on the release candidate: No.
- [x] Whether branch protection is confirmed on `main`: Yes, verified by Marco.

Do not record an approval, a run or a protection rule that has not happened.

**Backend owner:** Otsile Sebola. **Team decision:** [pending, all members].
