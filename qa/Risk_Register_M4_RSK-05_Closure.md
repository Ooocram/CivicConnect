# RSK-05 Closure Record (Milestone 4)

**Status:** closure proposed by the risk owner. Acceptance of the residual risk is pending sign-off (see the end of this file).

## Register entry (Initial Risk Register format)

| Risk ID | Description | Probability | Impact | Priority | Mitigation | Contingency | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| RSK-05 | Data Integrity: ORM transaction deadlock during concurrent status updates. | Low (residual, proposed) | Medium (one failed request, no partial state) | Low (residual, proposed) | Row lock (`SELECT ... FOR UPDATE`), explicit READ COMMITTED isolation and retry of the whole transaction (3 attempts, only on PostgreSQL 40P01 and 40001) in `src/application/request.service.js`; short transaction with validation before it opens. | If a deadlock or exhausted retry is observed, the caller receives HTTP 500 with no partial state and can retry. Re-open this risk before adding any transaction that locks more than one row. | Otsile Sebola | Closed: mitigated and verified; residual risk acceptance pending sign-off |

Original wording (PED v2.0): "ORM transaction deadlock during concurrent status updates." Mitigation: "Implement transaction retry logic and appropriate isolation levels."

## Controls and evidence

| Control | Location | Evidence | Result |
|---|---|---|---|
| Row lock on the request being resolved | `findByIdForUpdate` in `src/persistence/request.repository.js` | `tests/integration/fr04-resolve-request.test.js`: "5 simultaneous resolves: exactly one wins (200), the rest get 409, one comment total" | Passes |
| Explicit READ COMMITTED isolation | `resolveRequest` in `src/application/request.service.js` | Exercised by every FR-04 integration test (the isolation level itself is not asserted) | Passes (behavioural only) |
| Retry on deadlock (40P01) and serialisation failure (40001), 3 attempts, backoff 50 ms then 100 ms | `withRetry` in `src/application/request.service.js` | `tests/integration/fr04-retry.test.js`: a transient 40P01 and a transient 40001 are each retried and still resolve exactly once with one comment (2 tests); a persistent 40P01 gives up after 3 attempts with HTTP 500, the request still Open and no comment; a non-deadlock error (23505) is not retried | 4 tests pass |
| Atomic rollback | Managed transaction in `resolveRequest` | `tests/integration/fr04-resolve-request.test.js`: "ROLLS BACK the status change when the comment insert fails (no partial state)" | Passes |

## Not used as evidence

The load test (`docs/performance/load-test-report.md`) targets `POST /api/v1/requests`, which inserts new rows and does not contend on a shared row. It says nothing about contention on the resolve path, so it is not cited for this risk.

## Residual risk and limits

- The retry path is verified by injecting the PostgreSQL error codes. No real PostgreSQL deadlock was reproduced or observed, so the behaviour of the database's own deadlock detection is relied on, not tested.
- Deadlock is structurally unlikely today because each resolve locks one request row first. Foreign-key checks on the comment insert also take share locks on referenced rows; this is not exercised by the tests. "Unlikely" is an argument, not a proof.
- After 3 failed attempts the caller gets HTTP 500 with no partial state. Retries are not logged, so a retry storm would not be visible in operation.
- Tested on one API instance against one database. A multi-instance deployment was not tested.

## Re-open triggers

1. Any transaction is added that locks more than one row (for example assignment or bulk updates). Require a consistent lock order and new tests first.
2. A 40P01 error or an exhausted retry is seen in CI or in operation.
3. The API is deployed as more than one instance.

## Reproduce the evidence

```
npx jest tests/integration/fr04-retry.test.js tests/integration/fr04-resolve-request.test.js
```

Optional sensitivity check: change `MAX_ATTEMPTS` from 3 to 1 in `src/application/request.service.js`, run the command above and confirm the retry tests fail, then revert the change.

## Fill in on merge

- Commit or tag containing the retry tests: [fill on merge]
- CI run link: [fill on merge]
- Residual-risk acceptance (name, date): [pending sign-off]
