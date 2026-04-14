# Iteration Workflow

This repository now has two separate Vercel targets:

- Production project: `asset-tracker-pro`
- Staging project: `asset-tracker-pro-staging`

Use the staging project for all feature work. Keep the production-linked checkout clean.

## Local layout

Use separate Git worktrees instead of reusing one folder for every branch:

- Production checkout: `/Users/wagner/Documents/New project/Asset-Tracker-Pro`
- Staging checkout: `/Users/wagner/Documents/New project/Asset-Tracker-Pro-staging`

Create feature worktrees from the staging branch:

```sh
git worktree add ../Asset-Tracker-Pro-feature-invoices -b feature/invoices-ui staging
```

That gives each feature its own folder and branch.

## Branch flow

- `main`: production only
- `staging`: integration branch for approved feature work
- `feature/*`: short-lived branches for experiments

Recommended flow:

1. Create a feature branch from `staging`.
2. Build and test in a separate worktree.
3. Deploy a preview with `npm run deploy:preview`.
4. Merge into `staging` once the feature is acceptable.
5. Deploy `staging` with `npm run deploy:staging`.
6. Merge `staging` into `main` only when ready for production.

## Staging environment

The staging Vercel project expects the variables in `.env.staging.example`.

Current blocker: the connected Supabase account is at the free-project limit, so a dedicated staging project could not be created. A database branch named `staging` was created under the production Supabase project, but the Composio tools do not expose the branch-specific API URL, anon key, service role key, or direct database connection string.

To finish staging database isolation, copy the branch credentials from the Supabase dashboard:

1. Open project `asset-tracker-pro-prod`.
2. Switch to branch `staging`.
3. Copy the branch-specific:
   - API URL
   - service role key
   - database connection string
4. Add those values to the Vercel project `asset-tracker-pro-staging`.

Until those branch-specific credentials are added, do not point staging deployments at production secrets.

## Deploy commands

Preview deployment on the staging Vercel project:

```sh
npm run deploy:preview
```

Promote the current branch to the staging project's main URL:

```sh
npm run deploy:staging
```

Both commands target Vercel project `asset-tracker-pro-staging`.
