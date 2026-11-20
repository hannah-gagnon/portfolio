# Hannah Gagnon — Portfolio (hannah-gagnon.com)

Personal design portfolio for Hannah Gagnon, a digital & experience designer in Vancouver.
Plain static site: HTML + one CSS file + one small JS file. No frameworks, no build step.
Hosted free on GitHub Pages; the GoDaddy domain points at it via the `CNAME` file in the repo.

## How to work on this site
- Edit the `.html` files, `css/styles.css` and `js/main.js` directly.
- **Preview:** run a local server from this folder (e.g. `python3 -m http.server 8000`) and open
  http://localhost:8000. Nothing is public until Hannah pushes to GitHub.
- **Nav, mobile menu and footer are repeated in every page.** If you change one, change all 9.
- Case study pages live in `projects/`, so their asset paths start with `../`.
- `styles.css` and `main.js` are linked with `?v=YYYYMMDD` in all 9 pages (cache-busting). Bump it in every page
  whenever you change CSS/JS, or browsers may mix old styles with new pages.
- Keep changes small and show Hannah before/after. She's a designer: match the Figma, don't improvise.
- Before going live, do NOT delete the repo's `CNAME` file.

## Source of truth: Figma
File: "Portfolio - Fall 2026 Update" (key `BkWIzwFJqK9RQAaofqm03R`)
- **V1 - Home, About, Case Studies, Misc.** page: desktop designs (1440 wide).
- **V1 - Mobile** page: phone designs (390 wide) for Home, menu (open), Work, Misc., About, CO·LAB.
  The coded mobile layout should follow this page (≤760px breakpoint).
- **_Components & Style Guide** page: components, style guide, tokens.
- **Export for Code** page: every image named with its folder path (File → Export into `assets/`).
- Graveyard / Research pages: old explorations, ignore unless asked.

## Pages
| File | Notes |
|---|---|
| `index.html` | Home. First 3 projects + "More projects" button that reveals the rest (Clubhouse Canada, "case study coming soon"). Glass "Open to new roles & freelance" pill top-right. |
| `work.html` | All projects (4 cards) + "More on the way!" |
| `about.html` | Final combined About: portrait hero, (01) My bread & butter, (02) Off the clock, (03) So far..., "Coffee chat?" |
| `misc.html` | Tabs: Other Projects (Tushy, Carepod placeholders) / Type Fun / Arts & Crafts (empty "on their way" states) |
| `projects/colab.html` | Case study |
| `projects/pht.html` | Case study (4 autoplay looping MP4s in Process + Brand system) |
| `projects/dream-creatives.html` | Case study |
| `projects/tushy.html` | Misc project page (Tushy assets for Barrel). Linked from the Tushy card on Misc. |
| `projects/carepod.html` | Misc project page (Carepod assets for Barrel), same layout classes as Tushy. Linked from Misc. |

Case study order / "Up next" loop: CO·LAB → Dream Creatives → PHT → CO·LAB.
Clubhouse Canada (McCormick) case study exists in Figma but is NOT published yet.

## Design tokens (in `:root` of styles.css)
- Background `#F9F8F2` · subtle `#ECEBE1` · placeholder `#E2E0D4`
- Text primary `#181818` · secondary `#6E6D68` · tertiary `#6B6B66`
  (Figma uses #838383 / #747474; darkened slightly in code for WCAG AA on cream. Keep it.)
- Sage `#D6E2B8` (flourishes) · sage-deep `#7E8F57` (status dot, footnote asterisk) · border `#DAD8CB`
- Fonts: **Fraunces** (serif: headings, nav, labels) + **Figtree** (sans: body, captions), Google Fonts.
- Layout: designed at 1440, 48px gutter. `--edge` keeps content on a centered 1440 grid while
  backgrounds + flourishes run full width on bigger screens.

Type classes mirror Figma text styles: `.t-display` (128 Light), `.t-upnext` (96 Light),
`.t-statement` (44 Light), `.t-h1` (32), `.t-section` (32), `.t-h2` (24), `.t-h2i` (24 italic),
`.t-h3` (16 italic), `.t-company` (16), `.t-nav` (14), `.t-logo` (20), `.t-body-lg` (16 sans),
`.t-body` (14 sans), `.t-caption` (12 sans), `.t-caption-i` (13 serif italic). Sizes use clamp() for mobile.

## Rules Hannah has set (important)
1. **No italics anywhere on the site, except the mobile menu** (its current-page link is italic, keep it).
   `.t-h3`, `.t-h2i` and `.t-caption-i` are now upright despite their names (Figma called them italic).
2. **Cross-stitch flourishes must always bleed off the screen edge** at every viewport, never stop short
   with a gap. They're anchored to an edge with `right:0`/`left:0` + `translateX(...)`. Keep it that way.
3. Case study images use 16:9 containers (`.media__frame`), matching her 1920×1080 assets.
4. About page uses tighter spacing (`.page-about` overrides). She found it too spaced out before.
   Mobile tweaks she designed: Home About-preview photo is ~half width (180px); on About, the
   "Off the clock" photo + caption sit ABOVE the section title on mobile only (`.section--clock`).
5. Keep the look of her Figma. Don't add generic effects (scroll fade-ins, extra badges, gradients).

## Interactions (js/main.js)
- "More projects" expand/collapse on Home (animated height, accessible aria-expanded).
- Misc tabs (arrow-key support).
- Full-screen mobile menu (≤760px): hamburger top-right, Esc closes, focus trapped, scroll locked.
- Hover flipbooks: project cards + "Up next" thumbnail flip through `data-hover-frames` images every
  0.40s (`FRAME_INTERVAL`) on hover/focus. Mouse/trackpad only; skipped with prefers-reduced-motion.
- Flourishes: swapped to inline SVG; a swoop grows ~1.5s after each comes into view; Home's top one
  (`data-draw`) draws itself in. Smooth scroll (Lenis) + hide-on-scroll glass nav.
- Hovers: nav underline, text links get thicker sage underline, socials/footer darken, tabs tint.

## Assets (`assets/`)
- `images/{home,about,colab,dream-creatives,pht,thumbnails}/` — JPGs, already resized/compressed
  (max 2000px, thumbnails 1000px). Compress anything new the same way before adding.
- `icons/` — favicon set (Hannah's script "HG" signature) + `flourish-large.svg`, `flourish-small.svg`.
- `videos/` — `pht-iterations.mp4`, `pht-colours.mp4`, `pht-logo-variations.mp4`, `pht-type.mp4`, `colab-homepage-scroll.mp4`,
  `tushy-hero-reel.mp4`, `tushy-brand-grid.mp4`, `tushy-about-page.mp4`,
  `dc-homepage-scrollthrough.mp4`, `dc-plans-page.mp4`, `dc-gallery-page.mp4` (DC sources live in ~/Documents/Portfolio).
  `carepod-reel.mp4`, `carepod-module-reel.mp4`, `carepod-laptop-mockup.mp4` (sources: ~/Documents/carepod assets).
- `images/thumbnails/hover/` — project card hover flipbook frames (`<project>-1.jpg` …), listed in each card's `data-hover-frames`.
- `_originals/` (git-ignored) — full-size source files kept locally, never uploaded.
  Re-encode big videos before adding (no ffmpeg here; macOS `avconvert --preset Preset1920x1080` works).

## Still to do
- [ ] **Resume:** links removed from every page for now (menu, footer, Home hero, About CTA).
      When `assets/resume.pdf` exists, add "Resume →" back after Instagram in each `.socials` block and
      in About's "Coffee chat?" links. If Hannah asks "did I forget anything?", remind her about the resume.
- Social links (LinkedIn/Instagram) live in: Home hero, About, footer and the mobile menu. Removed from the
  Work and Misc page heads on purpose.
- [x] Case study videos: all placeholders now filled (CO·LAB + Dream Creatives).
      She's redoing these in Figma; swap the placeholder `<div>` for a `<video autoplay muted loop playsinline>`.
- [ ] Responsive refinement at in-between widths (laptop ~1280, tablet 768–1024), using the "V1 - Mobile" Figma page as reference.
- [ ] Misc: Tushy / Carepod images, Type Fun + Arts & Crafts content.
- [ ] Clubhouse Canada case study page (assets are in her "Barrel Internship" Figma file, "★ Portfolio Assets" page) — only when she says it can go public.
- [ ] Go live: push to GitHub (keep `CNAME`).

## Links
- LinkedIn: https://www.linkedin.com/in/hannah-gagnon
- Instagram: https://www.instagram.com/digitally.hannah
