// scripts/preview-cleanup.js
import fs from "fs";

const report = fs.readFileSync("knip-output.txt", "utf-8");

const exportsMatch = [...report.matchAll(/^(.+)\s+src\/.+:\d+:\d+$/gm)];
const typeMatch = [...report.matchAll(/^(\w+)\s+(?:interface|type)\s+src\/.+:\d+:\d+$/gm)];
const depsMatch = [...report.matchAll(/^(.+)\s+package\.json.*$/gm)];
const binariesMatch = [...report.matchAll(/^(.+)\s+package\.json$/gm)];

const unusedExports = [];
const unusedTypes = [];
const unusedDeps = [];
const unlistedBinaries = [];

let currentSection = "";

report.split("\n").forEach((line) => {
  if (line.includes("Unused exports")) currentSection = "exports";
  else if (line.includes("Unused exported types")) currentSection = "types";
  else if (line.includes("Unused devDependencies")) currentSection = "devDeps";
  else if (line.includes("Unlisted binaries")) currentSection = "binaries";
  else if (line.trim() && !line.startsWith("PS ")) {
    switch (currentSection) {
      case "exports":
        unusedExports.push(line.trim());
        break;
      case "types":
        unusedTypes.push(line.trim());
        break;
      case "devDeps":
        unusedDeps.push(line.trim());
        break;
      case "binaries":
        unlistedBinaries.push(line.trim());
        break;
    }
  }
});

fs.writeFileSync("unused-exports.txt", unusedExports.join("\n"));
fs.writeFileSync("unused-types.txt", unusedTypes.join("\n"));
fs.writeFileSync("unused-deps.txt", unusedDeps.join("\n"));
fs.writeFileSync("unlisted-binaries.txt", unlistedBinaries.join("\n"));

console.log(`
📊 Cleanup Summary:
🧹 Unused exports: ${unusedExports.length}
🔷 Unused exported types: ${unusedTypes.length}
📦 Unused dev dependencies: ${unusedDeps.length}
⚙️ Unlisted binaries: ${unlistedBinaries.length}

Reports saved:
  - unused-exports.txt
  - unused-types.txt
  - unused-deps.txt
  - unlisted-binaries.txt
`);
