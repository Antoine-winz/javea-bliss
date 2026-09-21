---
name: PDF stamping compatibility
description: How to keep personalized brochures compatible with strict PDF readers.
---

Build each stamped brochure as a new PDF by copying source pages, and save with traditional cross-reference tables.

**Why:** Modifying these source brochures in place preserves unusual object generations. The result may be reconstructable by tolerant parsers but rejected by macOS Preview.

**How to apply:** For any personalized brochure changes, retain the new-document page-copy approach and disable object streams when saving.