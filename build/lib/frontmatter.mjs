// Minimal front matter: a leading `---` block of flat `key: value` lines.
// Deliberately not YAML — no nesting, no quoting rules, no dependency.
export function parseFrontMatter(raw) {
  const meta = {};
  if (!raw.startsWith("---\n")) return { meta, body: raw };
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return { meta, body: raw };
  for (const line of raw.slice(4, end).split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key) meta[key] = value;
  }
  const body = raw.slice(end + 4).replace(/^\n/, "");
  return { meta, body };
}
