# M3 outstanding gates — execution checklist

This branch intentionally isolates shared responsibilities and outstanding release gates from Marco's earlier [release evidence PR #5](https://github.com/Ooocram/CivicConnect/pull/5).

| Gate | Evidence needed | Responsible | Status |
| --- | --- | --- | --- |
| Two critical system journeys | Run `tests/e2e/critical-journeys.test.js` in CI and link run | All | Tests committed; pending execution |
| Staging deployment | Manually run `M3 Staging Validation`, capture URL, migration and smoke result | Marco | Pending |
| Peer reviews | Two non-author PR approvals and required status checks | All | Pending |
| Performance and architecture | Executed load test, workload/results, M2 conformance/ADRs | Otsile | Pending evidence |
| Traceability | Baseline M1 RTM reconciled with Nkosana's M3 QA results | Nkosana + All | Pending |
| Final release classification | Update PED v3.0 with all run links, risks and team sign-off | Marco + All | Pending |

## Manual administrator actions
1. In Settings > Environments create **staging**, with reviewer controls where available.
2. In Settings > Rules > Rulesets (or Branches) protect `main`: require `Test, static checks and dependency audit`, require two approvals, block direct pushes and bypasses.
3. Run staging workflow from Actions on a branch containing the staging Sequelize config fix from PR #5 (or after PR #5 is approved and merged).
4. Review PRs independently. Do not merge without two approvals. Archive CI, staging, E2E, performance and RTM evidence.
5. Reclassify the release only when every gate is verified; do not fabricate deployment/test outcomes.
