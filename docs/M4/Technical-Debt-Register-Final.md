# CivicConnect — Technical Debt Register, M4

| ID | Outstanding debt | Impact | Priority | Owner | Proposed treatment |
|---|---|---|---|---|---|
| TD-01 | No citizen/staff/management frontend | Original M1 end-user workflows incomplete | Critical | Team | Implement and test UI |
| TD-02 | No real login/token issuance, rotation or revocation | Staff auth not deployable safely | Critical | Backend | Design/approve auth lifecycle |
| TD-03 | Rate limiter is process-local | Multi-instance deployments can evade aggregate limits | High | Backend/DevOps | Use shared Redis-backed limiter |
| TD-04 | CORS origin allowlist needs deployment configuration | Browser access may be incorrectly denied if not configured | Medium | DevOps | Set CORS_ALLOWED_ORIGINS in each environment |
| TD-05 | No SLA/due date for overdue counts | FR-05 incomplete | High | Requirements/Backend | Agree SLA, migrate and test |
| TD-06 | Tracking token is a bearer-like public lookup credential | Exposure can reveal limited request metadata | High | Security | Review token entropy and rate-limit lookup |
| TD-07 | Staging uses ephemeral PostgreSQL | No persistent release/rollback proof | High | DevOps | Persistent staging with backups and rollback |
| TD-08 | No audit-ready production monitoring | Troubleshooting and alerts incomplete | Medium | DevOps | Structured logs, metrics and alerting |
| TD-09 | Original M1 RTM/PED and registers need team signatures | Incomplete governance closure | High | Team | Review and sign; freeze final commit |
| TD-10 | Text search and configurable sort not present | FR-03 acceptance incomplete | Medium | Backend | Add bounded search/sort and tests |

**Status:** open; this register records actual debt and does not imply acceptance or owner signature.
