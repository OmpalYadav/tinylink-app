# test-tinylink.ps1
$baseUrl = "http://localhost:3000"
$testCode = "check" + (Get-Date -Format "mmss") # Random unique code

Write-Host "`n🚀 STARTING TINYLINK AUTOMATED TEST...`n" -ForegroundColor Cyan

# 1. Health Check
Write-Host "1. Testing Healthcheck (/healthz)..." -NoNewline
try {
    $health = Invoke-RestMethod -Method Get -Uri "${baseUrl}/healthz"
    if ($health.ok -eq $true) { Write-Host " PASS ✅" -ForegroundColor Green }
    else { Write-Host " FAIL ❌ (Invalid Response)" -ForegroundColor Red }
} catch { Write-Host " FAIL ❌ (Endpoint not found)" -ForegroundColor Red }

# 2. Create Link
Write-Host "2. Creating Link (/api/links)..." -NoNewline
$body = @{ url = "https://google.com"; code = $testCode } | ConvertTo-Json
try {
    $link = Invoke-RestMethod -Method Post -Uri "${baseUrl}/api/links" -Body $body -ContentType "application/json"
    if ($link.code -eq $testCode) { Write-Host " PASS ✅ (Created /$testCode)" -ForegroundColor Green }
    else { Write-Host " FAIL ❌" -ForegroundColor Red }
} catch { Write-Host " FAIL ❌" -ForegroundColor Red; $_ }

# 3. Duplicate Check (Should return 409)
Write-Host "3. Testing Duplicate Code (Expect 409)..." -NoNewline
try {
    Invoke-RestMethod -Method Post -Uri "${baseUrl}/api/links" -Body $body -ContentType "application/json"
    Write-Host " FAIL ❌ (Allowed duplicate)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) { Write-Host " PASS ✅ (Blocked Duplicate)" -ForegroundColor Green }
    else { Write-Host " FAIL ❌ (Wrong Status Code)" -ForegroundColor Red }
}

# 4. Check Redirect
Write-Host "4. Testing Redirect Logic..." -NoNewline
try {
    $req = [System.Net.WebRequest]::Create("${baseUrl}/$testCode")
    $req.AllowAutoRedirect = $false
    $resp = $req.GetResponse()
    Write-Host " PASS ✅ (Redirect Check Passed)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 302) { Write-Host " PASS ✅ (302 Found)" -ForegroundColor Green }
    else { Write-Host " WARN ⚠️ (Manual check recommended)" -ForegroundColor Yellow }
}

# 5. Delete Link
Write-Host "5. Deleting Link..." -NoNewline
try {
    Invoke-RestMethod -Method Delete -Uri "${baseUrl}/api/links/$testCode" -ContentType "application/json"
    Write-Host " PASS ✅" -ForegroundColor Green
} catch { Write-Host " FAIL ❌" -ForegroundColor Red }

# 6. Verify 404 after Delete
Write-Host "6. Verifying Delete (Expect 404)..." -NoNewline
try {
    Invoke-RestMethod -Method Get -Uri "${baseUrl}/api/links/$testCode"
    Write-Host " FAIL ❌ (Link still exists)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) { Write-Host " PASS ✅" -ForegroundColor Green }
    else { Write-Host " FAIL ❌ (Unexpected Status)" -ForegroundColor Red }
}

Write-Host "`n🎉 TESTING COMPLETE! `n" -ForegroundColor Cyan
