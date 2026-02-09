# PowerShell script to add canvas controls to TwoDDesignStudio.jsx

$filePath = "c:\Users\hp\Desktop\3d web\client\src\pages\TwoDDesignStudio.jsx"
$snippetPath = "c:\Users\hp\Desktop\3d web\2d-studio-controls-snippet.jsx"

# Read the files
$content = Get-Content $filePath -Raw
$snippet = Get-Content $snippetPath -Raw

# Find the insertion point (after line with </div> before Layers section)
$searchPattern = "          </div>`r`n`r`n          <div className=`"border-t border-gray-700 pt-3`">`r`n            <div className=`"flex items-center justify-between mb-2`">`r`n              <h3 className=`"text-xs font-bold text-purple-400`">📚 Layers</h3>"

# Replace with the snippet inserted before Layers
$replacement = "          </div>`r`n`r`n$snippet`r`n`r`n          <div className=`"border-t border-gray-700 pt-3`">`r`n            <div className=`"flex items-center justify-between mb-2`">`r`n              <h3 className=`"text-xs font-bold text-purple-400`">📚 Layers</h3>"

# Perform the replacement
$newContent = $content -replace [regex]::Escape($searchPattern), $replacement

# Write back to file
Set-Content $filePath -Value $newContent -NoNewline

Write-Host "Successfully added canvas controls to TwoDDesignStudio.jsx" -ForegroundColor Green
