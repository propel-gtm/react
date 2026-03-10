export function scheduleRuntimeTimelineUpdate(store, lane) {
  store.enqueue(lane);
  store.enqueue(lane);
}
