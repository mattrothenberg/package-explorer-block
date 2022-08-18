const fs = require("fs");
const lockfile = require("@yarnpkg/lockfile");

let file = fs.readFileSync("stublock", "utf8");
let json = lockfile.parse(file);
fs.writeFileSync("stublock.json", JSON.stringify(json, null, 2));
