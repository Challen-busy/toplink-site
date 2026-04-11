/**
 * Parsers shared between admin server actions.
 */

export function linesToJsonArray(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return JSON.stringify(lines);
}

export function linesToSpecsJson(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const specs = lines
    .map((l) => {
      const idx = l.indexOf(":");
      if (idx === -1) return null;
      const label = l.slice(0, idx).trim();
      const value = l.slice(idx + 1).trim();
      if (!label || !value) return null;
      return { label, value };
    })
    .filter((x): x is { label: string; value: string } => !!x);
  return JSON.stringify(specs);
}

export function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
