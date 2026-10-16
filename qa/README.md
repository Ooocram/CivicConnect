# QA contribution — CivicConnect M3

This folder contains Nkosana's QA working notes. It is a draft until tests are run against the agreed release candidate and the RTM is reconciled with the existing baseline.

- `M3_QA_Test_Strategy.md`: scope and formal black-box techniques.
- `RTM_M3_Update.md`: incremental traceability note.
- `Defect_Register_M3.md`: working defect register.
- Unit tests: `tests/unit/serviceRequest.rules.test.js`.

Run `npm ci` then `npm test` in a configured environment. The project's `pretest` script runs migrations, so `TEST_DATABASE_URL` must point to a dedicated database whose name contains `test` and differs from `DATABASE_URL`.
