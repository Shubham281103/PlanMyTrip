#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Wait for the database to be ready
echo "Waiting for database..."
until PGPASSWORD=$POSTGRES_PASSWORD pg_isready -h db -p 5432 -U $POSTGRES_USER; do
  sleep 2
done
echo "Database is ready!"

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting application..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 