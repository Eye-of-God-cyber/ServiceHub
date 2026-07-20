# ServiceHub — Load Testing Scripts

This directory contains load-testing scripts and results for the ServiceHub API.

## Tool

[autocannon](https://github.com/mcollina/autocannon) — HTTP/1.1 benchmarking tool for Node.js.

## Running benchmarks

> Requires the server to be running locally on `http://localhost:3000`.

```bash
# Start the server
npm run dev

# In a second terminal, run benchmarks
node scripts/benchmarks/run_benchmarks.js
```

Results will be saved to `scripts/benchmarks/benchmark_results.json`.

## Results summary

See `benchmark_results.json` for the full output. Key results (50 concurrent connections, Neon Free Tier):

| Endpoint                    | Req/s | Avg Latency | P99    | Errors |
|-----------------------------|-------|-------------|--------|--------|
| `GET /api/v1/catalog/services` | ~60   | 827 ms      | 1.18 s | 0      |
| `GET /api/v1/notifications`    | ~43   | 1.13 s      | 1.51 s | 0      |

Zero error rates across all concurrency levels. Latency is dominated by Neon Free Tier
network round-trip, not server processing time.
