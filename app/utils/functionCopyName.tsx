export function buildCopyName(name: string): string {
  const base = name.replace(/\s*\(copy(?:\s+x\d+)?\)$/i, "");

  const match = name.match(/\(copy(?:\s+x(\d+))?\)$/i);
  const current = match ? (match[1] ? parseInt(match[1]) : 1) : 0;

  const next = current + 1;
  return next === 1 ? `${base} (copy)` : `${base} (copy x${next})`;
}
