# Automatic Version Update Hook

## What It Does
This repository uses a Git pre-commit hook to automatically update the app version number with the current UTC timestamp before each commit.

## How It Works
1. Every time you run `git commit`, the hook executes first
2. It gets the current UTC timestamp (format: `YYYY.MM.DD-HH:MM UTC`)
3. It updates the `APP_VERSION` constant in `SpeedRead/main.js`
4. It stages the updated file as part of your commit
5. Your commit proceeds with the auto-updated version

## Version Format
Example: `2026.02.08-16:15 UTC`
- Year.Month.Day-Hour:Minute in UTC timezone
- This ensures users can see exactly when the app was last deployed

## Hook Location
`.git/hooks/pre-commit` (local file, not tracked in repository)

## Setting Up on a New Machine
If you clone this repository on a new machine, you'll need to recreate the hook:

1. Copy the hook content from this README (below)
2. Create file: `.git/hooks/pre-commit`
3. Make it executable (Git Bash): `chmod +x .git/hooks/pre-commit`
4. On Windows, Git should recognize it automatically

## Hook Script
```bash
#!/bin/bash
# Auto-update APP_VERSION with UTC timestamp before each commit

# Get current UTC timestamp
TIMESTAMP=$(date -u '+%Y.%m.%d-%H:%M UTC')

# Update the version in main.js (use different sed syntax for cross-platform compatibility)
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # macOS/Linux
    sed -i.bak "s/const APP_VERSION = \".*\";/const APP_VERSION = \"$TIMESTAMP\";/" main.js
    rm -f main.js.bak
else
    # Windows (Git Bash)
    sed -i "s/const APP_VERSION = \".*\";/const APP_VERSION = \"$TIMESTAMP\";/" main.js
fi

# Stage the updated file
git add main.js

echo "✓ Updated APP_VERSION to: $TIMESTAMP"

exit 0
```

## Testing
After setting up the hook, make any small change and commit:
```bash
git add .
git commit -m "Test version hook"
```

You should see: `✓ Updated APP_VERSION to: 2026.02.08-16:15 UTC`

## Disabling the Hook
To temporarily disable: rename `.git/hooks/pre-commit` to `.git/hooks/pre-commit.disabled`
To re-enable: rename it back to `.git/hooks/pre-commit`