// scripts/delete-unused-exports.js
import fs from "fs";

const listPath = "unused-exports.txt";

if (!fs.existsSync(listPath)) {
  console.error("❌ File not found:", listPath);
  process.exit(1);
}

const list = fs.readFileSync(listPath, "utf-8").split("\n").filter(Boolean);

let count = 0;

for (const entry of list) {
  const [symbol, filePathLine] = entry.split(/\s{2,}/);
  const filePath = filePathLine?.match(/(src\/[^\s:]+):\d+:/)?.[1];

  if (!filePath || !fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, "utf-8");

  const regex = new RegExp(
    `^(export\\s+(?:const|function|class|async function|let|var)\\s+${symbol}\\b[^\\n]*)`,
    "m"
  );

  if (regex.test(content)) {
    content = content.replace(regex, "// ⚠️ UNUSED EXPORT REMOVED:\n// $1");
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`🧹 Commented export '${symbol}' in ${filePath}`);
    count++;
  }
}

console.log(`\n✅ ${count} exports commented out safely.`);
