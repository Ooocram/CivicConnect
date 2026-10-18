# ADR-04 and ADR-05 (Milestone 3)

**Status:** Proposed - pending two-reviewer approval (GitHub governance rule).

## ADR-04: ORM Selection – Sequelize v6
**Context:** PED v2.0 commits to "Service-Layer ORM Transactions" (ADR/Persistence Strategy) but never names an ORM, and the M2 repository contains only the raw `pg` driver (the Golden Trace endpoint is a placeholder). FR-04 needs row locking (`SELECT ... FOR UPDATE`) and managed transactions, plus versioned schema migrations.
**Alternatives considered:** (A) raw `pg` queries – no ORM, contradicts the PED persistence decision; (B) Prisma – strong tooling, but row-level locks require raw SQL and it adds a code-generation build step; (C) Sequelize – CommonJS, native `transaction()` callback with automatic rollback, native `lock: transaction.LOCK.UPDATE`, CLI migrations.
**Decision:** Use Sequelize v6 (+ `pg-hstore`, dev-dependency `sequelize-cli`) on top of the existing `pg` driver.
**Consequences:** One new runtime dependency family (supply-chain exposure – covered by dependency checks in CI); all persistence code stays in `src/persistence/`; the Task C load test measures the endpoint end to end (ORM included) but does not isolate ORM overhead, so no ORM-versus-raw-SQL claim is made. This realises, rather than changes, the M2 persistence decision.

## ADR-05: Authentication Mechanism – Stateless JWT (interim)
**Context:** FR-04 says "Staff must…", so the API must identify the caller and enforce a role. The M2 baseline has no authentication. A full login/registration flow is outside the M3 workload.
**Alternatives considered:** (A) server-side sessions – needs a session store (new infrastructure); (B) no authentication – role rule cannot be enforced; (C) signed JWT (HS256) carrying `uid` and `role`, verified in middleware.
**Decision:** Use `jsonwebtoken` with HS256 pinned at verification; `JWT_SECRET` supplied only via environment (RSK-06). Tokens are minted by `scripts/dev-seed-and-token.js` until a login endpoint exists.
**Consequences:** No session store needed; tokens cannot be revoked before expiry (8 h in dev script); a real login flow, password hashing and token rotation remain future work and must be listed as a known limitation.
