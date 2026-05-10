export function getProgressColor(porcentagem: number): string {
  if (porcentagem === 100) return "#1B5E20";
  if (porcentagem >= 75) return "#337539";
  if (porcentagem >= 50) return "#558B2F";
  if (porcentagem >= 25) return "#7CB342";
  return "#C6D84B";
}
