# Agent brief - shared by every fan-out page of learn-notion-with-phoebe

Filled from course-builder/references/agent-brief.template.md on 2026-10-10. Internal build
document: never link it from an audience page.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page. Copy its structure, classes, SVG grammar and quiz markup EXACTLY, including
   how many options each question has (FOUR, "A · ..." to "D · ..."):
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-notion-with-phoebe/courses/01-pages-are-not-databases.html`
   For rhythm you may also skim the bench page
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-notion-with-phoebe/courses/04-the-drift-bench.html`
2. The source map: every verified Notion fact (all read at source 2026-10-09), its evidence tier,
   per-session coverage, the seams, the bench canon. Use ONLY its facts and numbers; name NO Notion
   feature the map does not list; never invent a statistic; if a fact is missing, say what is not
   known.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-notion-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block (first 30 lines) for the palette tokens:
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-notion-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY `<a href="../index.html">learn-notion-with-phoebe</a> / Session N of 6`,
#toggle-all, #zoom-toggle) · masthead (eyebrow "Learn Notion with Phoebe · Session N of 6", h1
with one `<span class="accent">`, .sub, .chip-row with the level chip (🟡 Core for sessions 2 and 3,
🟠 Deeper for 5 and 6), two .chip.audience chips and .chip.time "45 min", .agenda a1-a4 with flex
weights 1/4/5/1 as in the template) · main.wrap · section#intro (Part 0 "Where we start": kicker,
.lede that re-introduces Ines as constructed in one or two sentences, .legend pills copied from the
template, .callout.win "★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N`
with section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "5 min live"`), a `.lede`, ONE
figure, two `details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`,
`.caret ▶`), and a `.callout.example` (span.ex-pill "Real world") or `.callout.tip` · section#demo-1
Build-along (kicker klabel "Build-along", h2, `.tag.demo "★ 22 min · everyone builds"`, .lede, ONE
figure, `.steps > .step`, each step a `p` then a `.prompt-box.good` carrying a `span.label` "★ Step N
· ..."; 5 or 6 steps the learner does in their own free Notion account, written as clicks and typed
values the way the template does, with Ines's version as the example) · section#exercise Homework
(ol, 4 items, tag "30 min") · section#quiz (3 x `.quiz-q data-answer="0-based"`, `p.qtext`, FOUR
`button.qopt` "A · ..." to "D · ...", `p.qwhy`; one `p.quiz-score` after the last; vary the correct
letter) · section#official, h2 EXACTLY "What this session teaches, and where it came from",
`.covered > .covered-row` (pill solid ✓ / light ◐ + name + note), then the `.mono` line EXACTLY
"Every fact on this page, and its verification tier, is recorded in the course's source map." ·
section.cheat#cheatsheet (h3 "Session N cheat sheet <span>· pin this</span>", .grid-2 of six
.cheat-item) · `.callout.next` with `.nx-pill` "Next session" (session 6: "Where next" pointing to
the course home and the hub) · footer.pagefoot · `<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url (og:image stays
`https://phoebefu6.github.io/learn-notion-with-phoebe/assets/og-cover.png`);
`<title>Session N · <Title> - learn notion with phoebe</title>`;
`<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 4" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Notion features change monthly. Name only features listed in the map; describe UI paths only as
  the map records them (e.g. `/linked`, `+ New template`, "Save for everyone", "Show on [database]");
  where the map does not give a click path, describe the goal ("add a relation property") rather
  than inventing menu names. Plan limits only as the map states them (automations need a paid plan;
  Free can create only Slack notification automations; some button actions are paid-only). No
  Notion API anywhere. Notion AI at most one self-study sentence pointing to AI Productivity.
- Every number comes from the map or is labelled constructed. Bench numbers are quoted only from
  the map's canon table and are called "counted on the constructed rows" (habits "modelled").
  Ines's example values in build-alongs say "constructed" or "your values will differ".
- Contested or missing evidence: teach the disagreement or the gap. "One fact in one place" is the
  textbook form of Codd's 1970 redundancy and consistency problem, never a Codd quotation; quote
  Codd only from the map's three short quotes.
- NEVER "lottery" or "lotteries"; say the mechanism. Default to the English word; no Chinese terms.
- Ines facts, exactly: fictional freelance user-research consultant, 4 active clients (Aldermoor
  Health, Brightwell Mutual, Corvid Studio, Dunmore Council), 2 past clients (Eastgate Retail,
  Fernhill Labs), 1 part-time contractor, Theo, who recruits participants and takes notes. Her
  research notes live in her Obsidian vault, not here. Never Phoebe, never a real firm.
- Titles, widget ids and class names must not collide with siblings. Banned titles: "A system you
  keep", "The one-page marketing plan", "Is it worth the time?", "Where your week actually goes".
  Do not add new CSS classes or ids beyond those in the template; figure classes use your prefix.
- Seams, said out loud with absolute links where the page touches them (link format
  `<a href="URL">Name ↗</a>`):
  PARA and one home per note -> https://phoebefu6.github.io/learn-pkm-with-phoebe/ (link, never re-teach) ;
  Zapier, Make, n8n, external automation -> https://phoebefu6.github.io/learn-automation-with-phoebe/ ;
  AI triage, Notion AI -> https://phoebefu6.github.io/learn-ai-productivity-with-phoebe/ ;
  Ines's research vault -> https://phoebefu6.github.io/learn-obsidian-with-phoebe/ ;
  normal forms, schema design -> https://phoebefu6.github.io/learn-data-modeling-with-phoebe/ .

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): ink `#37352F` · muted `#5F5C57` · primary
`#2F2F2F` · deep `#191919` · mid `#4A4946` · soft `#E3E2DE` · 50-tint `#F7F6F3` · faint `#D3D1CB`
· hairline `#EDECE9` · highlighter `#B58900` (fill, stroke `#6B5100`) · highlighter ink `#6B5100`
· highlighter 50 `#FBF3DB` · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a
wrong-way panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg"
  role="img" aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: `n<session><letter>`, e.g. n2a, n2b, n2c,
  n2d (build-along figure is d). Never reuse n1* or n4*.
- `<defs>` holds with prefix P: a wobble filter `id="PSk"` (`feTurbulence type="fractalNoise"
  baseFrequency="0.02" numOctaves="2" seed="<int>"` + `feDisplacementMap scale="2.4"
  xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%" width="106%" height="106%"`), a
  hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one `#2F2F2F` line, opacity .5), an
  open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, stroke `#37352F` 1.6). ALL shapes sit
  inside ONE `<g filter="url(#PSk)" fill="none" stroke="#37352F" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">`; rects carry a tiny rotation (-4 to 4 degrees for
  hand-placed items, under 1 for panels). Fills: white, `#F7F6F3`, the hachure for "the pile" or
  "the data", and the highlighter (`#B58900` fill, `#6B5100` stroke) ONLY for the one thing the
  figure is about. One doodle anchor per figure, simple strokes, never a mascot.
- Text classes, copy the template's `<style>` block: `.PH` 800 12px `#37352F` heading · `.PL` 600
  12px ink label · `.PS` 400 11px `#5F5C57` · `.PB` 800 11px `#6B5100` · `.PA` 700 11px `#2F2F2F`
  axis caption · `.PK` 800 12px `#191919` (the ONLY class allowed on top of a `#B58900` fill) ·
  `.PN` 400 12px muted note · `.PW` 800 11px `#991B1B` for a wrong-way heading. Never white text on
  the highlighter, never highlighter-coloured text on white.
- ALL `<text>` outside the filtered group, sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110
  chars; 40px between neighbouring point labels; bottom note 22px below the last row, H clears it by
  8px. No line, arrow or curve may cross a label (the gate flags line-through-text and
  text-out-of-box): place edge labels like "yes"/"no" beside a curve with `text-anchor="end"` or
  clear of it; hand-stacked rects must not overlap as painted rects. When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along (4 figures). Draw the MECHANISM (what the
  outline names for each figure), never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a story; the "Real world" callout is a generic, recognisable pattern ("a familiar
pattern in shared workspaces: ..."), never a named real person's case and never Phoebe. Ines is
constructed: say so on the page.

## Footer chain and session titles

Footer left: `Session N of 6 · learn-notion-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>`
Footer right: `<a href="PREV">← Prev: <title></a> &nbsp;·&nbsp; <a href="NEXT">Next: <title> →</a>` (session 6: `← Prev` and `<a href="../index.html">Course home →</a>`).

Session titles (exact, sentence case, one accent span in h1) and files:
1 `01-pages-are-not-databases.html` Pages are not databases ·
2 `02-properties-that-answer-questions.html` Properties that answer questions ·
3 `03-relations-and-rollups.html` Relations and rollups: one fact, one place (footer short form "Relations and rollups") ·
4 `04-the-drift-bench.html` The drift bench ·
5 `05-formulas-templates-buttons.html` Formulas, templates and buttons ·
6 `06-the-monday-dashboard.html` The weekly dashboard you open every Monday (footer short form "The Monday dashboard")
