#!/bin/bash
set -e
npm ci
npm run check
# Apply reviewed database migrations separately; a merge must not change live tables.
