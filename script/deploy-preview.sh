#!/bin/sh
set -eu

VERCEL_ORG_ID="${VERCEL_ORG_ID:-team_EraIqVeEgGlzUxPjOWwYEayp}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_JCkwLMB46pJEAAC9i1dfXSaEyUOk}"

export VERCEL_ORG_ID
export VERCEL_PROJECT_ID

exec npx vercel deploy --yes --scope antunes145s-projects "$@"
