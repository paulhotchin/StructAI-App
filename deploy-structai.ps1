# E:\work\TQ\Repos\StructAI-App\deploy-structai.ps1
# StructAI-App Deployment Script
# Author: Paul Hotchin

# Paths
$publish = "E:\work\TQ\Kepler\StructAI\StructAI.App\bin\Release\net8.0\publish\wwwroot"
$deploy  = "E:\work\TQ\Kepler\StructAI\StructAI.App\wwwroot.deploy"
$docs    = "E:\work\TQ\Repos\StructAI-App\docs"

Write-Host "=== Building StructAI (Release) ==="
dotnet publish "E:\work\TQ\Kepler\StructAI\StructAI.App" -c Release

Write-Host "=== Cleaning old GitHub Pages deployment ==="
Remove-Item "$docs\*" -Recurse -Force

Write-Host "=== Copying published build ==="
robocopy $publish $docs /MIR

Write-Host "=== Committing and pushing to GitHub ==="
cd "E:\work\TQ\Repos\StructAI-App"
git add .
git commit -m "Auto-deploy StructAI-App"
git push

Write-Host "=== Deployment complete ==="
Write-Host "Open: https://paulhotchin.github.io/StructAI-App/"
