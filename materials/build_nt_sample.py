#!/usr/bin/env python3
"""Build the constructed Ines workspace for the drift bench.

CONSTRUCTED DATA. Ines is a fictional freelance user-research consultant with 4 active clients,
2 past clients and 1 part-time contractor (Theo). Nothing here describes a real person or firm.

Writes assets/nt-sample.js as `window.NT_SAMPLE = <json>;` (json.dumps, never string interpolation).
The engine (assets/nt-live.js) and the Python reference (materials/nt_reference.py) both read it.

Run: python3 materials/build_nt_sample.py
"""
import json
import os
import random

SEED = 20261009
WEEKS = 26          # two quarters: Q1 = weeks 1-13, Q2 = weeks 14-26
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets", "nt-sample.js")

rng = random.Random(SEED)

# Clients. C7 is an accidental duplicate of C2, created by the contractor in week 3.
clients = [
    {"id": "C1", "name": "Aldermoor Health", "rate": 120, "active": True, "created": 1},
    {"id": "C2", "name": "Brightwell Mutual", "rate": 125, "active": True, "created": 1},
    {"id": "C3", "name": "Corvid Studio", "rate": 95, "active": True, "created": 1},
    {"id": "C4", "name": "Dunmore Council", "rate": 100, "active": True, "created": 1},
    {"id": "C5", "name": "Eastgate Retail", "rate": 110, "active": False, "created": 1},
    {"id": "C6", "name": "Fernhill Labs", "rate": 105, "active": False, "created": 1},
    {"id": "C7", "name": "Brightwell", "rate": 125, "active": True, "created": 3, "dupOf": "C2"},
]

# Projects: (client, start week, end week, hours per week). Three per active client,
# one per past client, two created against the duplicate.
plan = [
    ("C1", 1, 9), ("C1", 8, 18), ("C1", 16, 26),
    ("C2", 1, 6), ("C2", 12, 22), ("C2", 19, 26),
    ("C3", 2, 12), ("C3", 10, 20), ("C3", 18, 26),
    ("C4", 1, 10), ("C4", 11, 21), ("C4", 20, 26),
    ("C5", 1, 6),
    ("C6", 1, 5),
    ("C7", 3, 13), ("C7", 6, 16),
]
TOPICS = ["Discovery interviews", "Usability study", "Diary study", "Survey redesign",
          "Journey mapping", "Concept testing", "Accessibility review", "Onboarding research",
          "Card sort", "Service blueprint", "Pricing interviews", "Stakeholder workshop",
          "Tree test", "Competitor review", "Field visits", "Research ops audit"]
projects = []
for i, (c, s, e) in enumerate(plan):
    projects.append({"id": "P%02d" % (i + 1), "client": c, "name": TOPICS[i],
                     "start": s, "end": e, "hpw": rng.randint(4, 9)})

# Invoices: every 4 weeks inside a project, plus one at its end week. Hours = hpw * weeks covered.
invoices = []
n = 0
for p in projects:
    last = p["start"] - 1
    weeks = [w for w in range(p["start"], p["end"] + 1) if w % 4 == 0 and w > p["start"]]
    if p["end"] not in weeks:
        weeks.append(p["end"])
    for w in weeks:
        n += 1
        invoices.append({"id": "INV-%03d" % n, "project": p["id"], "week": w,
                         "hours": p["hpw"] * (w - last)})
        last = w
invoices.sort(key=lambda r: (r["week"], r["id"]))

# Tasks: six per project, due across the project, done flag seeded (tasks due late stay open).
tasks = []
VERBS = ["Recruit participants", "Draft discussion guide", "Run sessions", "Synthesis wall",
         "Write findings", "Readout to client"]
k = 0
for p in projects:
    span = p["end"] - p["start"]
    for j in range(6):
        k += 1
        due = p["start"] + (span * (j + 1)) // 6
        done = due < 24 and rng.random() < 0.85
        tasks.append({"id": "T%03d" % k, "project": p["id"], "name": VERBS[j], "due": due,
                      "done": done, "who": "Theo" if rng.random() < 0.3 else "Ines"})

# Twelve realistic edits, applied in order; the bench's slider applies the first N (default 6).
edits = [
    {"week": 5, "type": "rate", "client": "C3", "rate": 110},
    {"week": 7, "type": "rename", "client": "C1", "name": "Aldermoor Care"},
    {"week": 9, "type": "merge", "client": "C7", "into": "C2"},
    {"week": 12, "type": "rate", "client": "C1", "rate": 135},
    {"week": 15, "type": "rename", "client": "C4", "name": "Dunmore District Council"},
    {"week": 18, "type": "rate", "client": "C2", "rate": 140},
    {"week": 20, "type": "rename", "client": "C3", "name": "Corvid and Finch"},
    {"week": 22, "type": "rate", "client": "C4", "rate": 115},
    {"week": 23, "type": "rename", "client": "C2", "name": "Brightwell Group"},
    {"week": 24, "type": "rate", "client": "C3", "rate": 120},
    {"week": 25, "type": "rename", "client": "C1", "name": "Aldermoor Care Trust"},
    {"week": 25, "type": "rate", "client": "C1", "rate": 150},
]

# Property sets per row type, for the one-giant-table anti-lever.
props = {
    "client": ["Name", "Rate", "Status", "Email", "Contract start"],
    "project": ["Name", "Client", "Rate", "Start", "End", "Status"],
    "task": ["Name", "Project", "Client", "Due", "Done", "Assignee"],
    "invoice": ["Name", "Client", "Project", "Hours", "Rate", "Amount", "Issued", "Due", "Paid"],
}

data = {
    "note": "CONSTRUCTED. Ines and every client are fictional. Seeded; regenerate with materials/build_nt_sample.py.",
    "seed": SEED, "weeks": WEEKS, "q2": [14, 26], "syncEvery": 4, "paidAfter": 4, "invoiceDue": 4,
    "defaultEdits": 6, "clients": clients, "projects": projects, "tasks": tasks,
    "invoices": invoices, "edits": edits, "props": props,
}

with open(OUT, "w") as f:
    f.write("/* CONSTRUCTED drift-bench workspace: generated by materials/build_nt_sample.py, do not hand-edit. */\n")
    f.write("window.NT_SAMPLE = " + json.dumps(data, separators=(",", ":")) + ";\n")

rows = len(clients) + len(projects) + len(tasks) + len(invoices)
print("clients", len(clients), "projects", len(projects), "tasks", len(tasks),
      "invoices", len(invoices), "rows", rows, "bytes", os.path.getsize(OUT))
