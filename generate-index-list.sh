#!/bin/bash
# Generate index.list files for GitHub filesystem optimization
# This script creates index.list files with type information to avoid GitHub API calls
#
# Format:
#   dir:dirname  - for directories
#   filename     - for files

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

    # Clear or create index.list
    > "$dir/index.list"

    local file_count=0
    local dir_count=0

    # List files and directories (excluding index.list itself and hidden files)
    while IFS= read -r entry; do
        if [ -d "$dir/$entry" ]; then
            # It's a directory - add with dir: prefix
            echo "dir:$entry" >> "$dir/index.list"
            ((dir_count++))
        else
            # It's a file - add without prefix
            echo "$entry" >> "$dir/index.list"
            ((file_count++))
        fi
    done < <(ls -1 "$dir" | grep -v "^index.list$" | grep -v "^\.")

    echo "   ✓ Added $file_count file(s) and $dir_count dir(s)"
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
