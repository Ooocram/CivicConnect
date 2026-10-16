# M3 — Marco Rentroia: CI, security and staging runbook

## Scope
This workstream owns GitHub Actions automation, quality gates, static/security checks, simulated staging, and PED v3.0 release documentation. It does not modify Nkosana's unit tests, black-box tests, RTM, or defect register.

## CI quality gate
`.github/workflows/m3-ci.yml` runs on pull requests to main and pushes to main. It installs the lockfile with `npm ci`, checks JavaScript syntax, blocks on high/critical dependency vulnerabilities using `npm audit --audit-level=high`, and runs existing Jest tests against a separate PostgreSQL test database. The repository's `pretest` script performs migrations before Jest. A failed step fails the job.

**Important:** GitHub Actions job failure alone does not prevent merging. Repository administrators must configure a main-branch ruleset or protection rule requiring the **Test, static checks and dependency audit** job and two non-author approvals, disallow bypasses, and disallow direct pushes. Verify the exact check name in Actions before enabling it.

## Simulated staging
`.github/workflows/m3-staging.yml` is a manually triggered workflow using the GitHub **staging** environment, isolated ephemeral PostgreSQL and Node.js process. It runs migrations, starts the API and checks that its HTTP listener responds. This is a simulated staging deployment, **not** a persistent hosted deployment and **not** proof that a business transaction succeeds. Configure the staging environment in GitHub Settings > Environments; set appropriate reviewers if available. Do not put real production credentials in the workflow. For an externally reachable staging URL, a separate hosting platform, deployment secrets and endpoint-specific E2E checks are still required.

## Evidence capture
Record each workflow run URL, commit SHA, job outcome and date in PED v3.0. Run staging manually after merging approved changes. Preserve failed runs and document remediation rather than claiming an unexecuted test passed.

## Team integration
After Nkosana's tests and RTM land, re-run CI and add test result links to PED. After Otsile's API/performance work lands, verify the staging smoke test and add performance evidence. Two shared critical E2E journeys and two non-author PR approvals remain mandatory.
