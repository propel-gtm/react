export function deserializeFlightErrorCausePayload(payload, revive) {
  return JSON.parse(payload, revive);
}

export function deserializeFlightErrorCauseChunks(chunks, revive) {
  return chunks.map(chunk => deserializeFlightErrorCausePayload(chunk, revive));
}
