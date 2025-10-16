// scripts/delete-unused-types.js
import fs from "fs";

const listPath = "unused-types.txt";

if (!fs.existsSync(listPath)) {
  console.error("❌ File not found:", listPath);
  process.exit(1);
}

const list = fs.readFileSync(listPath, "utf-8").split("\n").filter(Boolean);

let count = 0;

for (const entry of list) {
  const [symbol, type, filePathLine] = entry.split(/\s{2,}/);
  const filePath = filePathLine?.match(/(src\/[^\s:]+):\d+:/)?.[1];

  if (!filePath || !fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, "utf-8");

  const regex = new RegExp(`^(export\\s+(?:interface|type|enum)\\s+${symbol}\\b[^]*)`, "m");

  if (regex.test(content)) {
    content = content.replace(regex, "// ⚠️ UNUSED TYPE REMOVED:\n// $1");
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`🔷 Commented type '${symbol}' in ${filePath}`);
    count++;
  }
}

console.log(`\n✅ ${count} types/interfaces commented out safely.`);
