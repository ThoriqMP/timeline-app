#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
INDEX_FILE="$DIR/index.html"

# Coba buka di Google Chrome mode App (jendela mandiri tanpa browser chrome) jika tersedia
if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "/Applications/Google Chrome.app" --args --app="file://$INDEX_FILE"
elif [ -d "/Applications/Brave Browser.app" ]; then
  open -na "/Applications/Brave Browser.app" --args --app="file://$INDEX_FILE"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  open -na "/Applications/Microsoft Edge.app" --args --app="file://$INDEX_FILE"
else
  # Fallback: Buka langsung di browser default sistem macOS
  open "$INDEX_FILE"
fi
