#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
inkscape assets/favicon.svg --export-type=png --export-width=180 --export-height=180 --export-filename=assets/apple-touch-icon.png
inkscape assets/og-image.svg --export-type=png --export-filename=assets/og-image.png
