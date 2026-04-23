#!/bin/bash
# Compile threadhack Java classes and re-package parallel-tool.jar
# (including ASM classes for bytecode rewriting). Requires ij.jar to be
# available at $IJ_JAR (defaults to ../../lib/ImageJ/ij.jar).
set -e

cd "$(dirname "$0")"
ROOT="$(pwd)"
SRC="$ROOT/src"
LIBS="$ROOT/libs"
OUT="$ROOT/build/main"
IJ_JAR="${IJ_JAR:-$ROOT/../../lib/ImageJ/ij.jar}"

if [ ! -f "$IJ_JAR" ]; then
    echo "build.sh: ij.jar not found at $IJ_JAR"
    echo "  set IJ_JAR or build ImageJ via prepare.sh first."
    exit 1
fi

echo "[threadhack/java] cleaning $OUT"
rm -rf "$OUT"
mkdir -p "$OUT"

# Build classpath: ASM jars + ij.jar
CP="$IJ_JAR"
for j in "$LIBS"/*.jar; do CP="$CP:$j"; done

echo "[threadhack/java] compiling sources (cp=$CP)"
SOURCES=$(find "$SRC" -name "*.java")
javac -source 1.8 -target 1.8 -d "$OUT" -cp "$CP" $SOURCES

# Extract ASM classes into the same output tree (so the final jar is self-contained)
echo "[threadhack/java] expanding ASM jars into $OUT"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
for j in "$LIBS"/asm*.jar; do
    (cd "$TMP" && unzip -oq "$j")
done
# Copy ASM .class files (drop META-INF)
mkdir -p "$OUT/org"
cp -r "$TMP"/org/* "$OUT/org/" 2>/dev/null || true

# Package the jar. The runtime loader fetches it from /threadhack/runtime/
# (base URL of loader.js), so write it THERE as the primary output — the
# old output path threadhack/parallel-tool.jar was one directory above
# what the loader actually reads, so Java code edits silently didn't
# redeploy and the 4-day-old committed jar kept being served.
JAR_PATH="$ROOT/../runtime/parallel-tool.jar"
echo "[threadhack/java] packaging $JAR_PATH"
(cd "$OUT" && jar cf "$JAR_PATH" .)
# Keep a copy at the old location too, so anything that relied on it
# (test harnesses, local dev links) still finds it.
cp "$JAR_PATH" "$ROOT/../parallel-tool.jar"
echo "[threadhack/java] done — $(du -h "$JAR_PATH" | cut -f1) parallel-tool.jar"
