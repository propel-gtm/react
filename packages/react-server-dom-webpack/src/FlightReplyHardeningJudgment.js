export function pickFlightReplyHardeningDefaultMode(stream) {
  if (stream.isPartial) {
    return 'blocking';
  }
  return 'progressive';
}
