#!/bin/bash
# Linux/Mac version: Reset all registration credentials

echo "🗑️  DELETING ALL REGISTRATION CREDENTIALS..."
echo "⚠️  WARNING: This will delete ALL user data, registrations, and credentials!"
echo ""

read -p "Are you sure? Type 'YES' or 'yes' to continue: " confirm
confirm=$(echo "$confirm" | tr '[:lower:]' '[:upper:]')
if [ "$confirm" != "YES" ]; then
    echo "Operation cancelled"
    exit 1
fi

echo ""
echo "1. Stopping Docker containers..."
docker compose down -v

echo ""
echo "2. Deleting database file..."
DB_PATH="./backend/unified_portal.db"
if [ -f "$DB_PATH" ]; then
    rm -f "$DB_PATH"
    echo "Database deleted: $DB_PATH"
else
    echo "Database file not found (already clean)"
fi

echo ""
echo "3. Cleaning uploads folder..."
UPLOADS_PATH="./backend/uploads"
if [ -d "$UPLOADS_PATH" ]; then
    rm -rf "${UPLOADS_PATH}"/*
    echo "Uploads folder cleared"
else
    echo "Uploads folder doesn't exist"
fi

echo ""
echo "4. Clearing Python cache..."
find ./backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null
echo "Python cache cleared"

echo ""
echo "5. Rebuilding containers from scratch..."
docker compose build --no-cache

echo ""
echo "6. Starting fresh services..."
docker compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 10

echo ""
echo "7. Checking service status..."
docker compose ps

echo ""
echo "DONE! System is ready for fresh registration"
echo ""
echo "Access points:"
echo "   Frontend:  http://localhost:3003"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "Next steps:"
echo "   1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)"
echo "   2. Open http://localhost:3003 in a fresh browser"
echo "   3. Register a new account"
echo ""
