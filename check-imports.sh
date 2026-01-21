#!/bin/bash

# Script to update import paths after restructuring
# This script helps identify files that need import path updates

echo "🔍 Scanning for files with old import paths..."
echo ""

# Find all TypeScript/TSX files
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" | while read file; do
  # Check for old component imports
  if grep -q '@/components/ui' "$file" 2>/dev/null; then
    echo "📝 $file - Contains @/components/ui imports (should be @/shared/components/ui)"
  fi
  
  if grep -q 'from.*components/ui' "$file" 2>/dev/null; then
    echo "📝 $file - Contains relative components/ui imports"
  fi
  
  if grep -q 'from.*pages/' "$file" 2>/dev/null; then
    echo "📝 $file - Contains pages/ imports (should use feature paths)"
  fi
  
  if grep -q 'from.*contexts/' "$file" 2>/dev/null; then
    echo "📝 $file - Contains contexts/ imports"
  fi
done

echo ""
echo "✅ Scan complete!"
echo ""
echo "Next steps:"
echo "1. Review the files listed above"
echo "2. Update import paths to use new structure"
echo "3. Run 'npm run dev' to test"
