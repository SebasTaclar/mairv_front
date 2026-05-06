# Script para extraer estilos de archivos Vue en views

$vueFiles = Get-ChildItem -Path "src/views" -Filter "*.vue" -Recurse

foreach ($file in $vueFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Buscar bloques <style>
    if ($content -match '<style[^>]*>([\s\S]*?)</style>') {
        $styleContent = $matches[1]
        $componentName = $file.BaseName
        $stylesDir = Join-Path $file.DirectoryName "styles"
        
        # Crear carpeta styles
        if (-not (Test-Path $stylesDir)) {
            New-Item -ItemType Directory -Path $stylesDir | Out-Null
            Write-Host "Creada carpeta: $stylesDir"
        }
        
        # Guardar CSS
        $cssFile = Join-Path $stylesDir "$componentName.css"
        Set-Content -Path $cssFile -Value $styleContent
        Write-Host "Extraído: $cssFile"
        
        # Remover <style> del archivo .vue
        $newContent = $content -replace '<style[^>]*>[\s\S]*?</style>', ''
        
        # Agregar import
        $scriptMatch = $newContent -match '(<script[^>]*>)'
        if ($scriptMatch) {
            $scriptTag = $matches[1]
            $importStatement = "`nimport './styles/$componentName.css'"
            $newContent = $newContent -replace $scriptTag, "$scriptTag$importStatement"
        }
        
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Actualizado: $($file.FullName)"
    }
}

Write-Host "`nProceso completado para views."
