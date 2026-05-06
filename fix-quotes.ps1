# Script para arreglar comillas desemparejadas en CSS

$cssFiles = Get-ChildItem -Path "src" -Filter "*.css" -Recurse

foreach ($file in $cssFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Arreglar comillas desemparejadas
    $content = $content -replace '"([^"]*)"\'', '"$1"'
    $content = $content -replace '\'\'([^\']*)"', '"$1"'
    $content = $content -replace '"([^"]*)\''', '"$1"'
    
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Revisado: $($file.Name)"
}

Write-Host "Comillas arregladas."
