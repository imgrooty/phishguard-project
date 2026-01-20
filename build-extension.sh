#!/bin/bash
# Build script for PhishGuard Extension
# Generates both development and production versions
# 
# Supported platforms: Linux, macOS, Windows (Git Bash/WSL)

set -e

echo "Building PhishGuard Extension..."

# Get absolute paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/extension-builds"
PUBLIC_DIR="$SCRIPT_DIR/public"

# Create directories
mkdir -p "$BUILD_DIR"
mkdir -p "$PUBLIC_DIR"

# Function to build extension for specific environment
build_extension() {
  local env=$1
  local output_file="$BUILD_DIR/phishguard-extension-$env.zip"
  
  echo "Building $env version..."
  
  # Create temporary directory
  TEMP_DIR=$(mktemp -d)
  
  # Copy extension files
  cp -r "$SCRIPT_DIR/extension/"* "$TEMP_DIR/"
  
  # Update config.js for the target environment
  # Cross-platform sed handling
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires -i '' for in-place editing
    sed -i '' "s/const CURRENT_ENV = '.*';/const CURRENT_ENV = '$env';/" "$TEMP_DIR/config.js"
  else
    # Linux, Git Bash, WSL
    sed -i "s/const CURRENT_ENV = '.*';/const CURRENT_ENV = '$env';/" "$TEMP_DIR/config.js"
  fi
  
  # Create zip file
  (cd "$TEMP_DIR" && zip -r "$output_file" . -x '*.git*' -x 'README.md')
  
  # Copy to public directory for download
  cp "$output_file" "$PUBLIC_DIR/phishguard-extension-$env.zip"
  
  # Cleanup
  rm -rf "$TEMP_DIR"
  
  echo "✓ $env version built: $output_file"
}

# Build both versions
build_extension "development"
build_extension "production"

# Also create a default version (development) for backward compatibility
cp "$BUILD_DIR/phishguard-extension-development.zip" "$PUBLIC_DIR/phishguard-extension.zip"

echo ""
echo "Build complete!"
echo "Development version: $BUILD_DIR/phishguard-extension-development.zip"
echo "Production version: $BUILD_DIR/phishguard-extension-production.zip"
echo "Both versions are also copied to public/ directory for web download"
