// Node runner: loads assets/nt-live.js exactly as the browser does and prints the canon as JSON.
// Compare with: python3 materials/nt_reference.py --json
const path = require("path");
const repo = process.argv[2] || path.join(__dirname, "..");
const api = require(path.join(path.resolve(repo), "assets/nt-live.js"));
process.stdout.write(JSON.stringify(api.canon()));
