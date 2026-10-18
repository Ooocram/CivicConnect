# Defect Register — M3/M4 Closure

**Verified code:** `3b86b25aec7ad423f3ddb155c2d5ec9087210240`. **CI:** [69/69 passing](https://github.com/Ooocram/CivicConnect/actions/runs/39158865119).

| ID | Finding | Status | Evidence |
|---|---|---|---|
| DEF-M3-01 | M2 POST valid request returned 500 due to misspelt tracking-ID variable | Fixed and reverified | PR #2; `tests/integration/fr01-create-request.test.js`; final CI |
| QA-OBS-01 | Earlier QA snapshot required integrated verification | Closed as observation | Current 69-test suite passed; no claim that all defects are absent |
| QA-LIM-01 | FR-02, FR-03 and FR-05 missing | Open scope gap | No implemented endpoints |
| QA-LIM-02 | No frontend/full-stack E2E | Open | `tests/e2e/critical-journeys.test.js` covers API + DB only |
| QA-LIM-03 | No staff login/token lifecycle; dev script only | Open | `scripts/dev-seed-and-token.js` |
| QA-LIM-04 | No public POST rate limit; unrestricted CORS | Open | Routes, app configuration and load report |
| QA-LIM-05 | Staging run and persistent deployment not evidenced | Open | Workflow exists but no run verified |
| GOV-M4-01 | Main ruleset activation scheduled before submission | **Planned ACTIVE — pending verification** | [Ruleset #25349686](https://github.com/Ooocram/CivicConnect/rules/25349686) was disabled with empty required checks on 18 Oct inspection. Two approvals parameter exists; activation and required CI gate must be confirmed. |

**No fictitious closure:** Do not change GOV-M4-01 to “verified active” until GitHub reports active enforcement. Missing original scope is a delivery gap, not a defect proved by the 69 passing tests. Final sign-off remains with the team.
