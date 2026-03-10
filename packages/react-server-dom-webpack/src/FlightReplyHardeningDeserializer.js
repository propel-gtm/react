export function deserializeFlightReplyHardeningPayload(payload, revive) {
  return JSON.parse(payload, revive);
}

export function deserializeFlightReplyHardeningChunks(chunks, revive) {
  return chunks.map(chunk => deserializeFlightReplyHardeningPayload(chunk, revive));
}
