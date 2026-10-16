# Milestone 3 QA — Test Strategy (Nkosana)

## Scope
This contribution adds focused unit tests for the existing CivicConnect domain rules in `src/domain/serviceRequest.rules.js`. Existing integration tests remain part of the project's test suite and cover FR-01 request creation and FR-04 request resolution.

## Formal black-box techniques
For functional tests, apply:
- **Equivalence Partitioning:** valid requests vs requests with missing/blank required fields, invalid category identifiers, unauthorised callers, and requests that do not exist.
- **Boundary Value Analysis:** title length at 200 characters and just over 200; description length at 5,000 and just over 5,000; resolution comment length at 2,000 and just over 2,000.

Use the existing integration tests where they cover these cases. Add missing cases only after checking the current suite to avoid duplication.

## Unit tests added
`tests/unit/serviceRequest.rules.test.js` contains nine tests for:
- valid request normalization;
- missing/blank title;
- missing/blank description;
- title length boundary;
- category ID type/range;
- optional category ID behavior;
- request ID parsing;
- resolution comment validation;
- already-resolved status validation.

## Execution evidence
Do not mark tests as passed until they have been executed in the team's environment with the required test database configured. The project `pretest` script runs migrations against `TEST_DATABASE_URL`; use a dedicated test database whose name includes `test`, and ensure it differs from `DATABASE_URL`.

Suggested commands:
```bash
npm ci
npm test
```

Record the command, date, commit SHA, test summary, and any failures in the release evidence after execution.
