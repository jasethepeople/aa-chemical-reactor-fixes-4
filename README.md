# AA Chemical Reactor — Bug Fix + Backend Services Patch Set

Apply on top of the original code. Round 1 fixed dangling references and
build errors; round 2 (this update) fills in the two services that were
named in the folder tree but never written, plus wires them into the
middleware that was already calling them.

## Round 1 — bug fixes
| File | What it fixes |
|---|---|
| `src/data/compounds-additions.ts` | Adds `sulfur`, `iron`, `calcium-chloride`, `sodium-nitrate`, `silver-chloride`, `ethyl-acetate` — compounds reactions.ts referenced but compounds.ts never defined. Append to `COMPOUNDS`. |
| `src/data/reactions-patch.ts` | Corrected reaction rules pointing at those compounds; fixed catalyst IDs for Haber-Bosch/esterification that could never be satisfied. Replace the matching entries in `REACTION_RULES`. |
| `src/hooks/useAuth.tsx` | Renamed `.ts` → `.tsx` (returns JSX), added missing `React` import. |
| `src/components/ReactorLab/ReactorLab-patch-notes.md` | `useEffect` to clamp temperature/pressure on reactor-type switch. |

## Round 2 — backend services (this update)
| File | What it does |
|---|---|
| `server/src/db/pool.ts` | Shared `pg` Pool, reads `DATABASE_URL`. Nothing like this existed before — both services need it. |
| `server/src/services/LicenseService.ts` | `getLicenseForUser(userId)` — joins `users`→`organizations`, maps `license_tier` to feature flags (mirrors the client's `useLicense.ts` tier table so both sides agree). Expired org license silently downgrades to `free` rather than throwing. |
| `server/src/services/AuditService.ts` | `log()` inserts into `audit_logs`; `getRecentForOrg()` and `getUsersWithExcessiveBlocks()` are the read side a teacher/admin dashboard would call — the "flags unusual patterns" claim in your SaaS pitch had nothing behind it before this. |
| `server/src/middleware/auth.ts` (v2) | Now calls `LicenseService.getLicenseForUser()` fresh on every request instead of trusting a license baked into the JWT — so an org upgrade/downgrade/expiry takes effect immediately instead of waiting for tokens to expire. |
| `server/src/middleware/audit.ts` | Now persists through `AuditService.log()` instead of only `console.log`. Hooks `res.on('finish')` rather than reading `res.statusCode` immediately, since this middleware runs *before* the route handler and the status code isn't set yet at that point — reading it early would've always logged 200. |
| `server/src/middleware/license.ts` | Uses `LicenseService.hasFeature()` instead of indexing `license.features[x]` directly, so feature-check logic lives in one place. |
| `server/src/types/express.d.ts` | Updated to import `UserLicense` from the server-local `LicenseService` instead of reaching into the web app's types — server package shouldn't need to compile against the frontend package. |

## Setup

```bash
npm install pg jsonwebtoken
npm install -D @types/pg @types/jsonwebtoken
```

Environment variables required: `DATABASE_URL`, `JWT_SECRET`.

Run `models/schema.sql` (from the original doc) against your Postgres
instance first — both services query tables it creates.

## Still not done (deliberately — needs a decision from you)

- No signup/org-provisioning flow — `LicenseService` assumes an org and
  its `license_tier` already exist in the DB. Someone has to create orgs
  and assign users to them (Stripe webhook? Admin panel? CSV import for
  schools?) — that's a product decision, not a bug fix.
- `getUsersWithExcessiveBlocks` is a placeholder heuristic (5+ blocked
  reactions/hour). Fine to ship, but you'll want to tune the threshold
  once you have real usage data.
