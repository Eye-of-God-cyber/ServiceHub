$ErrorActionPreference = "Stop"

Write-Host "Starting Node server..."
$serverProcess = Start-Process node -ArgumentList "server.js" -NoNewWindow -PassThru

# Wait for server to be healthy
$maxRetries = 10
$retryCount = 0
$isHealthy = $false

while (-not $isHealthy -and $retryCount -lt $maxRetries) {
    Start-Sleep -Seconds 2
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/health" -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $isHealthy = $true
            Write-Host "Server is healthy!"
        }
    } catch {
        Write-Host "Waiting for server to start..."
        $retryCount++
    }
}

if (-not $isHealthy) {
    Write-Host "Server failed to start."
    Stop-Process -Id $serverProcess.Id -Force
    exit 1
}

Write-Host "Running benchmarks..."
try {
    node run_benchmarks.js
} finally {
    Write-Host "Stopping server..."
    Stop-Process -Id $serverProcess.Id -Force
}

Write-Host "Done!"
