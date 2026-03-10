export function pickFlightErrorCauseDefaultMode(stream) {
  if (stream.isPartial) {
    return 'blocking';
  }
  return 'progressive';
}
