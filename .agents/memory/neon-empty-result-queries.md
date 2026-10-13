---
name: Neon empty-result queries
description: A project-specific Neon driver failure mode when Drizzle selects return no rows.
---

In this project, some Drizzle selects that return no rows can fail inside the Neon serverless driver with `Cannot read properties of null (reading 'map')`. Raw data-modifying CTEs can fail similarly when the HTTP driver receives no row set; adding `RETURNING` alone may not fix it. For existence checks, use an aggregate such as `COUNT(*)`. For mutation CTEs, finish with an aggregate `SELECT` over the mutation CTE so the driver always receives one row.

**Why:** Empty-result queries and a deduplication CTE both triggered the driver's null-map failure. A guaranteed aggregate result avoids depending on how the driver handles absent result rows.

**How to apply:** When adding existence checks through Drizzle, prefer an aggregate result over selecting one row and testing whether it exists. When setup SQL mutates rows through CTEs, end with an aggregate `SELECT` over the returned rows. Do not treat this error as proof that a table is missing.