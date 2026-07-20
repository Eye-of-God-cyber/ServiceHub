const autocannon = require('autocannon');
const fs = require('fs');
const prisma = require('./src/config/prisma');
const { generateAccessToken } = require('./src/utils/jwt.util');

const connections = [10, 25, 50];
const duration = 30;
const results = {};

async function runTest(endpoint, connections) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${endpoint.name} - ${connections} connections`);
    const instance = autocannon({
      url: endpoint.url,
      connections: connections,
      duration: duration,
      headers: endpoint.headers
    }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function main() {
  // Generate a fresh token
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");
  const token = generateAccessToken({ id: user.id, email: user.email });
  
  const endpoints = [
    { name: 'health', url: 'http://localhost:5000/api/v1/health', headers: {} },
    { name: 'catalog_services', url: 'http://localhost:5000/api/v1/catalog/services', headers: {} },
    { name: 'notifications', url: 'http://localhost:5000/api/v1/notifications', headers: { Authorization: `Bearer ${token}` } }
  ];

  for (const endpoint of endpoints) {
    results[endpoint.name] = {};
    for (const c of connections) {
      const res = await runTest(endpoint, c);
      results[endpoint.name][c] = {
        requestsPerSec: res.requests.average,
        throughputMb: (res.throughput.average / 1024 / 1024).toFixed(2),
        latencyAvg: res.latency.average,
        latencyP95: res.latency.p95,
        latencyP99: res.latency.p99,
        latencyMax: res.latency.max,
        errors: res.errors,
        non2xx: res.non2xx
      };
    }
  }
  
  fs.writeFileSync('benchmark_results.json', JSON.stringify(results, null, 2));
  console.log('Benchmarks completed, results saved to benchmark_results.json');
}

main().catch(console.error).finally(() => prisma.$disconnect());
