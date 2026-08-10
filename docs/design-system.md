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

Never emoji, and never hand-drawn SVG — the old site used ☀️ 💻 🏠 as section icons and
improvised paths for a "water filter" and a "dishwasher", which is most of why it looked
homemade. Use **lucide-react** only, and verify a name exists in the installed version
before importing it: several plausible names do not exist and a wrong import breaks the
build (`node -e "console.log(Object.keys(require('lucide-react')).includes('Sofa'))"`).

Icons are set at two weights, and the difference carries meaning:

| Context | Colour | Size | Stroke |
|---|---|---|---|
| Apartment groups, location practicals | `text-brass` | 20px | 1.5 |
| Amenity checklist | `text-stone` | 18px | 1.5 |

The brass set marks the narrative sections; the stone set recedes so the checklist stays
subordinate to them. Icons sit in a fixed-width grid column so the text edge aligns
regardless of glyph width, and always carry `aria-hidden="true"` — they repeat the label
beside them, so announcing them twice is noise.

Keep the page to roughly a dozen distinct icons. Elsewhere a brass `+` / `—` or a
two-digit numeral does the job with less furniture.

## Motion

One easing (`--ease-out-soft`), used everywhere. Two scroll patterns: `data-reveal`
(fade-and-rise, once) and `data-reveal-stagger` (the same for children, cascading ~70ms
per row, capped at the 9th child). `MotionProvider` drives both with an
IntersectionObserver; a MutationObserver catches nodes that mount late.

Rules that keep it tasteful and safe:

- Elements are hidden **only when `html.js-reveal` is present**, which MotionProvider sets
  only when JS runs and `prefers-reduced-motion` is off. Content can never be lost to a
  script failure, and reduced-motion visitors get a fully static page.
- Everything animates **once**. Nothing loops, pulses, or bounces; the only continuous
  movements are the hero's 12-second settle and the image band's ±5% scroll parallax.
- New sections: put `data-reveal` on the header block and `data-reveal-stagger` on the
  list/grid. Do not nest one inside the other — the child transform wins and they fight.
- Hover: `.img-zoom` for photographs, `.nav-link` underline for nav, colour shifts for
  buttons. Nothing else.

## Page weight

The homepage was 21,133px tall. It is now ~14,450px. The gallery shows an edited set with a
"view all" expansion rather than 18 thumbnails at once. If a section grows past a screen and
a half, edit it rather than letting it run.

## Where each fact lives

Three sections sit close together and used to repeat each other. They now have distinct
jobs, and content should be added to the right one:

| Section | Job |
|---|---|
| **At a Glance** | Eight scannable specs. The layer someone reads in five seconds. |
| **The Apartment** | The tour: seven labelled groups, in the order you walk through the place, sleeping first. Apartment facts only. |
| **Amenities** | The complete checklist to tick against your own requirements. Flat and exhaustive by design, ordered differentiators-first (parking, 600 Mbps, climate) rather than by category, and ending with an explicit "Not included" cluster. |
| **The Location** | Everything outside the front door: highlights, practical distances, restaurant walking times. |

Facts that describe the neighbourhood do not belong in the apartment section — the marina,
the shops and the restaurant walking times were all moved out for this reason.

Eleven translation keys were retired in that move (`location.title`, `location.description`,
`location.beach*`, `location.restaurants*`, `interior.title`, `apartment.restaurantProximity*`,
`apartment.viewAllRestaurants`, `building.shopping`). Their information all still appears —
via `paradise.*`, `location.shopsDesc` and the per-group labels. Check for orphans after any
restructure; several keys are referenced indirectly through arrays, so grep the whole of
`client/src` for the quoted key rather than only for `t('key')`.

## Photography notes

Lead images matter more than any styling choice. Two were actively working against the site
and have been swapped:

- The apartment section led with a **bathroom** photograph — now the living room.
- The gallery led with a terrace shot whose view is **a car park** — now the living room.

The terrace photographs all show the street and neighbouring blocks rather than a view, so
they sit later in the sequence. If the owner can supply new photography, the highest-value
additions would be: the terrace shot at golden hour framed away from the car park, the walk
from the door to the sand, and one image with people in it.
