#!/bin/sh

set -e

python main.py

exec uvicorn src.api.api:app --host 0.0.0.0 --port 8000