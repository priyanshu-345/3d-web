#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# File paths
file_path = r'c:\Users\hp\Desktop\3d web\client\src\pages\TwoDDesignStudio.jsx'
snippet_path = r'c:\Users\hp\Desktop\3d web\2d-studio-controls-snippet.jsx'

# Read files
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

with open(snippet_path, 'r', encoding='utf-8') as f:
    snippet = f.read()

# Find the pattern to replace (before the Layers section)
# We'll look for the closing div of grid settings and insert before Layers
pattern = r'(          </div>\r?\n\r?\n)(          <div className="border-t border-gray-700 pt-3">\r?\n            <div className="flex items-center justify-between mb-2">\r?\n              <h3 className="text-xs font-bold text-purple-400">📚 Layers</h3>)'

# Create replacement with snippet inserted
replacement = r'\1' + snippet + '\r\n\r\n' + r'\2'

# Perform replacement
new_content = re.sub(pattern, replacement, content)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully added canvas size controls and cursor selector to TwoDDesignStudio.jsx!")
