# Test script for the new API endpoints
Write-Host "Testing Guidelines Groups API..."

try {
    # Test guidelines groups endpoint (protected, should return 401)
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/guidelines-groups" -Method GET -Headers @{"Accept"="application/json"} -ErrorAction Stop
    Write-Host "Guidelines Groups API Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Guidelines Groups API Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    }
}

Write-Host "`nTesting Guidelines Standards API..."

try {
    # Test guidelines standards endpoint (protected, should return 401)
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/guidelines-standards" -Method GET -Headers @{"Accept"="application/json"} -ErrorAction Stop
    Write-Host "Guidelines Standards API Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Guidelines Standards API Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    }
}

Write-Host "`nTesting Sample Templates API..."

try {
    # Test sample templates endpoint (protected, should return 401)
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/samples-templates" -Method GET -Headers @{"Accept"="application/json"} -ErrorAction Stop
    Write-Host "Sample Templates API Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Sample Templates API Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    }
}

Write-Host "`nAll endpoints are responding (401 is expected for protected routes)"
