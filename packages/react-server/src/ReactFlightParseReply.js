export function parseReplyPayload(payload, revive) {
  return JSON.parse(payload, revive);
}
