# Defect Register — Milestone 3 QA (working draft)

No new defect is declared as confirmed by this QA contribution alone. The latest project archive contains domain validation and integration tests, so findings from an older project snapshot must not be copied into this register without retesting.

| ID | Description | Severity | Status | Evidence / next action |
|---|---|---|---|---|
| QA-OBS-01 | Functional behavior and current defects still need confirmation against the latest integrated release candidate. | Unclassified observation (not a confirmed defect) | Open — investigate | Run the complete test suite and review failures; if a reproducible failure is found, record steps, expected/actual results, commit SHA, and a fix reference. |
| DEF-M3-01 | `POST /api/v1/requests` returned HTTP 500 for every valid request in the M2 baseline. Root cause: a variable-name typo in `server.js`; `mockTrackingId` was declared but `mockingTrackingId` was returned, so a ReferenceError was thrown and the generic catch turned it into a 500. PED v2.0 recorded the endpoint as implemented. | High (core FR-01 journey unusable, no workaround) | Fixed and verified | Introduced in `4e8308a` (M2, PR #1). Steps: start the server at that commit and POST `{"title":"Pothole","description":"Deep one on Main St"}` to `/api/v1/requests`. Expected: 201 with a Tracking ID. Actual: 500 `{"error":"Internal Server Error"}` (the missing-title case correctly returned 400). Fix: `1db839a` (merged by PR #2) replaced the placeholder with the layered implementation. Verification: `tests/integration/fr01-create-request.test.js`, test 'creates a request, returns 201 and a Tracking ID, and persists it as Open'; run in the CI quality gate [CI run link: fill on merge]. Contributing cause: M2 had no automated happy-path test (the npm test script was a placeholder). |

DEF-M3-01 was found during the backend implementation review and reproduced at commit `4e8308a`; it was not found by the QA suite. It is recorded here so the register is consistent with the M2 baseline evidence in PED v2.0.

Replace or close this observation after testing. Do not report it as a product bug unless a reproducible failure is found.
