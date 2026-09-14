# E:\work\TQ\Repos\StructAI-App\deploy-structai.ps1
# StructAI-App Deployment Script
# Author: Paul Hotchin

# Paths
$publish = "E:\work\TQ\Kepler\StructAI\StructAI.App\bin\Release\net8.0\publish\wwwroot"
$docs    = "E:\work\TQ\Repos\StructAI-App\docs"

Write-Host "=== Building StructAI ==="
dotnet publish "E:\work\TQ\Kepler\StructAI\StructAI.App" -c Release

Write-Host "=== Cleaning old GitHub Pages deployment ==="
Remove-Item "$docs\*" -Recurse -Force

Write-Host "=== Copying new published build ==="
Copy-Item "$publish\*" $docs -Recurse -Force

Write-Host "=== Adding .nojekyll ==="
New-Item -Path "$docs\.nojekyll" -ItemType File -Force | Out-Null

Write-Host "=== Committing and pushing to GitHub ==="
cd "E:\work\TQ\Repos\StructAI-App"
git add .
git commit -m "Auto-deploy StructAI-App"
git push

Write-Host "=== Deployment complete ==="
Write-Host "Open: https://paulhotchin.github.io/StructAI-App/"
