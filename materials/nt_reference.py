#!/usr/bin/env python3
"""Independent Python reference for the drift bench (assets/nt-live.js).

Reads the same constructed sample (assets/nt-sample.js) and recomputes every count the widget
prints. Integer arithmetic only, so agreement with node must be exact.

Run:  python3 materials/nt_reference.py            (human table)
      python3 materials/nt_reference.py --json     (compare with: node materials/nt-node.js)
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "assets", "nt-sample.js")

RUNG_LABELS = ["A · copied text", "A + monthly manual sync", "B · relation to one Clients row",
               "B + rollups (rate read at issue)"]


def load():
    txt = open(SRC).read()
    i = txt.index("window.NT_SAMPLE = ") + len("window.NT_SAMPLE = ")
    return json.loads(txt[i:txt.rindex(";")])


D = load()


def canon(cid):
    for c in D["clients"]:
        if c["id"] == cid:
            return c.get("dupOf", cid)
    raise KeyError(cid)


def simulate(rung, n_edits, brk=False):
    edits = D["edits"][:n_edits]
    rel = rung >= 3
    cur = {c["id"]: {"name": c["name"], "rate": c["rate"]} for c in D["clients"]}
    merged = {}
    base_rate = {c["id"]: c["rate"] for c in D["clients"]}

    def truth_rate(cid, w):
        c = canon(cid)
        r = base_rate[c]
        for e in edits:
            if e["type"] == "rate" and e["client"] == c and e["week"] <= w:
                r = e["rate"]
        return r

    def record_of(cid):
        # the client record a row is attached to, after any merge already applied
        return merged.get(cid, cid)

    projects = {}
    tasks = []
    invoices = []
    by_start = {}
    for p in D["projects"]:
        by_start.setdefault(p["start"], []).append(p)
    task_by_project = {}
    for t in D["tasks"]:
        task_by_project.setdefault(t["project"], []).append(t)
    inv_by_week = {}
    for v in D["invoices"]:
        inv_by_week.setdefault(v["week"], []).append(v)

    for w in range(1, D["weeks"] + 1):
        for e in edits:
            if e["week"] != w:
                continue
            if e["type"] == "rate":
                cur[e["client"]]["rate"] = e["rate"]
            elif e["type"] == "rename":
                cur[e["client"]]["name"] = e["name"]
            elif e["type"] == "merge":
                merged[e["client"]] = e["into"]
                if rel:
                    for row in list(projects.values()) + tasks + invoices:
                        if row["rel"] == e["client"]:
                            row["rel"] = e["into"]
        for p in by_start.get(w, []):
            r = record_of(p["client"])
            row = {"id": p["id"], "client": p["client"], "start": p["start"], "end": p["end"],
                   "label": cur[r]["name"], "rate": cur[r]["rate"], "rel": r}
            projects[p["id"]] = row
            for t in task_by_project.get(p["id"], []):
                tasks.append({"id": t["id"], "client": p["client"], "due": t["due"], "done": t["done"],
                              "label": row["label"], "rel": r})
        for v in inv_by_week.get(w, []):
            p = projects[v["project"]]
            rate = cur[p["rel"]]["rate"] if rung == 4 else p["rate"]
            invoices.append({"id": v["id"], "client": p["client"], "week": w, "hours": v["hours"],
                             "label": p["label"], "rate": rate, "rel": p["rel"],
                             "truth": truth_rate(p["client"], w)})
        if rung == 2 and w % D["syncEvery"] == 0:
            for p in projects.values():
                if p["start"] <= w <= p["end"]:
                    r = record_of(p["client"])
                    p["label"] = cur[r]["name"]
                    p["rate"] = cur[r]["rate"]
            for t in tasks:
                if not (t["done"] and t["due"] < w):
                    t["label"] = cur[record_of(t["client"])]["name"]
            for v in invoices:
                if v["week"] > w - D["paidAfter"]:
                    v["label"] = cur[record_of(v["client"])]["name"]

    def shown(row):
        return cur[row["rel"]]["name"] if rel else row["label"]

    def tname(row):
        return cur[canon(row["client"])]["name"]

    allrows = list(projects.values()) + tasks + invoices
    disagree = sum(1 for r in allrows if shown(r) != tname(r))
    stale = sum(1 for v in invoices if v["rate"] != v["truth"])
    misbilled = sum(abs(v["hours"] * (v["rate"] - v["truth"])) for v in invoices)

    q0, q1 = D["q2"]
    qinv = [v for v in invoices if q0 <= v["week"] <= q1]
    db1, tr1 = {}, {}
    for v in qinv:
        db1[shown(v)] = db1.get(shown(v), 0) + v["hours"] * v["rate"]
        tr1[tname(v)] = tr1.get(tname(v), 0) + v["hours"] * v["truth"]
    queries = []
    queries.append(db1 != tr1)
    queries.append(len(set(shown(v) for v in qinv)) != len(set(tname(v) for v in qinv)))
    c2 = cur["C2"]["name"]
    db3 = sum(1 for t in tasks if not t["done"] and shown(t) == c2)
    tr3 = sum(1 for t in tasks if not t["done"] and canon(t["client"]) == "C2")
    queries.append(db3 != tr3)
    queries.append(sum(db1.values()) != sum(tr1.values()))
    wrong5 = False
    for p in projects.values():
        if p["end"] >= D["weeks"]:
            nxt = cur[p["rel"]]["rate"] if rung == 4 else p["rate"]
            if nxt != cur[canon(p["client"])]["rate"]:
                wrong5 = True
    queries.append(wrong5)

    rewritten = sum(1 for v in invoices if v["truth"] != cur[canon(v["client"])]["rate"])

    out = {"rung": rung, "edits": n_edits, "rows": len(allrows), "disagree": disagree,
           "stale": stale, "misbilled": misbilled, "wrongQueries": sum(queries),
           "queries": [1 if q else 0 for q in queries], "q2Revenue": sum(db1.values()),
           "q2Truth": sum(tr1.values()), "liveRollupRewrites": rewritten}

    if brk:
        totals = {}
        for v in invoices:
            c = canon(v["client"])
            totals[c] = totals.get(c, 0) + v["hours"] * v["truth"]
        top = sorted(totals.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
        if rel:
            orphans = [r for r in allrows if r["rel"] == top]
            lost = sum(v["hours"] * v["rate"] for v in qinv if v["rel"] == top)
            out["brk"] = {"client": top, "orphaned": len(orphans), "namingDeleted": 0,
                          "q2Missing": lost}
        else:
            naming = [r for r in allrows if canon(r["client"]) == top]
            out["brk"] = {"client": top, "orphaned": 0, "namingDeleted": len(naming), "q2Missing": 0}
    return out


def giant():
    props = D["props"]
    union = []
    for k in ["client", "project", "task", "invoice"]:
        for p in props[k]:
            if p not in union:
                union.append(p)
    counts = {"client": len(D["clients"]), "project": len(D["projects"]),
              "task": len(D["tasks"]), "invoice": len(D["invoices"])}
    rows = sum(counts.values())
    cells = rows * len(union)
    empty = sum(counts[k] * (len(union) - len(props[k])) for k in counts)
    W = D["weeks"]
    true_overdue = sum(1 for t in D["tasks"] if t["due"] < W and not t["done"])
    caught_invoices = sum(1 for v in D["invoices"] if v["week"] + D["invoiceDue"] < W)
    return {"rows": rows, "properties": len(union), "cells": cells, "empty": empty,
            "emptyPermille": (empty * 1000 + cells // 2) // cells,
            "overdueTrue": true_overdue, "overdueWrong": caught_invoices}


def canon_all():
    out = {"rungs": [], "giant": giant()}
    for r in range(1, 5):
        a = simulate(r, D["defaultEdits"])
        b = simulate(r, D["defaultEdits"], brk=True)
        a["brk"] = b["brk"]
        a["label"] = RUNG_LABELS[r - 1]
        out["rungs"].append(a)
    out["sweep"] = {str(r): [simulate(r, n)["disagree"] for n in range(0, 13)] for r in range(1, 5)}
    out["sweepStale"] = {str(r): [simulate(r, n)["stale"] for n in range(0, 13)] for r in range(1, 5)}
    out["sweepWrong"] = {str(r): [simulate(r, n)["wrongQueries"] for n in range(0, 13)] for r in range(1, 5)}
    return out


if __name__ == "__main__":
    c = canon_all()
    if "--json" in sys.argv:
        print(json.dumps(c, sort_keys=True))
    else:
        for r in c["rungs"]:
            print(r["rung"], r["label"], "disagree", r["disagree"], "/", r["rows"], "stale", r["stale"],
                  "misbilled $", r["misbilled"], "wrong", r["wrongQueries"], r["queries"],
                  "q2", r["q2Revenue"], "vs", r["q2Truth"], "rewrites", r["liveRollupRewrites"], "brk", r["brk"])
        print("giant", c["giant"])
        for k in ["sweep", "sweepStale", "sweepWrong"]:
            print(k, c[k])
