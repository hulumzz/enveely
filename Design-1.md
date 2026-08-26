# ULWED — UI/UX & Design System

**Document status:** Master UI/UX + Template Design Specification  
**Product:** ULWED  
**Version:** 1.0  
**Date:** 2026-08-24  
**Primary languages:** ID / EN  

---

# 1. Design Direction

## 1.1 Brand Character

ULWED harus terasa:

- Romantic.
- Luxury.
- Modern.
- Calm.
- Refined.
- Premium tanpa terasa terlalu formal.
- Beautiful tetapi tetap mudah dipakai.

ULWED **bukan** platform wedding yang ramai dengan ornament pada semua tempat. Luxury harus muncul dari **spacing, typography, composition, material feeling, dan detail kecil**, bukan dari menambahkan ornamen sebanyak-banyaknya.

## 1.2 Visual Principle

> **Quiet luxury + romantic emotion + modern usability.**

Desain aplikasi harus bersih; desain invitation boleh jauh lebih dekoratif.

---

# 2. Two-Layer Design System

ULWED terdiri dari dua visual layer:

## Product UI

Digunakan untuk:

- Landing.
- Template gallery.
- Dashboard.
- Builder.
- Settings.
- Preview controls.

Karakter:

- Modern.
- Minimal.
- Light.
- High readability.
- Soft premium.

## Invitation Design

Digunakan untuk:

- Public invitation.
- Cover.
- Story.
- Gallery.
- Event.
- RSVP.
- Gift.
- Closing.

Karakter dapat sangat variatif dan dekoratif sesuai template.

---

# 3. Brand System

## 3.1 Logo Direction

Wordmark:

**ULWED**

Suggested treatment:

- uppercase;
- letter spacing sedikit longgar;
- serif display atau refined sans pairing;
- simbol dapat dikembangkan dari `U` + `W` monogram.

## 3.2 Tagline

Primary:

> **Your Story, Beautifully Invited.**

Secondary ID:

> **Cerita Cinta Kalian, Dalam Undangan yang Berkesan.**

---

# 4. Product UI Color System

Product UI sengaja tidak bergantung pada warna template invitation.

### Base

```text
Canvas       #F8F7F5
Surface      #FFFFFF
Surface Soft #F1EFEB
Border       #E6E1DA
Text         #272321
Text Soft    #746D67
Muted        #A39A92
```

### Accent

```text
Accent       #8B6F5A
Accent Soft  #EDE2D8
```

### Semantic

```text
Success      #427A63
Warning      #A97435
Error        #B95750
Info         #5A7188
```

Catatan: warna invitation tidak boleh dipaksa mengikuti palette ini.

---

# 5. Typography for Product UI

Recommended pairing:

**Display:** DM Serif Display / Cormorant Garamond  
**UI Sans:** Inter / Manrope  

Hierarchy:

```text
Display XL  64–80
Display L   48–64
Heading 1   36–48
Heading 2   28–36
Heading 3   22–28
Body L      18
Body        16
Body S      14
Caption     12
```

Editor UI sebaiknya menggunakan sans untuk clarity.

---

# 6. Spacing System

Base unit: 4px.

```text
4
8
12
16
20
24
32
40
48
64
80
96
128
```

Landing page dapat memakai whitespace besar untuk premium feeling.

---

# 7. Radius System

```text
XS  6px
SM  10px
MD  14px
LG  20px
XL  28px
PILL 999px
```

Invitation template bebas menggunakan radius sendiri.

---

# 8. Shadow System

Product UI memakai shadow lembut:

```text
Soft
0 8px 30px rgba(..., 0.06)

Floating
0 15px 50px rgba(..., 0.10)
```

Avoid heavy black shadows.

---

# 9. Product Navigation

Desktop header:

```text
┌────────────────────────────────────────────────────┐
│ ULWED       Templates   Features   How It Works    │
│                              ID | EN   [Create]    │
└────────────────────────────────────────────────────┘
```

Mobile:

```text
ULWED                     ☰
```

---

# 10. Landing Page UX

## 10.1 Hero

Goal:

Dalam 5 detik user harus mengerti bahwa ULWED membuat undangan yang desainnya benar-benar beragam.

Structure:

```text
Eyebrow
DIGITAL WEDDING INVITATION

Headline
Your Story,
Beautifully Invited.

Subheadline
Create a wedding invitation with a design
that feels truly yours.

[ Create Invitation ] [ Explore Templates ]

                ┌───────────────┐
                │ Invitation    │
                │ preview       │
                │ animation     │
                └───────────────┘
```

Hero visual harus memperlihatkan **pergantian beberapa template**, bukan satu static mockup saja.

---

# 11. Landing Section — Design Differentiation

Judul:

> **Not Just a Color Change.**

Subjudul:

> Every ULWED template has its own layout, ornament, typography, imagery and personality.

Visual:

```text
Same Couple

┌────────────┐   ┌────────────┐   ┌────────────┐
│ Elegant    │   │ Editorial  │   │ Botanical  │
│ Floral     │   │ Modern     │   │ Romantic   │
└────────────┘   └────────────┘   └────────────┘
```

Klik card membuka comparison/preview.

---

# 12. Template Gallery UX

Filter:

```text
All
Romantic
Luxury
Modern
Floral
Minimal
Traditional
Editorial
```

Sort:

```text
Featured
Newest
Most Popular
Photo Rich
Minimal Photo
```

Card content:

- preview;
- name;
- family;
- mood tags;
- image density tag;
- template variation indicator;
- Preview;
- Use This Design.

Example card:

```text
┌────────────────────────┐
│                        │
│      TEMPLATE          │
│       PREVIEW          │
│                        │
├────────────────────────┤
│ AMORA                  │
│ Romantic · Floral      │
│ Medium Photo           │
│                        │
│ [Preview] [Use Design] │
└────────────────────────┘
```

---

# 13. Template Preview UX

Full page preview:

```text
← Back

AMORA
Romantic Floral

[ Mobile ] [ Desktop ]

┌─────────────────────────────┐
│                             │
│       FULL INVITATION        │
│                             │
└─────────────────────────────┘

Design DNA
• Floral ornaments
• Serif + sans typography
• Medium photo density
• Organic frame

[ Use This Design ]
```

Preview harus memungkinkan scroll semua section.

---

# 14. Invitation Creation Flow

## Step 1 — Select Design

Template + variation.

## Step 2 — Couple Basics

- Nama mempelai pria.
- Nama mempelai wanita.
- Foto.

## Step 3 — Events

- Akad.
- Resepsi.
- Additional event.

## Step 4 — Content

Optional progressive setup; user dapat skip.

## Step 5 — Builder

Advanced editing.

---

# 15. Builder UI

Main layout:

```text
┌────────────────────────────────────────────────────────────────┐
│ ULWED   My Invitation     Saved ✓   Preview   Publish          │
├────────────┬───────────────────────────────────┬───────────────┤
│ Sections   │                                   │ Properties    │
│            │                                   │               │
│ Cover      │                                   │ Selected:     │
│ Couple     │         INVITATION CANVAS         │ Cover         │
│ Event      │                                   │               │
│ Story      │                                   │ Typography    │
│ Gallery    │                                   │ Image         │
│ RSVP       │                                   │ Ornament      │
│ Gift       │                                   │ Layout        │
│ Closing    │                                   │               │
└────────────┴───────────────────────────────────┴───────────────┘
```

---

# 16. Builder Top Bar

Left:

- ULWED logo.
- Invitation title.
- save status.

Center:

- Undo.
- Redo.
- Device preview.

Right:

- Preview.
- Share.
- Publish.

Save status:

```text
Saving...
Saved 10:32
Offline — saved locally
```

---

# 17. Section Navigator

Section item:

```text
☷  Cover       👁
☷  Couple      👁
☷  Events      👁
☷  Story       👁
☷  Gallery     👁
☷  RSVP        👁
☷  Gift        👁
```

Interactions:

- drag to reorder;
- click to select;
- eye to hide;
- more menu.

More menu:

```text
Duplicate
Move up
Move down
Hide section
Reset section
```

---

# 18. Photo Replacement UX

The core interaction:

```text
[Photo slot]
      ↓
click
      ↓
┌─────────────────────────┐
│ Replace photo            │
│                         │
│ [ Upload ] [ Gallery ]   │
│                         │
│ Recent images            │
│ ○ ○ ○ ○ ○              │
└─────────────────────────┘
```

After selecting:

```text
Crop / Position

┌──────────────┐
│              │
│     PHOTO    │
│              │
└──────────────┘

[Cancel] [Apply]
```

No manual dimension input.

---

# 19. Gallery Manager

Gallery tab:

```text
Gallery

[ + Add Photos ]

┌────┐ ┌────┐ ┌────┐ ┌────┐
│    │ │    │ │    │ │    │
│ 01 │ │ 02 │ │ 03 │ │ 04 │
└────┘ └────┘ └────┘ └────┘

Drag to reorder.

Layout:
○ Grid
○ Masonry
○ Filmstrip
○ Editorial
```

Template may restrict options to the layouts it supports.

---

# 20. Multiple Events UX

Event manager:

```text
Events

┌──────────────────────────────┐
│ Akad Nikah              ⋮    │
│ 20 Dec 2026 · 08:00          │
│ Masjid ...                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Resepsi                 ⋮    │
│ 20 Dec 2026 · 11:00          │
│ Gedung ...                   │
└──────────────────────────────┘

[ + Add Event ]
```

---

# 21. Location / Maps UX

Location card:

```text
Location

Venue Name
[_______________________]

Address
[_______________________]

Coordinates
[ Get from Map ]

[ Open Map ]
```

Invitation CTA:

```text
[ View Location ]
[ Navigate ]
```

---

# 22. RSVP UX

Builder:

```text
RSVP

Enable RSVP              [ON]

Ask attendance           [ON]
Ask guest count          [ON]
Allow message            [ON]
Maximum guests           [ 5 ]
```

Public invitation:

```text
Will you be attending?

○ Joyfully attending
○ Sorry, can't attend

Guest count
[-] 2 [+]

Message
[____________________]

[ Send RSVP ]
```

---

# 23. Countdown UX

Design should inherit template style.

Generic component:

```text
  128      12      04      32
 DAYS    HOURS   MINUTES  SECONDS
```

Possible layouts:

- Minimal line.
- Elegant numbers.
- Circular timer.
- Calendar blocks.
- Editorial typography.

---

# 24. Background Music UX

Builder:

```text
Background Music

[ Upload Audio ]

Autoplay       [ON]
Loop           [ON]
Start muted    [OFF]

Note: browser autoplay behavior may require user interaction.
```

Public invitation should not force audio unexpectedly. UX should offer a visible music control.

---

# 25. Share UX

Share modal:

```text
Your invitation is ready ✨

https://ulwed.../invite/abc123

[ Copy Link ]
[ Share ]
[ WhatsApp ]
```

Success:

> Link copied.

---

# 26. Publish UX

Before publish:

```text
Ready to publish?

✓ Content complete
✓ Event details set
✓ Cover image selected
✓ Mobile preview checked

[ Back to Edit ] [ Publish ]
```

After publish:

```text
Your invitation is live ✨

[ Copy URL ]
[ WhatsApp ]
[ Open Invitation ]
```

---

# 27. Responsive Strategy

Breakpoints conceptually:

```text
Mobile      < 768
Tablet      768–1199
Desktop     >= 1200
```

Builder desktop:

- 3-column shell.

Builder tablet:

- canvas + collapsible panels.

Builder mobile:

- canvas first;
- property panel as bottom sheet;
- sections via drawer.

Public invitation:

- mobile first;
- tablet second;
- desktop enhancement.

---

# 28. Animation System

Product UI:

- 150–250ms micro-interactions.
- 250–450ms panels/modals.
- subtle easing.

Invitation:

Template-specific motion:

- fade;
- rise;
- reveal;
- gentle scale;
- parallax;
- mask reveal;
- floral drift;
- editorial slide.

Respect:

```css
@media (prefers-reduced-motion: reduce) { ... }
```

---

# 29. Invitation Design System

Templates are built from:

```text
Typography
Color
Background
Ornaments
Frames
Dividers
Shapes
Image Treatment
Buttons
Icons
Section Layouts
Motion
```

---

# 30. Template Families Overview

Initial set:

| Template | Family | Photo Density | Primary Mood | Signature |
|---|---|---:|---|---|
| Amora | Romantic Floral | Medium | Romantic | Organic floral/frame |
| Elysian | Luxury Editorial | Low/Medium | Luxury | Editorial whitespace |
| Serena | Minimal Romance | Low | Modern | Typography-first |
| Lumière | Modern Gallery | High | Modern Luxury | Photo-forward layout |
| Nusantara | Modern Traditional | Medium/High | Cultural Luxury | Nusantara-inspired pattern |
| Meadow | Rustic Botanical | High | Warm Romantic | Scrapbook/botanical |

Every family has variants.

---

# 31. TEMPLATE 01 — AMORA

## Concept

Romantic garden wedding. Elegant floral details without becoming overly decorative.

## Default DNA

```text
Typography
- Cormorant Garamond
- Manrope
- Optional handwritten accent

Image Density
- Medium

Shapes
- Soft organic

Ornament
- Fine line flowers
- Leaves
- Botanical corners

Frame
- Organic oval / arched

Background
- Warm paper

Motion
- Gentle fade + floral reveal
```

## Hero Layout

Large couple name with floral corners and one tall portrait.

```text
          floral
       ┌──────────┐
       │  PHOTO   │
       │          │
       └──────────┘

      Alya & Raka
      are getting married

          date
```

## Section style

- Story = narrow editorial column.
- Events = stacked floral cards.
- Gallery = 2-column + feature image.
- RSVP = framed card.

### Variants

#### Amora — Garden
- High botanical ornament.
- Medium image.
- Pale warm background.

#### Amora — Moonlit
- Dark background.
- Metallic-feel accents.
- Low/medium image.
- Dramatic cover.

#### Amora — Vintage Rose
- More floral imagery.
- Rose frame.
- Medium/high photo density.

---

# 32. TEMPLATE 02 — ELYSIAN

## Concept

Quiet luxury / high-end hotel wedding.

## DNA

```text
Typography
- Cormorant / Didot-like display
- Inter / Manrope

Image Density
- Low to Medium

Color
- Cream
- Charcoal
- Muted champagne accent

Ornament
- Minimal line ornaments

Frame
- Thin rectangular frames

Background
- Clean editorial

Motion
- Slow reveal
```

## Hero

Large typography, extremely strong whitespace, one premium portrait.

## Sections

- Couple = large names.
- Event = editorial timeline.
- Story = magazine-style page.
- Gallery = large feature images.
- RSVP = minimal card.

### Variants

#### Elysian — Ivory
Light luxury.

#### Elysian — Noir
Dark editorial with a single light accent.

#### Elysian — Champagne
Warm luxury with slightly richer ornament.

---

# 33. TEMPLATE 03 — SERENA

## Concept

Minimal romantic, typography-first.

## DNA

```text
Image Density
- Low

Typography
- Serif display
- Neutral sans

Ornament
- Almost none

Frames
- Thin line

Layout
- Strong grid

Background
- Clean solid / subtle texture
```

## Hero

Typography is the hero. Photo is secondary.

```text
      ALYA
        &
      RAKA

   20.12.26

   one beautiful day
```

## Sections

- Story-heavy.
- Event timeline.
- One feature gallery.
- RSVP simple.

### Variants

#### Serena — Paper
Warm paper + subtle grain.

#### Serena — Modern White
Clean white editorial.

#### Serena — Ink
Ink-like monochrome.

---

# 34. TEMPLATE 04 — LUMIÈRE

## Concept

Modern luxury, photo-forward.

## DNA

```text
Image Density
- High

Typography
- Contemporary sans + refined serif

Layout
- Full-bleed
- Overlapping photos
- Asymmetrical grid

Ornament
- Minimal geometric shapes

Motion
- Image reveal
- Horizontal slide
```

## Hero

Full-screen image + floating typography.

## Sections

- Gallery is a major part of the experience.
- Story interleaves text and photos.
- Event uses modern cards.
- RSVP as floating panel.

### Variants

#### Lumière — Gallery
Maximum photo density.

#### Lumière — Film
Film-strip / cinematic treatment.

#### Lumière — Clean
Fewer photos, more whitespace.

---

# 35. TEMPLATE 05 — NUSANTARA

## Concept

Modern interpretation of Indonesian wedding aesthetics.

Important: use culturally respectful, generic Nusantara-inspired visual language; do not copy protected artwork or claim a specific ethnic motif without source/context.

## DNA

```text
Color
- Earthy neutrals
- Warm red/brown accents
- Cream

Ornament
- Geometric / botanical-inspired line motifs

Typography
- Modern serif
- Neutral sans

Image Density
- Medium to High

Layout
- Editorial + framed sections
```

## Hero

Couple portrait framed with structured ornamental geometry.

## Sections

- Event cards use pattern borders.
- Gallery uses framed grid.
- Story uses full-width visual separator.

### Variants

#### Nusantara — Sagara
Cooler, refined, architectural.

#### Nusantara — Puspa
Floral-inspired.

#### Nusantara — Terra
Earthy and warm.

---

# 36. TEMPLATE 06 — MEADOW

## Concept

Warm garden / rustic scrapbook.

## DNA

```text
Image Density
- High

Typography
- Friendly serif
- Soft handwriting accent

Ornament
- Leaves
- Doodles
- Tape / paper-like cues

Frames
- Organic irregular

Background
- Paper texture

Layout
- Collage
- Scrapbook
- Masonry gallery
```

## Hero

Polaroid-like couple photo stack.

## Sections

- Story = scrapbook timeline.
- Gallery = masonry.
- Event = handwritten labels.
- Wishes = paper cards.

### Variants

#### Meadow — Picnic
Light and playful.

#### Meadow — Garden
More floral and elegant.

#### Meadow — Film
Analog photo treatment.

---

# 37. Template Variation Rules

Every variation must change at least:

- Hero composition.
- Image density or image treatment.
- Ornament set.
- Typography pairing or weight.
- Background treatment.
- Section composition.

Color-only variation is not permitted.

---

# 38. Photo Density Matrix

| Density | Gallery | Hero | Story | Suitable Templates |
|---|---:|---:|---:|---|
| Low | 2–5 | 1 | Text-heavy | Serena, Elysian |
| Medium | 5–10 | 1–2 | Mixed | Amora, Nusantara |
| High | 10–25+ | 2–4 | Photo-heavy | Lumière, Meadow |

---

# 39. Ornament Library

Directory concept:

```text
ornaments/
├── floral/
│   ├── flower-01.svg
│   ├── flower-02.svg
│   └── leaf-01.svg
├── botanical/
├── geometric/
├── celestial/
├── frame/
├── divider/
├── traditional-inspired/
└── abstract/
```

Every ornament should have metadata:

```js
{
  id: "flower-01",
  family: "floral",
  suitableFor: ["amora"],
  placement: ["corner", "top", "divider"],
  colorizable: true,
  aspectRatio: 1.2
}
```

---

# 40. Frame Library

Frame styles:

- Thin rectangular.
- Double-line.
- Organic oval.
- Arch.
- Polaroid.
- Layered paper.
- Geometric.
- Botanical frame.

Templates should select frames from the appropriate family.

---

# 41. Divider Library

Examples:

```text
────── ✦ ──────

❦

·  ·  ·

──── leaf ────

──────────────
```

Actual production assets should be SVG/CSS rather than Unicode where consistency matters.

---

# 42. Image Treatment Library

Treatments:

1. Natural.
2. Warm film.
3. Soft fade.
4. Black & white.
5. Grain.
6. Duotone.
7. Frame + shadow.
8. Polaroid.
9. Masked arch.
10. Organic cutout.

Template specifies which treatment is available.

---

# 43. Section Layout Library

## Cover

- Fullscreen image.
- Split image/text.
- Typography-only.
- Center portrait.
- Collage.
- Arch photo.

## Couple

- Side-by-side.
- Stacked portrait.
- Full-width portrait.
- Editorial bio.

## Events

- Card stack.
- Timeline.
- Two-column.
- Editorial list.
- Calendar blocks.

## Story

- Vertical timeline.
- Magazine text.
- Scrapbook.
- Image interleave.

## Gallery

- Grid.
- Masonry.
- Filmstrip.
- Editorial feature.
- Collage.

## RSVP

- Center card.
- Bottom sheet style.
- Editorial form.
- Floating panel.

## Closing

- Full image.
- Quote.
- Names only.
- Floral/ornamental ending.

---

# 44. Template Data Contract

```js
const template = {
  id: "amora",
  family: "romantic-floral",
  name: "Amora",
  mood: ["romantic", "elegant"],

  fonts: {
    display: "...",
    body: "...",
    accent: "..."
  },

  colors: {
    bg: "...",
    text: "...",
    primary: "...",
    accent: "..."
  },

  imageDensity: "medium",

  ornaments: {
    corners: [...],
    dividers: [...],
    frames: [...]
  },

  layouts: {
    cover: "archPortrait",
    couple: "splitEditorial",
    events: "floralCards",
    story: "narrowColumn",
    gallery: "featurePlusGrid",
    rsvp: "framedCard",
    closing: "floralFade"
  },

  motion: {
    reveal: "fade-up",
    gallery: "soft-zoom"
  }
};
```

---

# 45. Component Visual States

Each component must define:

- default;
- hover;
- active;
- focus;
- disabled;
- loading;
- success;
- error;
- empty.

Example button:

```text
Default
Hover
Pressed
Focus
Loading
Disabled
```

---

# 46. Empty States

Dashboard:

> **Your first invitation starts here.**
>
> Choose a design, add your story, and make it yours.
>
> [ Create Invitation ]

Gallery empty:

> **No photos yet.**
>
> Upload your favorite memories.
>
> [ Add Photos ]

Events empty:

> **Add your wedding events.**
>
> Start with the ceremony and reception.

---

# 47. Error States

Avoid technical messages.

Bad:

> FirebaseError: permission-denied

Good:

> We couldn't save this change right now. Your latest changes are still safe on this device.

CTA:

> Try Again

---

# 48. Dashboard UX

Header:

```text
Good afternoon ✦
Let's create something beautiful.

[ + Create Invitation ]
```

Sections:

```text
Continue Editing
Recent Invitations
Explore Templates
```

Card:

```text
┌─────────────────────────────┐
│       INVITATION PREVIEW    │
├─────────────────────────────┤
│ Alya & Raka                 │
│ Amora · Garden              │
│ Draft                       │
│                             │
│ [Edit] [Preview] [More]     │
└─────────────────────────────┘
```

---

# 49. Mobile Navigation

For public invitation:

- no heavy navbar;
- optional floating music/share button;
- section navigation via elegant anchor/menu only where appropriate.

For editor:

```text
Canvas

Bottom toolbar
[Sections] [Design] [Content] [Preview]
```

---

# 50. Accessibility & Motion

Decoration must never reduce readability.

- Ornament should not overlap critical text.
- Body text remains readable over image backgrounds using controlled overlays.
- Reduced motion removes decorative movement.
- Interactive elements have visible focus.

---

# 51. Template QA Checklist

Before shipping each template:

- [ ] Mobile cover looks correct.
- [ ] Desktop cover looks correct.
- [ ] Long names do not break layout.
- [ ] Short names still feel balanced.
- [ ] Multiple events fit.
- [ ] Gallery with 3 photos works.
- [ ] Gallery with 20 photos works.
- [ ] Missing photo has a graceful placeholder.
- [ ] Long story text works.
- [ ] RSVP disabled state works.
- [ ] Maps section works.
- [ ] Music disabled state works.
- [ ] Ornaments don't collide with text.
- [ ] Template remains visually coherent after photo replacement.
- [ ] Colors preserve contrast.
- [ ] Animation can be reduced.

---

# 52. Content Robustness Rules

Template design must account for:

### Long names
Use responsive type scaling and sensible line breaks.

### Single-name users
Avoid layouts that require exactly two long names.

### Different photo ratios
Every image slot must define an aspect ratio and crop behavior.

### Missing content
Optional sections must be hidden gracefully.

### Multiple events
Templates must not assume only one event.

### Large galleries
Gallery must have a responsive layout and lazy loading.

---

# 53. Premium Feeling Checklist

Luxury should come from:

- controlled whitespace;
- typography;
- balance;
- material-like surfaces;
- high-quality imagery;
- restrained decoration;
- intentional alignment;
- smooth transitions.

Avoid:

- excessive gradients;
- random shadows;
- too many font families;
- excessive gold effects;
- too many ornaments at once;
- generic dashboard UI inside the invitation itself.

---

# 54. North-Star User Experience

The complete experience should feel like:

```text
I found a beautiful template.
        ↓
I immediately understand how it will look.
        ↓
I choose a variation.
        ↓
I replace photos from my gallery.
        ↓
I fill in the story and events.
        ↓
The design stays beautiful automatically.
        ↓
I preview it on my phone.
        ↓
I publish.
        ↓
I share it on WhatsApp.
```

The user should never feel:

> “I have to design the invitation myself.”

The user should feel:

> **“The design is already beautiful; I only need to make it ours.”**

---

# 55. Final Design Rule

**ULWED template = visual identity, not color preset.**

A template variation is only valid when the user can immediately recognize that the composition, decoration, image strategy, typography, and visual rhythm have changed.

The template system must make it easy to replace content while keeping the design integrity intact.


## Image & Photo UX Standard

Photography is a first-class part of ULWED's template system.

### Core principle

A template must communicate its visual identity through **composition**, not merely color.

Photo treatment may vary through:

- quantity
- aspect ratio
- crop
- frame shape
- overlap
- collage composition
- masked image shapes
- border treatment
- caption placement
- decorative overlays
- image sequencing
- full-bleed vs contained imagery

### Photo density profiles

Each template declares a preferred photo density:

| Profile | Typical use | Visual character |
|---|---|---|
| Low | 1–4 photos | Elegant, spacious, editorial |
| Medium | 5–10 photos | Balanced storytelling |
| High | 11+ photos | Rich, emotional, collage-driven |

Templates may support more than one density mode.

### Replace-photo interaction

When a user clicks any replaceable image:

```text
Image selected
    ↓
Replace Photo
    ├── Upload from device
    ├── Choose from Gallery
    ├── Crop
    ├── Reposition focal point
    └── Remove
```

The user should never need to touch HTML, CSS, or a template definition to change photography.

### Gallery asset library

The editor should maintain a reusable gallery drawer:

```text
My Photos
├── All
├── Cover
├── Couple
├── Gallery
├── Event
└── Other
```

Selecting an existing image should reuse its hosted URL instead of uploading the same binary again.

### Image fallback

If an image is missing:

- show a graceful placeholder in the editor;
- never break the invitation layout;
- preserve the intended crop/frame;
- clearly indicate that the image needs replacement;
- optionally use a neutral template preview image in design previews.

### Template image slots

Template definitions should describe image requirements rather than hard-code URLs:

```js
{
  slotId: "hero-main",
  role: "cover",
  ratio: "4:5",
  density: "low",
  fit: "cover",
  focalPoint: { x: 50, y: 50 }
}
```

This allows the same content to render correctly across different template families.
