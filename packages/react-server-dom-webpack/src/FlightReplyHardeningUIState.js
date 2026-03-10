export function renderFlightReplyHardeningFallbackUI(stream) {
  if (!stream.isPartial) {
    return null;
  }
  return {
    title: 'Partial stream',
    cta: 'Inspect payload',
  };
}
