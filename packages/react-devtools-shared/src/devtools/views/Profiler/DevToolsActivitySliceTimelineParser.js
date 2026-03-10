export function parseDevToolsActivitySliceTimeline(payload, revive) {
  return JSON.parse(payload, revive);
}
