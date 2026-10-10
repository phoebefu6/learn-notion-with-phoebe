/* nt-live.js - the drift bench for learn-notion-with-phoebe.
   CONSTRUCTED workspace (assets/nt-sample.js): Ines is fictional, every client is invented.
   The counts are computed for real on those rows, in integers; materials/nt_reference.py
   recomputes every one independently and must agree exactly (node materials/nt-node.js).
   What is modelled: Ines's habits (what she copies, what her monthly sync can see). */
(function (root) {
  "use strict";
  var D = root.NT_SAMPLE;
  if (!D && typeof require === "function") {
    var fs = require("fs"), path = require("path");
    var txt = fs.readFileSync(path.join(__dirname, "nt-sample.js"), "utf8");
    var k = "window.NT_SAMPLE = ";
    D = JSON.parse(txt.slice(txt.indexOf(k) + k.length, txt.lastIndexOf(";")));
  }

  var RUNGS = ["A · copied text", "A + monthly manual sync", "B · relation to one Clients row",
    "B + rollups (rate read at issue)"];

  var CL = {};
  D.clients.forEach(function (c) { CL[c.id] = c; });
  function canon(cid) { return CL[cid].dupOf || cid; }

  function simulate(rung, nEdits, brk) {
    var edits = D.edits.slice(0, nEdits), rel = rung >= 3;
    var cur = {}, merged = {}, base = {};
    D.clients.forEach(function (c) { cur[c.id] = { name: c.name, rate: c.rate }; base[c.id] = c.rate; });
    function truthRate(cid, w) {
      var c = canon(cid), r = base[c];
      edits.forEach(function (e) { if (e.type === "rate" && e.client === c && e.week <= w) r = e.rate; });
      return r;
    }
    function recordOf(cid) { return merged[cid] || cid; }
    var projects = {}, plist = [], tasks = [], invoices = [];
    var byStart = {}, tByP = {}, invByW = {};
    D.projects.forEach(function (p) { (byStart[p.start] = byStart[p.start] || []).push(p); });
    D.tasks.forEach(function (t) { (tByP[t.project] = tByP[t.project] || []).push(t); });
    D.invoices.forEach(function (v) { (invByW[v.week] = invByW[v.week] || []).push(v); });

    for (var w = 1; w <= D.weeks; w++) {
      edits.forEach(function (e) {
        if (e.week !== w) return;
        if (e.type === "rate") cur[e.client].rate = e.rate;
        else if (e.type === "rename") cur[e.client].name = e.name;
        else if (e.type === "merge") {
          merged[e.client] = e.into;
          if (rel) plist.concat(tasks, invoices).forEach(function (row) { if (row.rel === e.client) row.rel = e.into; });
        }
      });
      (byStart[w] || []).forEach(function (p) {
        var r = recordOf(p.client);
        var row = { id: p.id, client: p.client, start: p.start, end: p.end, label: cur[r].name, rate: cur[r].rate, rel: r };
        projects[p.id] = row; plist.push(row);
        (tByP[p.id] || []).forEach(function (t) {
          tasks.push({ id: t.id, client: p.client, due: t.due, done: t.done, label: row.label, rel: r });
        });
      });
      (invByW[w] || []).forEach(function (v) {
        var p = projects[v.project];
        var rate = rung === 4 ? cur[p.rel].rate : p.rate;
        invoices.push({ id: v.id, client: p.client, week: w, hours: v.hours, label: p.label, rate: rate, rel: p.rel, truth: truthRate(p.client, w) });
      });
      if (rung === 2 && w % D.syncEvery === 0) {
        plist.forEach(function (p) {
          if (p.start <= w && w <= p.end) { var r = recordOf(p.client); p.label = cur[r].name; p.rate = cur[r].rate; }
        });
        tasks.forEach(function (t) { if (!(t.done && t.due < w)) t.label = cur[recordOf(t.client)].name; });
        invoices.forEach(function (v) { if (v.week > w - D.paidAfter) v.label = cur[recordOf(v.client)].name; });
      }
    }

    function shown(row) { return rel ? cur[row.rel].name : row.label; }
    function tname(row) { return cur[canon(row.client)].name; }
    var all = plist.concat(tasks, invoices);
    var disagree = 0, stale = 0, misbilled = 0;
    all.forEach(function (r) { if (shown(r) !== tname(r)) disagree++; });
    invoices.forEach(function (v) { if (v.rate !== v.truth) { stale++; } misbilled += Math.abs(v.hours * (v.rate - v.truth)); });

    var q0 = D.q2[0], q1 = D.q2[1];
    var qinv = invoices.filter(function (v) { return v.week >= q0 && v.week <= q1; });
    var db1 = {}, tr1 = {}, dbSum = 0, trSum = 0;
    qinv.forEach(function (v) {
      db1[shown(v)] = (db1[shown(v)] || 0) + v.hours * v.rate; dbSum += v.hours * v.rate;
      tr1[tname(v)] = (tr1[tname(v)] || 0) + v.hours * v.truth; trSum += v.hours * v.truth;
    });
    function sameMap(a, b) {
      var ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      return ka.every(function (k) { return b.hasOwnProperty(k) && b[k] === a[k]; });
    }
    function distinct(arr) { var s = {}; arr.forEach(function (x) { s[x] = 1; }); return Object.keys(s).length; }
    var q = [];
    q.push(!sameMap(db1, tr1));
    q.push(distinct(qinv.map(shown)) !== distinct(qinv.map(tname)));
    var c2 = cur.C2.name, db3 = 0, tr3 = 0;
    tasks.forEach(function (t) { if (!t.done && shown(t) === c2) db3++; if (!t.done && canon(t.client) === "C2") tr3++; });
    q.push(db3 !== tr3);
    q.push(dbSum !== trSum);
    var wrong5 = false;
    plist.forEach(function (p) {
      if (p.end >= D.weeks) {
        var nxt = rung === 4 ? cur[p.rel].rate : p.rate;
        if (nxt !== cur[canon(p.client)].rate) wrong5 = true;
      }
    });
    q.push(wrong5);
    var rewrites = 0;
    invoices.forEach(function (v) { if (v.truth !== cur[canon(v.client)].rate) rewrites++; });

    var out = { rung: rung, edits: nEdits, rows: all.length, disagree: disagree, stale: stale, misbilled: misbilled,
      wrongQueries: q.filter(Boolean).length, queries: q.map(function (x) { return x ? 1 : 0; }),
      q2Revenue: dbSum, q2Truth: trSum, liveRollupRewrites: rewrites, names: {} };
    ["C1", "C2", "C3", "C4", "C5", "C6"].forEach(function (c) { out.names[c] = cur[c].name; });

    if (brk) {
      var totals = {};
      invoices.forEach(function (v) { var c = canon(v.client); totals[c] = (totals[c] || 0) + v.hours * v.truth; });
      var top = Object.keys(totals).sort(function (a, b) { return totals[b] - totals[a] || (a < b ? -1 : 1); })[0];
      if (rel) {
        var orph = all.filter(function (r) { return r.rel === top; }).length, lost = 0;
        qinv.forEach(function (v) { if (v.rel === top) lost += v.hours * v.rate; });
        out.brk = { client: top, orphaned: orph, namingDeleted: 0, q2Missing: lost };
      } else {
        out.brk = { client: top, orphaned: 0, namingDeleted: all.filter(function (r) { return canon(r.client) === top; }).length, q2Missing: 0 };
      }
    }
    return out;
  }

  function giant() {
    var P = D.props, union = [];
    ["client", "project", "task", "invoice"].forEach(function (k) { P[k].forEach(function (p) { if (union.indexOf(p) < 0) union.push(p); }); });
    var counts = { client: D.clients.length, project: D.projects.length, task: D.tasks.length, invoice: D.invoices.length };
    var rows = 0, empty = 0;
    Object.keys(counts).forEach(function (k) { rows += counts[k]; empty += counts[k] * (union.length - P[k].length); });
    var cells = rows * union.length;
    var trueOver = D.tasks.filter(function (t) { return t.due < D.weeks && !t.done; }).length;
    var wrong = D.invoices.filter(function (v) { return v.week + D.invoiceDue < D.weeks; }).length;
    return { rows: rows, properties: union.length, cells: cells, empty: empty,
      emptyPermille: Math.floor((empty * 1000 + Math.floor(cells / 2)) / cells), overdueTrue: trueOver, overdueWrong: wrong };
  }

  function canonAll() {
    var out = { rungs: [], giant: giant(), sweep: {}, sweepStale: {}, sweepWrong: {} };
    for (var r = 1; r <= 4; r++) {
      var a = simulate(r, D.defaultEdits, false), b = simulate(r, D.defaultEdits, true);
      a.brk = b.brk; a.label = RUNGS[r - 1]; delete a.names;
      out.rungs.push(a);
      var s1 = [], s2 = [], s3 = [];
      for (var n = 0; n <= 12; n++) { var x = simulate(r, n, false); s1.push(x.disagree); s2.push(x.stale); s3.push(x.wrongQueries); }
      out.sweep[String(r)] = s1; out.sweepStale[String(r)] = s2; out.sweepWrong[String(r)] = s3;
    }
    return out;
  }

  /* ---------------- widget ---------------- */
  var QNAMES = ["Revenue by client this quarter", "How many clients billed this quarter",
    "Open tasks for Brightwell", "Total billed this quarter", "Rate the next invoice will use"];
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function money(x) { return "$" + Math.round(x).toLocaleString("en-US"); }
  var rootEl, els = {}, state = { rung: 1, anti: false, brk: false, n: D.defaultEdits };

  var RUNNING = {};
  D.clients.forEach(function (c) { RUNNING[c.id] = c.name; });
  var EDIT_NAMES = D.edits.map(function (e) {
    var before = RUNNING[e.client];
    if (e.type === "rename") RUNNING[e.client] = e.name;
    return before;
  });
  function editText(e, i) {
    var nm = EDIT_NAMES[i];
    if (e.type === "rate") return "week " + e.week + " · " + nm + " rate to $" + e.rate + "/h";
    if (e.type === "rename") return "week " + e.week + " · " + nm + " renamed " + e.name;
    return "week " + e.week + " · duplicate “" + nm + "” merged into " + CL[e.into].name;
  }

  function render() {
    var r = simulate(state.rung, state.n, state.brk), g = giant();
    els.rungs.forEach(function (l, i) { l.classList.toggle("is-on", i + 1 === state.rung); l.querySelector("input").checked = i + 1 === state.rung; });
    els.anti.classList.toggle("is-on", state.anti); els.brk.classList.toggle("is-on", state.brk);
    els.nOut.textContent = state.n + " of 12";
    var v, cls;
    if (state.anti) {
      var r1 = simulate(1, state.n, false);
      v = "Constructed anti-lever. One giant table with every property: " + (g.emptyPermille / 10).toFixed(1) + "% of its " + g.cells.toLocaleString("en-US") +
        " cells are empty, the “Overdue tasks” view catches " + g.overdueWrong + " invoices beside " + g.overdueTrue + " real tasks, and client names are still copies: " +
        r1.disagree + " rows disagree, " + r1.wrongQueries + " of 5 questions wrong.";
      cls = "is-bad";
    } else if (state.brk) {
      v = "Constructed. Rung " + state.rung + ": the " + r.names[r.brk.client] + " row is deleted. " +
        (state.rung >= 3 ? r.brk.orphaned + " rows lose their client (orphaned), and " + money(r.brk.q2Missing) + " of this quarter's revenue drops out of every by-client total."
          : "No relation to break, so 0 rows are orphaned, but " + r.brk.namingDeleted + " rows still name a client with no page, and nothing warns you.");
      cls = "is-bad";
    } else {
      v = "Constructed. Rung " + state.rung + " after " + state.n + " edits: " + r.disagree + " of " + r.rows + " rows disagree with the truth, " + r.stale +
        " invoices billed at a stale rate, " + r.wrongQueries + " of 5 questions answered wrong." +
        (state.rung === 4 && r.liveRollupRewrites ? " A live rollup with no freeze would have rewritten " + r.liveRollupRewrites + " past invoices." : "");
      cls = r.wrongQueries === 0 && r.disagree === 0 ? "is-good" : (state.rung === 1 ? "is-bad" : "is-ok");
    }
    els.verdict.className = "mb-verdict " + cls; els.verdict.textContent = v;

    function metric(label, val, unit) {
      return '<div class="mb-metric"><span class="mb-mkind is-measured">counted</span><span class="mb-mlabel">' + esc(label) + '</span><span class="mb-mvalue">' + esc(val) + '</span><span class="mb-munit">' + esc(unit) + '</span></div>';
    }
    if (state.anti) {
      var r1b = simulate(1, state.n, false);
      els.metrics.innerHTML =
        metric("Empty cells", (g.emptyPermille / 10).toFixed(1) + "%", g.empty.toLocaleString("en-US") + " of " + g.cells.toLocaleString("en-US") + " (" + g.rows + " rows x " + g.properties + " properties)") +
        metric("Rows wrongly in “Overdue tasks”", String(g.overdueWrong), "invoices with a Due date and no Done tick; " + g.overdueTrue + " real overdue tasks") +
        metric("Rows disagreeing with the truth", String(r1b.disagree), "names are still copied text, as on rung 1") +
        metric("Questions answered wrong", r1b.wrongQueries + " of 5", "same as rung 1: one table fixes nothing about copies");
    } else {
      els.metrics.innerHTML =
        metric("Rows disagreeing with the truth", String(r.disagree), "of " + r.rows + " projects, tasks and invoices") +
        metric("Invoices billed at a stale rate", String(r.stale), money(r.misbilled) + " billed off the contract rate") +
        metric("Questions answered wrong", r.wrongQueries + " of 5", "revenue this quarter: " + money(r.q2Revenue) + " shown, " + money(r.q2Truth) + " true") +
        (state.brk ? metric(state.rung >= 3 ? "Orphaned rows" : "Rows naming a deleted client", String(state.rung >= 3 ? r.brk.orphaned : r.brk.namingDeleted), "after deleting " + r.names[r.brk.client]) :
          metric("Past invoices a live rollup would rewrite", String(r.liveRollupRewrites), "why rung 4 reads the rate once, at issue"));
    }
    var qs = state.anti ? simulate(1, state.n, false).queries : r.queries;
    els.qlist.innerHTML = QNAMES.map(function (n, i) {
      return '<li class="' + (qs[i] ? "nt-wrong" : "nt-right") + '"><span>' + (qs[i] ? "wrong" : "right") + "</span>" + esc(n) + "</li>";
    }).join("");
    els.elist.innerHTML = D.edits.map(function (e, i) {
      return '<li class="' + (i < state.n ? "is-on" : "") + '">' + esc(editText(e, i)) + "</li>";
    }).join("");
  }

  function buildUI() {
    rootEl.innerHTML = "";
    var panel = document.createElement("div"); panel.className = "mb-presets"; els.rungs = [];
    var notes = ["Client name and rate typed into every project, task and invoice when it is created.",
      "Rung 1, plus a find-and-replace every 4 weeks across the rows her views show: active projects, open tasks, unpaid invoices.",
      "Every row relates to one Clients row and shows its name. Rates are still typed on each project.",
      "Rung 3, plus the invoice reads the rate from the client row through a rollup when it is issued, then keeps it."];
    RUNGS.forEach(function (g, i) {
      var l = document.createElement("label"); l.className = "mb-preset";
      l.innerHTML = '<input type="radio" name="nt-rung" value="' + (i + 1) + '"><span class="mb-pname">' + (i + 1) + " · " + esc(g) + '</span><span class="mb-pnote">' + esc(notes[i]) + "</span>";
      l.querySelector("input").addEventListener("change", function () { state.rung = i + 1; render(); });
      panel.appendChild(l); els.rungs.push(l);
    });
    rootEl.appendChild(panel);
    var toggles = document.createElement("div"); toggles.className = "mb-presets";
    function tog(id, name, note, key) {
      var l = document.createElement("label"); l.className = "mb-preset is-anti";
      l.innerHTML = '<input type="checkbox" id="' + id + '"><span class="mb-pname">' + esc(name) + '</span><span class="mb-pnote">' + esc(note) + "</span>";
      l.querySelector("input").addEventListener("change", function (e) { state[key] = e.target.checked; render(); });
      toggles.appendChild(l); return l;
    }
    els.anti = tog("nt-anti", "One giant table with every property (anti-lever)", "Clients, projects, tasks and invoices as rows of one database, a Type column, every property on every row.", "anti");
    els.brk = tog("nt-brk", "Delete the biggest client's row (break)", "Deletes the Clients row with the most revenue. Prints what is left pointing at nothing.", "brk");
    rootEl.appendChild(toggles);
    var row = document.createElement("div"); row.className = "ab-caprow";
    row.innerHTML = '<label for="nt-n">Edits applied</label><input type="range" id="nt-n" min="0" max="12" step="1" value="' + state.n + '"><output id="nt-nout"></output>';
    rootEl.appendChild(row);
    els.nOut = row.querySelector("#nt-nout");
    row.querySelector("#nt-n").addEventListener("input", function (e) { state.n = +e.target.value; render(); });
    els.verdict = document.createElement("p"); rootEl.appendChild(els.verdict);
    els.metrics = document.createElement("div"); els.metrics.className = "mb-metrics"; rootEl.appendChild(els.metrics);
    var grid = document.createElement("div"); grid.className = "nt-grid";
    var c1 = document.createElement("div"); c1.className = "ab-card";
    c1.innerHTML = '<h4>Five questions the workspace must answer</h4>';
    els.qlist = document.createElement("ul"); els.qlist.className = "nt-qlist"; c1.appendChild(els.qlist);
    var c2 = document.createElement("div"); c2.className = "ab-card";
    c2.innerHTML = '<h4>The edits, in order <span class="mb-mkind is-heuristic">constructed</span></h4>';
    els.elist = document.createElement("ol"); els.elist.className = "nt-elist"; c2.appendChild(els.elist);
    grid.appendChild(c1); grid.appendChild(c2); rootEl.appendChild(grid);
    var hint = document.createElement("p"); hint.className = "mb-hint";
    hint.textContent = "Constructed, not observed: Ines and her clients are invented (seed " + D.seed + "), " + (D.clients.length + D.projects.length + D.tasks.length + D.invoices.length) +
      " rows over 26 weeks. The counts are computed on those rows; what is modelled is Ines's habits, what she copies and what her sync can see. " +
      "“The truth” is each client's current name and the contract rate in force on an invoice's week. The break treats a deleted page as gone; Notion keeps it in Trash for 30 days, and restoring it is the fix. " +
      "A Python reference in the repository reproduces every count exactly.";
    rootEl.appendChild(hint);
    render();
  }

  function init() {
    rootEl = document.getElementById("drift-bench");
    if (!rootEl) return;
    buildUI();
    root.NT_LIVE = { set: function (rung, n, anti, brk) {
      state.rung = rung; state.n = n === undefined ? D.defaultEdits : n; state.anti = !!anti; state.brk = !!brk;
      var a = document.getElementById("nt-anti"), b = document.getElementById("nt-brk"), s = document.getElementById("nt-n");
      if (a) a.checked = state.anti; if (b) b.checked = state.brk; if (s) s.value = state.n; render();
    }, state: state };
  }

  var api = { D: D, RUNGS: RUNGS, simulate: simulate, giant: giant, canon: canonAll };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})(typeof window !== "undefined" ? window : this);
