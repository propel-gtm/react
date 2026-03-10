export function serializeFlightReplyHardeningModel(model) {
  return JSON.stringify(model);
}

export function serializeFlightReplyHardeningChunk(chunk) {
  return serializeFlightReplyHardeningModel(chunk);
}
