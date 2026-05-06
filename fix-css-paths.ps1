# Script para corregir rutas relativas en archivos CSS extraídos

# Procesar CSS en components/styles
$componentCssFiles = Get-ChildItem -Path "src/components/styles" -Filter "*.css" -Recurse

foreach ($file in $componentCssFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Corregir imports relativos
    $content = $content -replace '@import\s+[''"]\.\./', '@import "../'
    $content = $content -replace 'url\(\s*[''"]?\.\./', 'url(../'
    
    # Agregar ../ para subir un nivel desde la carpeta styles
    $content = $content -replace '@import\s+[''"](?!\.\.)', '@import "../'
    
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Corregido: $($file.FullName)"
}

# Procesar CSS en views/styles
$viewsCssFiles = Get-ChildItem -Path "src/views/styles" -Filter "*.css" -Recurse

foreach ($file in $viewsCssFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Corregir imports
    $content = $content -replace '@import\s+[''"]\.\.\/styles/', '@import "../../styles/'
    $content = $content -replace '@import\s+[''"]\.\./', '@import "../../'
    $content = $content -replace 'url\(\s*[''"]?\.\./', 'url(../../'
    
    # Corregir imports sin ../
    $content = $content -replace '@import\s+[''"](?<!\.\.\/)(assets|styles)/', '@import "../../$1/'
    
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Corregido: $($file.FullName)"
}

Write-Host "Rutas relativas corregidas."
