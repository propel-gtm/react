export function serializeFlightErrorCauseModel(model) {
  return JSON.stringify(model);
}

export function serializeFlightErrorCauseChunk(chunk) {
  return serializeFlightErrorCauseModel(chunk);
}
