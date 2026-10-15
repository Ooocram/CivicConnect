# PED v3.0 – Performance & Load Exercise (TEMPLATE)

> Fill every [bracketed] item with YOUR OWN results from `npm run loadtest` on your machine.
> Paste the generated table from `loadtest/results/*.md`. Do not reuse anyone else's numbers.

## 1. Objective
Provide measured evidence that the most sensitive operation, `POST /api/v1/requests` (FR-01), meets defined acceptance thresholds under expected load, and identify where it saturates (addresses RSK-07 and the "Performance & scalability" production-readiness concern).

## 2. Operation under test and why it was chosen
Public (unauthenticated), write-heavy (one INSERT inside a service-layer transaction) and therefore the first operation exposed to traffic spikes or abuse (STRIDE: Denial of Service).

## 3. Method
- Tool: autocannon (Node.js), script `loadtest/run-load-test.js`, run with `npm run loadtest`.
- Stages: [1, 10, 50, 100] concurrent connections, [15] seconds each, after a 3-second discarded warm-up.
- API started as a separate process against the TEST database; payload: [valid synthetic request, ~150 bytes].
- Data-integrity check after every stage: rows saved vs 2xx responses.
- Environment: [CPU model/cores, RAM, OS, Node version, DB_POOL_MAX]. Load generator, API and PostgreSQL share one machine.

## 4. Acceptance thresholds (team-defined)
| Metric | Threshold | Justification |
|---|---|---|
| Error rate at <= [50] connections | [0%] | A citizen must never lose a submission |
| p97.5 latency at <= [50] connections | [<= 500 ms] | [Stricter stand-in for p95; interactive form submission feels immediate under ~0.5 s] |
| Lost writes | 0 (every 2xx has a saved row) | FR-01 atomicity / data integrity |
| Expected peak concurrency | [50] | [ASSUMPTION – justify, e.g. size of municipality] |

## 5. Results
[Paste the Markdown table here.]

## 6. Interpretation (structure to follow)
1. **Throughput:** [Does req/s rise then plateau? At which concurrency? Plateau value = saturation point.]
2. **Latency vs concurrency:** [After the plateau, latency should grow roughly linearly (Little's law: concurrency ≈ throughput × mean latency). Check this with your numbers.]
3. **Errors and timeouts:** [Any non-2xx, errors or timeouts? At which stage?]
4. **Data integrity:** [Lost writes = 0? Surplus rows <= connections (requests in flight when the timer stopped)?]
5. **Bottleneck hypothesis and experiment:** [Compare DB_POOL_MAX=5 vs [20]. If throughput does not change, the pool is not the limiter; state what the evidence points to (e.g. CPU shared by Node, PostgreSQL and the load generator).]
6. **Verdict per threshold:** [PASS/FAIL table].

## 7. Risks and recommendations
- Unauthenticated writes at [N] req/s allow rapid database growth/spam. Recommended mitigation: [rate limiting per IP – adopting a library requires a new ADR].
- [Tuning actions taken or deferred, with reason.]

## 8. Limitations
- Single machine, local database, no network latency, synthetic payload, one endpoint.
- Closed-loop load (fixed connections), so latency under overload is understated versus a fixed arrival rate.
- Short stages: no soak test (memory leaks, pool exhaustion over hours not covered).
- Single run per configuration: [repeat 3 times and report the median].

## 9. Conclusion
[One paragraph: thresholds met/not met, saturation point, main risk, next step.]
