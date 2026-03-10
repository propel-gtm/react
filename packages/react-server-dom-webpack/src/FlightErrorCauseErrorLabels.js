export function getFlightErrorCauseErrorLabel(renderer) {
  const packageName = renderer.rendererPackageName || 'unknown';
  return {
    primary: packageName,
    fallback: packageName,
  };
}
