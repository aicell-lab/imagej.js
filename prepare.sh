#!/bin/bash
set -e  # Exit on error

echo "================================================"
echo "Building ImageJ from source with patches"
echo "================================================"

# Configuration
IMAGEJ_COMMIT="49f2c64ab0f5da08b23d5208e15f71ee386c0c82"
IMAGEJ_REPO="https://github.com/imagej/ImageJ.git"
BUILD_DIR="ImageJ-build"
PATCH_DIR="imagej-patch"

# Clean up previous build
rm -rf "$BUILD_DIR"
rm -rf lib/ImageJ

# Clone ImageJ source at specific commit
echo "Cloning ImageJ source code..."
git clone "$IMAGEJ_REPO" "$BUILD_DIR"
cd "$BUILD_DIR"
git checkout "$IMAGEJ_COMMIT"

# Apply patches using Python script (more reliable than patch command)
echo "Applying patches..."
cd ..
python3 apply_patch.py
cd "$BUILD_DIR"

# Build ImageJ
echo "Building ImageJ..."
# ImageJ uses Ant for building
if ! command -v ant &> /dev/null; then
    echo "Error: Apache Ant is required but not installed."
    echo "Please install Ant: https://ant.apache.org/manual/install.html"
    echo "  macOS: brew install ant"
    echo "  Ubuntu: sudo apt-get install ant"
    exit 1
fi

ant build

# Create lib directory structure
cd ..
mkdir -p lib/ImageJ

# Copy built jar
if [ -f "$BUILD_DIR/ij.jar" ]; then
    echo "Copying built ImageJ jar..."
    cp "$BUILD_DIR/ij.jar" lib/ImageJ/
else
    echo "Error: ij.jar not found after build"
    exit 1
fi

# Copy other necessary files
echo "Copying ImageJ resources..."
if [ -d "$BUILD_DIR/plugins" ]; then
    cp -r "$BUILD_DIR/plugins" lib/ImageJ/
fi
if [ -d "$BUILD_DIR/macros" ]; then
    cp -r "$BUILD_DIR/macros" lib/ImageJ/
fi
if [ -d "$BUILD_DIR/luts" ]; then
    cp -r "$BUILD_DIR/luts" lib/ImageJ/
fi
if [ -d "$BUILD_DIR/images" ]; then
    cp -r "$BUILD_DIR/images" lib/ImageJ/
fi

# Download additional plugins from manifest
echo "Downloading additional plugins..."
if [ -f plugins_manifest.txt ]; then
    mkdir -p lib/ImageJ/plugins
    while IFS=: read -r filename url; do
        # Skip empty lines and comments
        [[ -z "$filename" || "$filename" =~ ^#.*$ ]] && continue
        echo "  Downloading $filename from $url"
        curl -L "$url" -o "lib/ImageJ/plugins/$filename"
    done < plugins_manifest.txt
fi

# Create index.list files for subdirectories
echo "Creating index.list files..."
dirs=("lib/ImageJ/plugins" "lib/ImageJ/luts" "lib/ImageJ/macros")

for dir in "${dirs[@]}"; do
    if [[ -d "$dir" ]]; then
        find "$dir" -type d | while read -r child_dir; do
            ls "$child_dir" | grep -v "^index\.list$" > "$child_dir/index.list" 2>/dev/null || true
        done
    fi
done

# Clean up build directory
echo "Cleaning up build directory..."
rm -rf "$BUILD_DIR"

echo "================================================"
echo "Build complete!"
echo "ImageJ jar: lib/ImageJ/ij.jar"
echo "================================================"
