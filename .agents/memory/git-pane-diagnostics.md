---
name: Git pane diagnostics
description: Avoid destructive repository repair when Replit's Git pane reports UNKNOWN_NOT_GIT.
---

Do not reinitialize or replace the repository based solely on the Git pane's UNKNOWN_NOT_GIT message.

**Why:** The pane reported this error while the Git CLI still recognized a valid repository, branch and HEAD. Unresolved index entries from restoring saved local changes were present at the same time; this does not establish the cause of the pane error.

**How to apply:** Verify repository validity and unresolved index entries with read-only CLI checks first. Preserve local changes before any repair, and distinguish fixing repository conflicts from verifying that the Replit pane itself has recovered.
