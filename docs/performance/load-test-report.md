# Load Test Report – POST /api/v1/requests (Milestone 3, Task C)

Evidence for PED v3.0. Raw reports (`.json` / `.md`) are produced by `npm run loadtest` into `loadtest/results/`.

## 1. Objective and operation under test

Measure whether the public, write-heavy submission endpoint `POST /api/v1/requests` (FR-01) meets team-defined acceptance thresholds under expected load, and find where it saturates (risk RSK-07; STRIDE *Denial of Service*). The endpoint is unauthenticated and performs one transactional INSERT, so it is the first operation exposed to traffic spikes or abuse. No numeric performance NFR exists in the requirements baseline (only NFR-01 access control and NFR-02 cost), so the thresholds below are team-defined and assumed.

## 2. Method

- Tool: `autocannon` (Node.js), driven by `loadtest/run-load-test.js` (`npm run loadtest`).
- Per run: 3 s discarded warm-up, then stages of 1, 10, 50 and 100 concurrent connections, 15 s each. Fixed-connection (closed-loop) load, synthetic valid JSON payload, no think time.
- The API runs as a separate process against the **test** database; the script refuses to run unless the database name contains `test`.
- After every stage the script compares rows saved with 2xx responses (data-integrity check).
- Two configurations: `DB_POOL_MAX=5` (default) and `DB_POOL_MAX=20`, three runs each (six runs in total).
- Environment: 16 x AMD Ryzen 7 5700U, 6 GB RAM (as reported by Node), Windows (win32 10.0.26300), Node v22.12.0, PostgreSQL 16 in a Docker container (Docker Desktop, WSL 2 backend). Load generator, API and database shared one machine.

## 3. Acceptance thresholds (team-defined, assumed)

| Metric | Threshold | Applies to |
|---|---|---|
| Error rate (non-2xx, errors, timeouts) | 0% | Stages up to 50 connections |
| p97.5 latency (stricter stand-in for p95) | <= 500 ms | Stages up to 50 connections |
| Lost writes | none: every 2xx response has a saved row | All stages |
| Expected peak concurrency | 50 connections (assumption) | Stages above it are stress stages, informational only |

## 4. Results: median of three runs (min-max in brackets)

### Pool 5 (default)

| Connections | Req/s | Mean ms | p50 ms | p97.5 ms | p99 ms | Max ms |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 105 (93-123) | 9.1 (7.6-10.2) | 9 (7-9) | 15 (12-19) | 16 (12-22) | 34 (21-45) |
| 10 | 258 (247-287) | 38.3 (34.3-40) | 37 (33-40) | 55 (53-57) | 61 (59-62) | 91 (81-99) |
| 50 | 274 (183-308) | 180.7 (161.1-271.4) | 177 (160-274) | 239 (209-363) | 275 (218-373) | 309 (234-396) |
| 100 | 257 (245-324) | 385.5 (305.7-404.2) | 383 (301-389) | 515 (373-558) | 541 (381-568) | 561 (390-578) |

### Pool 20

| Connections | Req/s | Mean ms | p50 ms | p97.5 ms | p99 ms | Max ms |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 108 (102-119) | 8.8 (7.8-9.3) | 8 (8-9) | 16 (12-16) | 17 (13-20) | 35 (16-53) |
| 10 | 278 (246-296) | 35.6 (33.4-40.1) | 33 (31-36) | 60 (55-75) | 66 (66-88) | 123 (120-137) |
| 50 | 316 (289-324) | 157.2 (153.6-171.6) | 157 (150-164) | 208 (194-263) | 235 (203-289) | 276 (259-331) |
| 100 | 293 (286-324) | 337 (306.4-348.1) | 335 (310-342) | 413 (359-470) | 423 (370-507) | 438 (379-524) |

## 5. Raw results (all six runs)

| Run | Pool | Connections | Req/s | Mean ms | p50 | p90 | p97.5 | p99 | Max | 2xx | Failed | Rows saved |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| P5-1 | 5 | 1 | 105 | 9.1 | 9 | 12 | 15 | 16 | 34 | 1571 | 0 | 1572 |
| P5-1 | 5 | 10 | 247 | 40 | 40 | 49 | 57 | 62 | 99 | 3703 | 0 | 3713 |
| P5-1 | 5 | 50 | 183 | 271.4 | 274 | 334 | 363 | 373 | 396 | 2749 | 0 | 2766 |
| P5-1 | 5 | 100 | 245 | 404.2 | 389 | 481 | 558 | 568 | 578 | 3669 | 0 | 3685 |
| P20-1 | 20 | 1 | 102 | 9.3 | 9 | 12 | 16 | 20 | 35 | 1526 | 0 | 1527 |
| P20-1 | 20 | 10 | 246 | 40.1 | 36 | 56 | 75 | 88 | 120 | 3695 | 0 | 3705 |
| P20-1 | 20 | 50 | 289 | 171.6 | 164 | 206 | 263 | 289 | 331 | 4331 | 0 | 4350 |
| P20-1 | 20 | 100 | 293 | 337 | 335 | 369 | 413 | 423 | 438 | 4400 | 0 | 4425 |
| P5-2 | 5 | 1 | 93 | 10.2 | 9 | 14 | 19 | 22 | 45 | 1398 | 0 | 1399 |
| P5-2 | 5 | 10 | 258 | 38.3 | 37 | 47 | 55 | 61 | 91 | 3869 | 0 | 3879 |
| P5-2 | 5 | 50 | 274 | 180.7 | 177 | 208 | 239 | 275 | 309 | 4112 | 0 | 4126 |
| P5-2 | 5 | 100 | 257 | 385.5 | 383 | 442 | 515 | 541 | 561 | 3849 | 0 | 3862 |
| P5-3 | 5 | 1 | 123 | 7.6 | 7 | 9 | 12 | 12 | 21 | 1847 | 0 | 1848 |
| P5-3 | 5 | 10 | 287 | 34.3 | 33 | 43 | 53 | 59 | 81 | 4308 | 0 | 4318 |
| P5-3 | 5 | 50 | 308 | 161.1 | 160 | 181 | 209 | 218 | 234 | 4622 | 0 | 4649 |
| P5-3 | 5 | 100 | 324 | 305.7 | 301 | 353 | 373 | 381 | 390 | 4857 | 0 | 4873 |
| P20-2 | 20 | 1 | 119 | 7.8 | 8 | 10 | 12 | 13 | 16 | 1790 | 0 | 1791 |
| P20-2 | 20 | 10 | 278 | 35.6 | 33 | 50 | 60 | 66 | 123 | 4164 | 0 | 4174 |
| P20-2 | 20 | 50 | 324 | 153.6 | 150 | 183 | 208 | 235 | 276 | 4862 | 0 | 4876 |
| P20-2 | 20 | 100 | 324 | 306.4 | 310 | 332 | 359 | 370 | 379 | 4866 | 0 | 4886 |
| P20-3 | 20 | 1 | 108 | 8.8 | 8 | 12 | 16 | 17 | 53 | 1615 | 0 | 1616 |
| P20-3 | 20 | 10 | 296 | 33.4 | 31 | 43 | 55 | 66 | 137 | 4433 | 0 | 4443 |
| P20-3 | 20 | 50 | 316 | 157.2 | 157 | 180 | 194 | 203 | 259 | 4747 | 0 | 4767 |
| P20-3 | 20 | 100 | 286 | 348.1 | 342 | 432 | 470 | 507 | 524 | 4284 | 0 | 4304 |

Report files (run, timestamp UTC): P5-1 = `loadtest-pool5-2026-10-15T00-41-22-163Z`; P20-1 = `loadtest-pool20-2026-10-15T00-48-29-800Z`; P5-2 = `loadtest-pool5-2026-10-15T00-53-17-329Z`; P5-3 = `loadtest-pool5-2026-10-15T00-56-57-367Z`; P20-2 = `loadtest-pool20-2026-10-15T00-59-24-686Z`; P20-3 = `loadtest-pool20-2026-10-15T01-01-20-533Z`.

## 6. Interpretation

1. **Thresholds met.** At the assumed peak of 50 connections all six runs passed: 0 failed requests, p97.5 between 194 and 363 ms (worst case 363 ms, 27% under the 500 ms limit), no lost writes.
2. **Saturation.** Throughput rises from about 105 req/s (1 connection) to about 260-280 req/s at 10 connections and then plateaus at roughly 260-320 req/s. More concurrency only adds queueing: median mean latency grows from about 36 ms (10 connections) to about 170 ms (50) and about 350 ms (100) at near-constant throughput. Little's law (throughput x mean latency = connections) holds in every case (9.9, 49.5 and 99.1 for pool 5; 9.9, 49.7 and 98.7 for pool 20), which supports the validity of the measurements.
3. **Graceful degradation.** At 100 connections (stress) pool 5 exceeded 500 ms p97.5 in 2 of 3 runs (558 and 515 ms) and pool 20 in 0 of 3 (maximum 470 ms). Neither produced errors, timeouts or lost writes.
4. **Data integrity.** Rows saved were never fewer than 2xx responses. The surplus (1 to 27 rows) is always below the connection count and is explained by requests still in flight when the timer stopped.
5. **Pool experiment: inconclusive.** Medians favour pool 20 at 50 connections (316 vs 274 req/s, +15%; p97.5 208 vs 239 ms, -13%) and 100 connections (293 vs 257 req/s, +14%; p97.5 413 vs 515 ms, -20%), but the min-max ranges overlap in every case, and one pool-5 run (308 req/s at 50 connections) matched pool-20 performance. The first pool-5 run (183 req/s at 50 connections) was an outlier. The pool is therefore not shown to be a bottleneck, and the default of 5 was kept.
6. **Unidentified limit.** Throughput stops growing at about 300 req/s. Resource usage (CPU, memory, database waits) was not measured, so the cause is not established. Candidate explanations (CPU shared by load generator, API and database; the Docker/WSL 2 network path) are hypotheses only.

## 7. Risks and recommendations

- Unauthenticated writes at 250-320 req/s can add up to about 4,900 rows in 15 seconds (largest observed: 4,886), so spam or abuse could grow the database quickly (STRIDE: Denial of Service). **Recommendation:** per-IP rate limiting on `POST /api/v1/requests`. Adopting a rate-limiting library is a new dependency and needs an ADR, so it is recorded as a deferred decision, not implemented.
- Re-run this test and re-evaluate the pool size if the expected peak rises, the hosting environment changes, or the endpoint gains additional writes.

## 8. Limitations

- Single machine; load generator, API and database compete for CPU; database accessed through Docker/WSL 2 port forwarding. Absolute numbers are environment-specific.
- Synthetic payload, one endpoint, no think time. 50 connections here is not 50 users: real users pause between requests.
- Closed-loop load understates latency under overload compared with a fixed arrival rate.
- 15-second stages and three runs per configuration; no soak test. Runs were not alternated between pool sizes, so the two slowest runs (the first of each pool size, early in the session) may reflect warm-up or background activity.
- No resource-usage metrics were captured.

## 9. Conclusion

`POST /api/v1/requests` met all team-defined thresholds at the assumed peak of 50 concurrent connections, with no errors and no lost writes in six runs. It saturates at roughly 300 req/s on the test machine and degrades by queueing rather than failing. The connection-pool experiment was inconclusive, so the default is unchanged. The main residual risk is abuse of the unauthenticated endpoint; rate limiting is recommended and deferred pending an ADR.
