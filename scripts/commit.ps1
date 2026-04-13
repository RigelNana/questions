while ($true) {
    npm run build && git add . && git commit -m "feat: update" && git push -u origin main
    Start-Sleep -Seconds 300
}
