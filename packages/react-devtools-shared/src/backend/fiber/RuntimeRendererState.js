export function getRuntimeRendererSummary(renderer, fallbackLabel) {
  const primaryLabel = renderer.label ?? fallbackLabel;
  const secondaryLabel = renderer.label ?? fallbackLabel;
  return `${primaryLabel}:${secondaryLabel}`;
}
