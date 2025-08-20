#!/bin/bash

echo "==================================="
echo "Translation Progress Monitor"
echo "==================================="

# Total languages
TOTAL=46

while true; do
    # Count completed PDFs
    COMPLETED=$(ls -1 /Users/victork/ahhhhhhhh/il-docs/translation/translations/*.pdf 2>/dev/null | wc -l | tr -d ' ')
    
    # Calculate percentage
    PERCENT=$((COMPLETED * 100 / TOTAL))
    
    # Get last processed language
    LAST=$(ls -t /Users/victork/ahhhhhhhh/il-docs/translation/translations/*.pdf 2>/dev/null | head -1 | sed 's/.*kroll_complaint_//' | sed 's/.pdf//')
    
    # Clear line and print progress
    echo -ne "\rProgress: [$COMPLETED/$TOTAL] ${PERCENT}% - Last: $LAST    "
    
    # Check if complete
    if [ "$COMPLETED" -ge "$TOTAL" ]; then
        echo -e "\n\n✅ All translations complete!"
        break
    fi
    
    # Check if process is still running
    if ! pgrep -f "node translate-final.js" > /dev/null; then
        echo -e "\n\n⚠️ Translation process stopped at $COMPLETED/$TOTAL"
        echo "Run 'node translate-final.js' to continue"
        break
    fi
    
    sleep 5
done

echo ""
echo "==================================="
echo "Final count: $(ls -1 /Users/victork/ahhhhhhhh/il-docs/translation/translations/*.pdf 2>/dev/null | wc -l | tr -d ' ') PDFs generated"
echo "====================================="