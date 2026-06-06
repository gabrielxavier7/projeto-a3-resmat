$checks = 6
for ($i = 1; $i -le $checks; $i++) {
    Write-Output "=== $(Get-Date -Format o) Check $i/$checks ==="
    nslookup a3resmat.com
    nslookup www.a3resmat.com
    try {
        curl.exe -I --connect-timeout 10 https://a3resmat.com
    } catch {
        Write-Output "curl a3resmat failed"
    }
    try {
        curl.exe -I --connect-timeout 10 https://www.a3resmat.com
    } catch {
        Write-Output "curl www a3resmat failed"
    }
    if ($i -lt $checks) {
        Write-Output "Sleeping 300s..."
        Start-Sleep -Seconds 300
    }
}
Write-Output "Monitoring complete."
