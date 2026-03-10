export function parseDomReplyPayload(payload, revive) {
  return JSON.parse(payload, revive);
}
