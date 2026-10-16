# RTM — Milestone 3 QA Update (draft for execution)

This is an incremental QA note to be reconciled with `docs/requirments/Initial Requirements Traceability Matrix.docx`; it does not replace the baseline RTM.

| Requirement | Existing evidence in repository | QA test/evidence link | Status |
|---|---|---|---|
| FR-01 — submit service request and return Tracking ID | `tests/integration/fr01-create-request.test.js`; domain validation in `src/domain/serviceRequest.rules.js` | Existing integration tests; `tests/unit/serviceRequest.rules.test.js` U-01 to U-06 | Execution must be confirmed in the team's test environment |
| FR-04 — staff resolves request with a mandatory resolution comment | `tests/integration/fr04-resolve-request.test.js`; domain rules in `src/domain/serviceRequest.rules.js` | Existing integration tests; `tests/unit/serviceRequest.rules.test.js` U-07 to U-09 | Execution must be confirmed in the team's test environment |
| Request ID validation | `parseRequestId` in `src/domain/serviceRequest.rules.js` | U-07 | Execution must be confirmed |
| Request title/description/category validation | `validateNewRequest` in `src/domain/serviceRequest.rules.js` | U-01 to U-06 | Execution must be confirmed |

## Evidence still to record
For each test, add actual execution date, release commit SHA, expected result, actual result, pass/fail, and a link to the CI run or captured test output. Do not infer a pass from the presence of a test file.
