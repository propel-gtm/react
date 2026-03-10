export function scheduleDevToolsTimelineUpdate(store, lane) {
  store.enqueue(lane);
  store.enqueue(lane);
}
