# E:\work\TQ\Repos\paulhotchin-StructAI-App\deploy-structai.ps1
# StructAI-App Deployment Script

$appName     = "StructAI-App"
$id          = "paulhotchin-StructAI-App"
$accountName = "paulhotchin"
$reposName   = "StructAI-App"

# Paths
$srcRoot   = "E:\work\TQ\Kepler\StructAI\StructAI.App"
$reposRoot = "E:\work\TQ\Repos"
$tempRoot  = "E:\work\TQ\TempRepos"

$publish = "$tempRoot\$id\wwwroot"
$deploy  = "$srcRoot\wwwroot.deploy.$id"
$docs    = "$reposRoot\$accountName-$reposName\docs"

Write-Host "=== Building StructAI (Release) ==="
dotnet publish -c Release -p:PublishProfile=$id

Write-Host "=== Cleaning old GitHub Pages deployment ==="
Remove-Item "$docs\*" -Recurse -Force

Write-Host "=== Copying published build ==="
robocopy $publish $docs /MIR

Write-Host "=== Overlaying deploy-specific files ==="
robocopy $deploy $docs /E /IS /IT

Write-Host "=== Cleaning temporary publish folder ==="
Remove-Item "$tempRoot\$id" -Recurse -Force

Write-Host "=== Committing and pushing to GitHub ==="
cd "$reposRoot\$accountName-$reposName"
git add .
git commit -m "Auto-deploy $appName ($id)"
git push

cd "$srcRoot"

Write-Host "=== Deployment complete ==="
Write-Host "Open: https://$accountName.github.io/$reposName"
