#!/bin/bash
# Generate index.list files for GitHub filesystem optimization
# This script creates index.list files in specified directories to avoid GitHub API calls

set -e

echo "🔍 Generating index.list files for GitHub FS optimization"
echo ""

# Function to generate index.list for a directory
generate_index() {
    local dir=$1
    if [ ! -d "$dir" ]; then
        echo "⚠️  Directory not found: $dir"
        return
    fi

    echo "📝 Generating $dir/index.list"

    # List files and directories (excluding index.list itself and hidden files)
    ls -1 "$dir" | grep -v "^index.list$" | grep -v "^\." > "$dir/index.list"

    local count=$(wc -l < "$dir/index.list" | tr -d ' ')
    echo "   ✓ Added $count entries"
}

# Generate for lib/ImageJ/plugins if it exists
if [ -d "lib/ImageJ/plugins" ]; then
    generate_index "lib/ImageJ/plugins"
else
    echo "ℹ️  lib/ImageJ/plugins not found (skipping)"
fi

# Generate for other common directories
for dir in "lib/ImageJ/macros" "lib/ImageJ/samples" "lib/ImageJ/luts"; do
    if [ -d "$dir" ]; then
        generate_index "$dir"
    fi
done

echo ""
echo "✅ Done! Commit these index.list files to your repo:"
echo ""
echo "  git add lib/ImageJ/*/index.list"
echo "  git commit -m 'Add index.list files for faster GitHub FS access'"
echo "  git push"
echo ""
echo "This will eliminate GitHub API calls for directory listings!"
