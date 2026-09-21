---
name: Resend isolation
description: Why Jávea Bliss uses its own project secret instead of the shared account connector.
---

Use a project-specific Resend API key for Jávea Bliss rather than changing the account-level Resend connector.

**Why:** The account connector is shared by several unrelated apps with a different sender domain. Updating it could disrupt their email delivery.

**How to apply:** Keep Jávea Bliss email credentials isolated in the project secret and send from the verified `javeabliss.com` domain.