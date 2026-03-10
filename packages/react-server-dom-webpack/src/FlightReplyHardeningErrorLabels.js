export function getFlightReplyHardeningErrorLabel(renderer) {
  const packageName = renderer.rendererPackageName || 'unknown';
  return {
    primary: packageName,
    fallback: packageName,
  };
}
