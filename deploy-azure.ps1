$ErrorActionPreference = "Stop"

$resourceGroup = "servicehub-rg"
$appName = "servicehub-api-niraj2026"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Azure Production Deployment Sync" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Azure CLI
if (-not (Get-Command "az" -ErrorAction SilentlyContinue)) {
    Write-Host "[Error] Azure CLI (az) is not installed on this machine." -ForegroundColor Red
    Write-Host "Please run this script from a machine where Azure CLI is installed and logged in." -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/4] Parsing local .env securely..." -ForegroundColor Yellow
$envVars = @{}
foreach ($line in Get-Content ".env") {
    if (![string]::IsNullOrWhiteSpace($line) -and !$line.StartsWith("#")) {
        $parts = $line.Split("=", 2)
        if ($parts.Length -eq 2) {
            $envVars[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

# Apply Azure-specific requirements and overrides
$envVars["WEBSITES_PORT"] = "3000"
$envVars["UPLOAD_DIR"] = "/tmp/uploads"
$envVars["RENDER_EXTERNAL_URL"] = "https://$appName.azurewebsites.net"

# We explicitly do NOT set PORT (Azure manages dynamic port assignment via WEBSITES_PORT)
$envVars.Remove("PORT")
$envVars.Remove("DATABASE_URL_UNPOOLED")

Write-Host "Found $($envVars.Count) production environment variables." -ForegroundColor Green

Write-Host "`n[2/4] Syncing settings to Azure App Service..." -ForegroundColor Yellow
Write-Host "Target: $appName in $resourceGroup" -ForegroundColor DarkGray

# Build settings array securely without echoing secrets to the terminal
$settingsArgs = @()
foreach ($key in $envVars.Keys) {
    $val = $envVars[$key]
    # Escape quotes if necessary
    $val = $val -replace '"', '\"'
    $settingsArgs += "$key=`"$val`""
}

# Run az CLI. Piping to Out-Null prevents the secrets from being echoed back by the JSON response.
az webapp config appsettings set --resource-group $resourceGroup --name $appName --settings $settingsArgs | Out-Null
Write-Host "App Settings successfully updated." -ForegroundColor Green

Write-Host "`n[3/4] Restarting Azure Web App..." -ForegroundColor Yellow
az webapp restart --name $appName --resource-group $resourceGroup | Out-Null
Write-Host "Web App restarted." -ForegroundColor Green

Write-Host "`n[4/4] Streaming Container Logs..." -ForegroundColor Yellow
Write-Host "Wait 30-60 seconds for the container to boot and Prisma to connect." -ForegroundColor DarkGray
Write-Host "Verify health at: https://$appName.azurewebsites.net/api/v1/health" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop log streaming when healthy.`n" -ForegroundColor DarkGray

az webapp log tail --name $appName --resource-group $resourceGroup
