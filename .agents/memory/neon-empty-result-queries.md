---
name: Neon empty-result queries
description: A project-specific Neon driver failure mode when Drizzle selects return no rows.
---

In this project, some Drizzle selects that return no rows can fail inside the Neon serverless driver with `Cannot read properties of null (reading 'map')`. Retrying does not reliably resolve it. For existence checks, use an aggregate such as `COUNT(*)`, which always returns one row.

**Why:** A blocked-IP existence query consistently failed when the table was empty even though the table existed and direct SQL succeeded.

**How to apply:** When adding existence checks through Drizzle, prefer an aggregate result over selecting one row and testing whether it exists. Do not treat this error as proof that a table is missing.