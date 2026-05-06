# Script para extraer estilos de archivos Vue a CSS externos
# Este script procesa todos los archivos .vue en src/components

$vueFiles = Get-ChildItem -Path "src/components" -Filter "*.vue" -Recurse

foreach ($file in $vueFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Buscar bloques <style> (puede ser <style scoped>, <style lang="scss">, etc.)
    if ($content -match '<style[^>]*>([\s\S]*?)</style>') {
        $styleContent = $matches[1]
        $componentName = $file.BaseName
        $stylesDir = Join-Path $file.DirectoryName "styles"
        
        # Crear carpeta styles si no existe
        if (-not (Test-Path $stylesDir)) {
            New-Item -ItemType Directory -Path $stylesDir | Out-Null
            Write-Host "Creada carpeta: $stylesDir"
        }
        
        # Guardar el CSS en archivo
        $cssFile = Join-Path $stylesDir "$componentName.css"
        Set-Content -Path $cssFile -Value $styleContent
        Write-Host "Extraído: $cssFile"
        
        # Reemplazar el bloque <style> con import en el archivo .vue
        $newContent = $content -replace '<style[^>]*>[\s\S]*?</style>', ''
        
        # Agregar import en el script
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

Write-Host "`nProceso completado."
