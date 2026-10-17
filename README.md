# CivicConnect

## SEN381 Software Engineering Project

CivicConnect is a controlled software engineering project focused on
developing a digital platform for managing community service requests.

The project addresses problems caused by fragmented communication channels,
including email, telephone calls, messaging platforms, spreadsheets and
paper-based records.

## Project Purpose

CivicConnect aims to provide a controlled and centralised approach for:

- Submitting service requests
- Categorising requests
- Tracking request status
- Managing request assignments
- Recording actions and resolutions
- Supporting management reporting
- Improving accountability and traceability

## Milestone 1

Milestone 1 establishes the Engineering Foundation and Requirements Baseline.

Key artefacts include:

- Problem and Business Need
- Stakeholder Analysis
- Scope Baseline
- Constraints and Trade-offs
- Functional Requirements
- Non-Functional Requirements
- Acceptance Criteria
- Requirements Traceability Matrix
- Risk Register
- Forward Engineering Considerations
- Engineering Decision Log
- AI Usage Register
- PED v1.0

## Repository Governance

This repository follows controlled engineering practices.

Substantive changes should be made through:

1. GitHub Issues
2. Working Branches
3. Pull Requests
4. Peer Reviews
5. Required Approval Before Merge

The main branch represents the controlled project baseline.

## Team

- Team Member 1 – Business, Scope & Stakeholders
- Team Member 2 – Requirements, Traceability & Risk
- Team Member 3 – Governance, Forward Planning & PED

## Application & Technical Documentation (M3)

### Tech stack
- **Backend:** Node.js, Express 5, RESTful JSON API under `/api/v1`
- **Database:** PostgreSQL, accessed through the Sequelize v6 ORM (ADR-04)
- **Authentication:** stateless JWT with a role claim (ADR-05, interim: no login endpoint yet)
- **Tests:** Jest + Supertest (integration tests against a real test database)
- **Load testing:** autocannon (`npm run loadtest`)
- **Frontend:** React (planned, not part of this milestone's code)

### Architecture (layered, no microservices)
| Folder | Layer | Responsibility |
|---|---|---|
| `src/presentation/` | Presentation (HTTP adapter) | Routes, controllers, JWT/role middleware, error mapping. No business rules, no DB access. |
| `src/application/` | Application | Use cases and **service-layer ORM transactions**; retry on deadlock; publishes domain events (ADR-02 Observer). |
| `src/domain/` | Domain | Pure business and validation rules (no Express, no ORM). |
| `src/persistence/` | Persistence | Sequelize models and repositories. Repositories take a transaction; they never open one. |

Entry points: `server.js` (starts the server) and `src/app.js` (builds the Express app so tests can import it).

### Prerequisites
Node.js v18+ and PostgreSQL v14+ (a Docker container is fine).

### Setup
1. `npm install`
2. Create two empty databases, for example `civicconnect` and `civicconnect_test` (the test database name must contain `test`).
3. Copy `.env.example` to `.env` and set `DATABASE_URL`, `TEST_DATABASE_URL` and `JWT_SECRET`. Never commit `.env`.
4. `npm run migrate` to create the tables in the development database.
5. `npm start` to run the API (default port 3000).

To try the staff-only endpoint by hand, run `npm run seed:dev` (development only). It creates a staff user and prints a Bearer token.

### Active endpoints
| Method and path | Requirement | Access | Success | Errors |
|---|---|---|---|---|
| `POST /api/v1/requests` | FR-01 | Public | `201` `{ message, trackingId }` | `400` `VALIDATION_ERROR`, `INVALID_REFERENCE`, `INVALID_JSON` |
| `PUT /api/v1/requests/:id/resolve` | FR-04 | Staff (Bearer JWT) | `200` request + resolution comment | `400` `COMMENT_REQUIRED`, `COMMENT_TOO_LONG`, `INVALID_ID`; `401`; `403`; `404` `REQUEST_NOT_FOUND`; `409` `ALREADY_RESOLVED` |

Error bodies have the form `{ "error": { "code": "...", "message": "..." } }`.

**FR-04 atomicity:** the status change to `Resolved` and the mandatory resolution comment are written in one transaction with a row lock (`SELECT ... FOR UPDATE`), so a partial state is impossible and two staff cannot resolve the same request twice.

### Testing
`npm test` applies migrations to the test database, then runs 69 tests in 6 suites:
- **Unit (46):** domain rules in `tests/unit/` - `serviceRequest.rules.test.js` (U-01 to U-09, QA) and `serviceRequest.rules.boundary.test.js` (boundary-value and equivalence-partition cases; some overlap with U-01 to U-09).
- **Integration (21):** FR-01 and FR-04 over HTTP against a real PostgreSQL database - rollback on failure, mandatory comment, access control, 404/409, a five-way concurrency check, and retry on deadlock (`40P01`) and serialisation failure (`40001`) (`tests/integration/`).
- **System journeys (2):** API-level journeys from citizen submission to staff resolution (`tests/e2e/critical-journeys.test.js`). These are not browser tests; full-stack E2E needs the frontend.

The tests empty the test database tables, so they refuse to run unless `TEST_DATABASE_URL` differs from `DATABASE_URL` and contains `test`.

### Static checks and continuous integration
- `npm run lint` runs ESLint (`eslint.config.js`).
- `.github/workflows/m3-ci.yml` (job "Test, static checks and dependency audit") runs on every pull request to `main` and on pushes to `main`: syntax checks, ESLint, `npm audit --audit-level=high`, then migrations and the full Jest suite against a PostgreSQL service. Require this check in the branch protection rule for `main`.
- Staging: see `.github/workflows/m3-staging.yml` and `docs/M3/Marco-CI-Staging-Runbook.md`.

### Load testing
`npm run loadtest` starts the API against the test database and runs 1, 10, 50 and 100 concurrent connections against `POST /api/v1/requests`, then saves reports to `loadtest/results/`. Options: `LOAD_DURATION`, `LOAD_STAGES`, `LOAD_PORT`, `DB_POOL_MAX`. Raw reports are in `loadtest/results/`; results and interpretation: `docs/performance/load-test-report.md`.

### Known limitations
- No login or user-management endpoint; tokens come from the development script only.
- No rate limiting on the public `POST /api/v1/requests` (recommended; needs an ADR).
- `categoryId` is optional on request creation (M2 behaviour), although FR-01 describes categorised requests.
- Only the transition to `Resolved` is implemented; other status transitions belong to later features.

### Architecture decisions
See `docs/adr/` for ADR-04 (ORM selection) and ADR-05 (authentication mechanism).
