# SEN381 FINAL — Original M1 Acceptance-Criterion Reconciliation

**Source of truth:** `CivicConnect_M1_Otsile_Workload-v2.docx`, section 1, Requirements & Acceptance Criteria, and section 2 Initial RTM. The baseline contains **seven individually stated acceptance criteria**, FR-01 through FR-05 and NFR-01 through NFR-02. No criteria are removed or split for this working calculation.

**Assessment state:** proposed functionality in PR #11, not yet merged; **scores below are conditional** on successful tests, acceptance review and a demonstration. The current submitted main branch retains the older scope classification until PR #11 is accepted.

| M1 criterion | Original meaning | Proposed delivered evidence | Provisional score |
|---|---|---|---:|
| FR-01 | Requester submits categorised request and sees confirmation | Existing POST, 201/tracking ID, optional category; no requester UI | 0.5 |
| FR-02 | Requester accesses list of previously submitted requests, history and lifecycle status | New tracking-ID lookup and event summary; **not a requester-specific list** and no UI | 0.5 |
| FR-03 | Staff search, filter, sort and self-assign open requests | New authenticated list with category/status filters and assignment; no text search or configurable sort, no staff UI | 0.5 |
| FR-04 | Staff transitions to Resolved with mandatory resolution comment | Existing tested atomic resolve endpoint, JWT staff role; no staff login/UI | 0.5 |
| FR-05 | Management summary of open, overdue, resolved and closed requests | New staff-only status counts; **overdue unavailable** without SLA/due dates, no management role/report UI | 0.5 |
| NFR-01 | Access controls restrict staff/management request visibility | JWT staff-only list, assignment, reporting and resolve; public tracking lookup returns redacted status; no full identity lifecycle | 0.5 |
| NFR-02 | Documentation demonstrates zero/low-cost selected technologies for 3 students | Open-source stack and documented technology selection, **no approved operational cost schedule** | 0.5 |

**Provisional post-PR score:** 7 partial × 0.5 = **3.5 / 7 = 50.0%**. This is a conservative, evidence-limited interpretation, **not an approved official mark**. If the team can prove a fully satisfied criterion with the original exact wording, update only that criterion and cite evidence. Every one-step partial-to-met upgrade increases the overall score by 7.14 percentage points. Even two upgrades yield 64.3%, not 80%. At least 5.6 points out of 7 are needed to reach 80% under the rubric, so six fully met criteria or an equivalent valid combination is necessary.

**No scope inflation:** A tracking-ID lookup is not a requester-owned history list; a status summary lacking overdue is not full management reporting. Code passing does not establish end-user acceptance. Recalculate on the frozen final merge commit and record owner/assessor agreement.
