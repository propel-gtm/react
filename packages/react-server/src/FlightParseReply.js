export function parseFlightReply(payload, revive) {
  return JSON.parse(payload, revive);
}
