# Design system — "editorial coastal"

Introduced August 2026, replacing the original Replit styling. The rules below are what keep
the site coherent; the previous version broke every one of them and that is why it read as
amateur. Tokens live in `client/src/index.css`, Tailwind aliases in `tailwind.config.ts`.

## Colour — three surfaces, one accent

| Token | Value | Use |
|---|---|---|
| `bone` | `#FAF8F5` | Default page surface |
| `sand` | `#EFE9E1` | Alternating sections |
| `ink` | `#14202E` | Dark sections, headings, primary buttons |
| `ink-soft` | — | Body text on light surfaces |
| `stone` | — | Muted / secondary text |
| `brass` | `#B08D57` | The single accent: numerals, small marks, hover states |

**Do not introduce a fourth surface or a second accent.** The old site had seven section
backgrounds (emerald-50, cream, sand, white, navy, zinc-100, gray-50) and three accents
(yellow CTA, emerald sections, blue links) — that incoherence was the main visual problem.
Sections should alternate bone → sand → ink, never a new colour.

Red is reserved for genuine errors. The promotional bar is ink with a brass figure, not a
red gradient — a permanent "urgent" banner reads as spam, and it was permanently on.

## Typography

- **Display:** Cormorant Garamond (300/400). Used through `.display-xl`, `.display-lg`,
  `.display-md` and on all `h1`–`h6`. The serif at large sizes *is* the look — never
  substitute the body sans in headings.
- **Body/UI:** Inter (300/400/500), 17px base, 1.7 line-height, `max-width: 60ch` on prose.
- **Eyebrow:** `.eyebrow` — 11px, uppercase, 0.2em letter-spacing, stone. Sits above a
  heading to name the section. Every major section has one.

Both families cover the accented characters all six languages need.

## Layout

- `.section` for vertical rhythm (clamped 4.5–8.5rem), `.shell` (78rem) or `.shell-narrow`
  (52rem) for width.
- **Asymmetric 12-column splits**, not centred columns. The usual pattern is a 5-col
  heading block beside a 7-col content block. Centring everything was a large part of what
  made the old design look generic.
- **Hairlines, not cards.** `.hairline` / `.hairline-dark` separate list rows. Avoid
  `rounded-xl` + `shadow-md` boxes; the radius token is 2px and shadows are not used.
- **Fixed image ratios** (`.ratio-portrait` 4:5, `.ratio-landscape` 3:2, `.ratio-wide` 16:9)
  so grids align instead of stair-stepping. `.img-zoom` inside a `.group` for a slow hover.

## Components

- Buttons: `.btn-primary` (ink fill), `.btn-outline` (hairline), `.btn-on-dark` (bone fill
  on ink), `.link-underline` (text link with a rule that darkens on hover). All uppercase,
  0.12em tracking, square corners.
- Nav is transparent over the hero and switches to bone with a hairline on scroll or on any
  page that is not the homepage. It offsets itself by `--promo-h`, which `PromotionalHeader`
  sets when an offer bar is showing — do not hardcode a top offset again.

## Iconography

Prefer type and hairlines to icons. The old site used emoji (☀️ 💻 🏠) as section icons and
several hand-drawn SVGs (a "water filter", a "dishwasher") that looked improvised. Where a
marker is needed, use a brass `+` / `—` or a two-digit numeral. Lucide icons are fine for
genuine UI affordances (chevrons, close, menu).

## Page weight

The homepage was 21,133px tall. It is now ~14,450px. The gallery shows an edited set with a
"view all" expansion rather than 18 thumbnails at once. If a section grows past a screen and
a half, edit it rather than letting it run.

## Photography notes

Lead images matter more than any styling choice. Two were actively working against the site
and have been swapped:

- The apartment section led with a **bathroom** photograph — now the living room.
- The gallery led with a terrace shot whose view is **a car park** — now the living room.

The terrace photographs all show the street and neighbouring blocks rather than a view, so
they sit later in the sequence. If the owner can supply new photography, the highest-value
additions would be: the terrace shot at golden hour framed away from the car park, the walk
from the door to the sand, and one image with people in it.
