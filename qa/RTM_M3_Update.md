# RTM — M4 Continuation of M1 Baseline

**Baseline:** `docs/requirments/Initial Requirements Traceability Matrix.docx`. **Code SHA:** `3b86b25aec7ad423f3ddb155c2d5ec9087210240`. **CI:** [69/69 passed](https://github.com/Ooocram/CivicConnect/actions/runs/39158865119). This continuation is not a replacement for the original RTM.

| Requirement | Priority | Acceptance criterion | Implementation | Verification | Outcome |
|---|---|---|---|---|---|
| FR-01 submit/categorise | High | Submit categorised request and receive confirmation | `POST /api/v1/requests` | `tests/integration/fr01-create-request.test.js`; API journey; CI | Partial user-level acceptance: 201, tracking ID, persistence pass; category optional and UI absent |
| FR-02 view status/history | High | Requester views request history/status | None | None | Not met |
| FR-03 filter/assign | High | Staff filters and assigns open requests | None | None | Not met |
| FR-04 resolve/comment | High | Staff resolves and adds mandatory comment | `PUT /api/v1/requests/:id/resolve` | `tests/integration/fr04-resolve-request.test.js`; `fr04-retry.test.js`; API journey; CI | API criterion met, user journey partial (no login/UI) |
| FR-05 management activity | Medium | Open/overdue/resolved summary | None | None | Not met |
| NFR-01 access control | High | Authorised staff only | JWT role middleware on resolve | 401/403 negative tests | Partial: no full auth lifecycle |
| NFR-02 low-cost operations | Medium | Affordable stack | Node/PostgreSQL/GitHub Actions | Decision/constraints docs | Provisional; actual cost proof not accepted |

**Coverage:** 46 unit, 21 integration and 2 API/database journey tests = 69/69 passed in linked CI. Test design uses equivalence partitioning and boundary-value analysis. Browser E2E not implemented.

**Scope calculation warning:** Using seven headings and Met=1, Partial=0.5, Not met=0, a conservative 1.5/7 = 21.4% (FR-01, FR-04, NFR-01 partial; NFR-02 unverified); alternate acceptance of full API FR-01/FR-04 and NFR-02 gives 3.5/7 = 50%. Both below 80%. **The official score must be calculated from every approved original M1 acceptance criterion, not just these headings**, and signed off by the team.

**Governance planned for final submission:** Main branch ruleset **ACTIVE** after planned activation before submission; as of the 18 Oct inspection it was still disabled and required-check list empty. Activation is not evidence of completed requirements and cannot alter acceptance outcomes.
