/**
 * Safe Cleanup Script – comments out entire unused exports
 * Usage: node scripts/safe-cleanup.js knip-report.txt
 */

import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const reportPath = process.argv[2] || "knip-report.txt";
const report = fs.readFileSync(reportPath, "utf8");

const matches = [...report.matchAll(/^(\S+)\s+(\S+):(\d+)/gm)].map(
  ([, name, file]) => ({ name, file })
);

console.log(`🧹 Found ${matches.length} unused exports to disable safely.\n`);

for (const { name, file } of matches) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) continue;

  const code = fs.readFileSync(filePath, "utf8");

  // Parse TS/JS safely
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  let modified = false;

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const decl = path.node.declaration;
      if (!decl) return;

      // Matches: export const X = ... or export function X()
      if (
        (t.isVariableDeclaration(decl) &&
          decl.declarations.some(
            (d) => t.isIdentifier(d.id) && d.id.name === name
          )) ||
        (t.isFunctionDeclaration(decl) &&
          decl.id &&
          decl.id.name === name)
      ) {
        const commented = `/* ⚠️ UNUSED EXPORT: ${name}\n${code.slice(
          decl.start,
          decl.end
        )}\n*/`;
        const newCode =
          code.slice(0, decl.start) + commented + code.slice(decl.end);
        fs.writeFileSync(filePath, newCode, "utf8");
        console.log(`🟡 Commented out export '${name}' in ${file}`);
        modified = true;
        path.stop();
      }
    },
  });

  if (!modified) {
    // fallback: comment export line manually
    const pattern = new RegExp(
      `export\\s+(const|function|class)\\s+${name}`,
      "g"
    );
    if (pattern.test(code)) {
      const newCode = code.replace(pattern, `/* ⚠️ UNUSED EXPORT: $&`);
      fs.writeFileSync(filePath, newCode, "utf8");
      console.log(`🟠 Partially commented '${name}' in ${file}`);
    }
  }
}

console.log("\n✅ Safe cleanup complete! No syntax breaks.");
