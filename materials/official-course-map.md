# Official course map - learn-notion-with-phoebe ("Notion Mastery")

Internal build document. Never link it from an audience page.

Bucket `prod`, d2, audience everyone, format project. Single-track, 6 sessions x 45 min, session 4 =
the drift bench. Running case: **Ines**, a FICTIONAL freelance user-research consultant
(constructed; never Phoebe): freelance, **4 active clients, 1 part-time contractor (Theo)**. The
same Ines appears in learn-obsidian-with-phoebe (her research vault); here she is her operations:
clients, projects, tasks, meetings, invoices, a reading list, a weekly dashboard.

**All Notion help pages below were read at source on 2026-10-09. Notion ships features monthly:
re-verify the changelog (notion.com/releases) and each help page before delivery.** Name only the
features listed here. No Notion API (standing decision). No Notion AI on the core path.

## Evidence tiers

- **S** read at source on the date above (quote or close paraphrase of the page)
- **R** reported: not read at source; may appear only labelled "reported"
- **C** constructed: the bench and Ines; every page says "constructed"

## Verified facts (tier S unless marked)

### Databases and pages (help/intro-to-databases, help/data-sources-and-linked-databases)
- "Every item you enter into your database is a Notion page." Each row, card or calendar event is a
  full page with properties at the top. (S)
- Full-page databases appear in the sidebar like any page and can be locked; inline databases hide
  their controls until hover and can be expanded to full page. (S)
- Views can be shown as table, list, board, calendar, gallery or chart (intro page); the views page
  also names timeline. Each view has its own properties, filters, sorts and grouping. (S)
- Above 1,000 items, new pages may appear in the middle of the collection rather than at the end. (S)
- "Every database is made up of at least one data source." A database can contain multiple data
  sources. Edits to a data source's title, properties or pages are reflected in the original; views,
  filters, sorts and groups you create on a linked source do not affect the original's views. (S)
- Only users with Can edit access can move data sources. (S)

### Properties (help/database-properties)
- Types named on the page: Text, Number, Select, Status, Multi-select, Date, Formula, Relation,
  Rollup, Person, File, Checkbox, URL, Email, Phone, Created time, Created by, Last edited time,
  Last edited by, Button, ID, Place. (S)
- Status tags are grouped into To-do, In progress, Complete. Select = one tag, multi-select = one or
  more. Number can display as currency or a progress bar. (S)
- Up to 500 properties per database. (S)

### Relations and rollups (help/relations-and-rollups)
- Relations between two databases are created one-way by default; a "Show on [database]" toggle
  makes the matching property in the other database (two-way). (S)
- A relation can be limited to `1 page` or `No limit`. (S)
- A database can relate to itself. Duplicating a database turns a two-way relation one-way. CSV
  export writes relations as plain-text URLs that cannot be re-imported as relations. (S)
- Rollup calculations, all property types: Show original, Show unique values, Count all, Count
  values, Count unique values, Count empty, Count not empty, Percent empty, Percent not empty.
  Numbers only: Sum, Average, Median, Min, Max, Range. Dates only: Earliest date, Latest date,
  Date range. (S)
- A rollup can only be sorted when it outputs a number; you cannot roll up a rollup. (S)
- The page does NOT say what a relation shows when its target page is deleted. (S, absence)

### Deleting (help/duplicate-delete-and-restore-content)
- A deleted page goes to Trash, stays 30 days by default before permanent deletion, and can be
  restored from Trash. The page does not mention relations. (S)

### Formulas (help/formulas, help/formula-syntax, help/guides/new-formulas-whats-changed)
- Formulas 2.0 guide: formulas "can be written multi-line in the editor (with tabs and comments
  too!)"; comment form `/* ... */`. They now output pages, dates, people and lists as well as text,
  numbers and checkboxes. Formulas "can reach into properties of related databases". (S)
- Guide example, verbatim: `prop("Tasks").map(current.prop("Status")).filter(current == "Done").length()` (S)
- Dot notation, e.g. `prop("Created By").name()`. `let` example: `let(SalesTax, (prop("Subtotal")*0.099), prop("Subtotal") + SalesTax)`. (S)
- Existing formulas referencing rollup, person, file and multi-select were converted to text at
  migration. (S)
- Syntax page functions confirmed with examples: if, ifs, let, lets, map, filter, sum, format,
  dateBetween, dateAdd, now, round, empty, contains, toNumber, style. `ifs(true, 1, true, 2, 3)` = 1;
  `dateBetween(now(), parseDate("2022-09-07"), "days")`; `round(1.234, 2)` = 1.23. (S)
- References: the syntax page writes `prop("Name")`; the intro page shows property names inline
  (`dateAdd(Start Date, 2, "week")`) as the editor displays them. Teach `prop("Name")` as the typed
  form. (S)
- The editor shows a live preview when opened from a row and lists available properties and
  functions. (S)
- Launch month September 2023: R (third-party coverage only). Do not print a launch date.
- Shift+Enter for a new line in the editor: R (Thomas Frank). Pages say "multi-line" only.

### Views, filters, sorts, groups (help/views-filters-and-sorts)
- Filter and sort changes apply only to you unless you choose "Save for everyone". (S)
- Advanced filters combine AND/OR in filter groups, "nested up to three layers deep". (S)
- Group by a property, hide empty groups; sub-groups add a second layer (e.g. status then
  priority). Each view keeps its own settings. (S)

### Linked databases (help/guides/using-linked-databases)
- Type `/linked`, pick the database, copy a view or create a new one. Edits in a linked database
  appear in the original; "filters and views only apply to the linked instance". (S)

### Templates (help/database-templates)
- `+ New template` from the dropdown next to New; the template page's title is its name. (S)
- Repeating templates: daily, weekly, monthly or yearly, with interval, start date and time; they
  "automatically create a copy of a template in your database". (S)
- Templates can nest at most three levels; no nesting inside a daily-repeating template. (S)
- The page advises against pre-filling relation properties unless every page from that template
  should relate to the same page. (S)
- Default templates and template variables ("Today", "Me") are NOT on the page read. Do not teach
  them as facts; a self-filtering linked view in a template is R (third-party guides). Cut.

### Buttons and automations (help/buttons, help/database-buttons, help/database-automations)
- Button actions: Insert blocks, Add page to, Edit pages in, Send notification to (up to 20
  members), Send mail to (Gmail, paid plans), Send webhook (paid), Show confirmation, Open page or
  URL, Send Slack notification to (Plus, Business, Enterprise), Define variables. Buttons are on
  all plans; some actions are paid-only. (S)
- Database button property adds "Edit property" on pages in the current database. (S)
- Database automations: triggers Page added, Property edited, Every {frequency}; actions include
  Edit property, Add page to, Edit pages in, notifications, mail, webhook, Slack, Define
  variables. Automations need a paid plan; Free plan users can create only Slack notification
  automations, and can use (not edit) automations included in templates. (S)

### Sharing and permissions (help/sharing-and-permissions)
- Levels: Full access, Can edit, Can edit content (databases only: create and edit pages and
  property values, not structure, views, sorts or filters), Can comment, Can view; also Can create
  (database-only: add pages without seeing others'). (S)
- "When you create a subpage inside of a page, that subpage will take on the permissions of its
  parent page." (S)
- Guests are people outside the workspace and need a Notion account. Publish to web via the Share
  menu's Publish tab. (S)

### The borrowed principle (Codd 1970)
- E. F. Codd, "A Relational Model of Data for Large Shared Data Banks", Communications of the ACM
  13(6), June 1970, 377-387. Read at source (PDF). Section 2 applies operations on relations "to
  the problems of redundancy and consistency"; a set of relations is "strongly redundant if it
  contains at least one relation that possesses a projection which is derivable from other
  projections"; consistency "is a property of the instantaneous state of a data bank, and is
  independent of how that state came about". (S)
- "One fact in one place" is the textbook paraphrase of normalisation, not a Codd quotation; the
  later normal forms come from Codd's 1971-72 papers (R). Pages say "the textbook form of Codd's
  idea". Normal forms themselves belong to learn-data-modeling-with-phoebe (b2 anomaly lab).

## Bench canon (session 4, the drift bench) - CONSTRUCTED

Sample: `assets/nt-sample.js`, seed 20261009, 165 rows (7 client rows incl. 1 accidental
duplicate, 16 projects, 96 tasks, 46 invoices) over 26 weeks; Q2 = weeks 14-26. 158 rows carry a
client. 12 seeded edits; default 6 applied:
1 week 5 Corvid Studio rate $95 to $110 · 2 week 7 Aldermoor Health renamed Aldermoor Care ·
3 week 9 duplicate "Brightwell" merged into Brightwell Mutual · 4 week 12 Aldermoor rate $120 to $135 ·
5 week 15 Dunmore Council renamed Dunmore District Council · 6 week 18 Brightwell rate $125 to $140.

Python (`materials/nt_reference.py --json`) and node (`materials/nt-node.js`) outputs are
IDENTICAL (integer counts and whole dollars), checked 2026-10-09.

| Rung (default 6 edits) | rows disagreeing (of 158) | stale-rate invoices | $ off contract | questions wrong (of 5) |
|---|---|---|---|---|
| 1 A · copied text | 52 | 7 | $1,965 | 3 |
| 2 A + monthly manual sync | 27 | 3 | $1,035 | 2 |
| 3 B · relation to one Clients row | 0 | 7 | $1,965 | 2 |
| 4 B + rollups (rate read at issue) | 0 | 0 | $0 | 0 |

- Q2 revenue shown vs true: rung 1 $57,855 vs $58,845; rung 2 $58,485; rung 3 $57,855; rung 4 $58,845.
- Questions wrong, rung 1: revenue by client, clients billed count, total billed. Rungs 2 and 3:
  revenue by client, total billed. Open tasks for Brightwell and next-invoice rate are right at 6 edits.
- Rung 4 note: a live rollup with no freeze would have rewritten 14 past invoices.
- Edits 0: every rung shows 21 disagreeing rows (the duplicate exists from week 3; no design finds
  a duplicate for you) and 2 questions wrong. Rungs 3 and 4 reach 0 rows only once the merge (edit 3)
  is applied.
- Sweep, rows disagreeing at 0..12 edits: rung 1 21,21,31,31,31,52,52,82,82,111,111,131,131;
  rung 2 21,21,25,15,15,27,27,42,42,73,73,99,99; rungs 3 and 4 21,21,21 then 0.
- Stale invoices at 12 edits: rung 1 12, rung 2 6, rung 3 12, rung 4 0. Questions wrong at 12
  edits: rung 1 5, rung 2 4, rung 3 3, rung 4 0.
- **Anti-lever, one giant table:** 165 rows x 16 properties = 2,640 cells, 1,519 empty = 57.5%; an
  "Overdue tasks" view (Due before week 26, Done unticked) catches 37 invoices beside 15 real
  overdue tasks; names are still copies, so drift equals rung 1 (52 rows, 3 of 5 wrong at 6 edits).
- **Break, delete the biggest client's row** (Brightwell Mutual, C2): rungs 3 and 4 orphan 50 rows;
  this quarter's by-client totals lose $17,230 (rung 3) or $17,770 (rung 4). Rungs 1 and 2 orphan 0
  but leave 50 rows naming a client with no page, with no warning.
- Modelled: Ines's habits (copy at creation; sync every 4 weeks at week end, touching only active
  projects, open tasks and unpaid invoices; invoices paid 4 weeks after issue). Counted: everything
  else, on the rows. "Truth" = each client's current name and the contract rate in force on the
  invoice's week. The break treats a deleted page as gone; Notion keeps it in Trash 30 days.

## Per-session coverage

1. **Pages are not databases** (green). Page vs database; every row is a page; inline vs full-page;
   data source (at least one); views as lenses on one data source; Ines's first Clients database.
   Seam: PARA as starting structure, linked to learn-pkm. Build: Ines's workspace skeleton (Home,
   Clients, Projects, Tasks, Invoices, Meetings, Reading list).
2. **Properties that answer questions** (yellow). Property types (S list), choose type by the
   question you will ask; select vs status vs multi-select; dates; created/edited time; ID; the
   500 limit; views/filters/sorts/groups, "Save for everyone", filter groups 3 layers. Build: the
   Projects and Tasks properties plus three views.
3. **Relations and rollups: one fact, one place** (yellow). Codd's redundancy and consistency,
   one-way vs two-way, limit 1 page, self-relation, rollup calculations, cannot roll up a rollup,
   CSV export loses relations. Build: Clients <-> Projects <-> Invoices, rollup totals.
4. **The drift bench** (orange). The canon above; anti-lever and break.
5. **Formulas, templates and buttons** (orange). Formulas 2.0 syntax (prop, if/ifs, let/lets,
   map/filter, dot notation, dateBetween, multi-line + comments), the Tasks map/filter example;
   templates, repeating templates; buttons and database buttons; database automations and the
   paid-plan line. Build: Invoice amount formula, overdue flag, a "New project" template, an
   "Issue invoice" button that freezes the rate. Seam: external automation to learn-automation.
6. **The weekly dashboard you open every Monday** (red). Linked views (/linked) filtered per
   purpose, data sources and what propagates, permissions and sharing (levels, inheritance, Can
   edit content for Theo, guests), the Monday ritual, archiving. Build: Ines's Monday dashboard
   page with four linked views and Theo's access.

## Seams (absolute links)

- https://phoebefu6.github.io/learn-pkm-with-phoebe/ owns PARA and one home per note; linked, never re-taught.
- https://phoebefu6.github.io/learn-automation-with-phoebe/ owns Zapier, Make, n8n; Notion's own buttons and automations stay here.
- https://phoebefu6.github.io/learn-ai-productivity-with-phoebe/ owns AI triage; Notion AI is self-study pointer only.
- https://phoebefu6.github.io/learn-obsidian-with-phoebe/ holds Ines's research vault (same facts).
- https://phoebefu6.github.io/learn-data-modeling-with-phoebe/ owns normal forms (anomaly lab).

## Not covered (honest list)

Notion API and integrations; Notion AI features (self-study pointer only); Notion Sites styling and
custom domains; Forms (mentioned only as connected to databases); Charts beyond naming the view;
Calendar app, Mail; synced blocks; enterprise admin, audit log, SAML; offline mode; default
templates and template variables (not read at source); plan prices (change too often; read the
pricing page on the day).

## Citation appendix (form for pages)

- Notion Help Center, "Intro to databases", notion.com/help/intro-to-databases, read 2026-10-09.
- Notion Help Center, "Data sources", notion.com/help/data-sources-and-linked-databases, read 2026-10-09.
- Notion Help Center, "Database properties", notion.com/help/database-properties, read 2026-10-09.
- Notion Help Center, "Relations & rollups", notion.com/help/relations-and-rollups, read 2026-10-09.
- Notion Help Center, "Intro to formulas", notion.com/help/formulas, read 2026-10-09.
- Notion Help Center, "Formula syntax & functions", notion.com/help/formula-syntax, read 2026-10-09.
- Notion Help Center guide, "Formulas 2.0: How to use Notion's new and improved formulas", notion.com/help/guides/new-formulas-whats-changed, read 2026-10-09.
- Notion Help Center, "Views, filters, sorts & groups", notion.com/help/views-filters-and-sorts, read 2026-10-09.
- Notion Help Center guide, "Using linked databases", notion.com/help/guides/using-linked-databases, read 2026-10-09.
- Notion Help Center, "Database templates", notion.com/help/database-templates, read 2026-10-09.
- Notion Help Center, "Buttons", notion.com/help/buttons; "Database buttons", notion.com/help/database-buttons, read 2026-10-09.
- Notion Help Center, "Database automations", notion.com/help/database-automations, read 2026-10-09.
- Notion Help Center, "Sharing & permissions", notion.com/help/sharing-and-permissions, read 2026-10-09.
- Notion Help Center, "Duplicate, delete and restore content", notion.com/help/duplicate-delete-and-restore-content, read 2026-10-09.
- E. F. Codd, "A Relational Model of Data for Large Shared Data Banks", Communications of the ACM 13(6), 1970, 377-387.
