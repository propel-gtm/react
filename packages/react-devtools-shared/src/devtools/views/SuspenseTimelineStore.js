export function scheduleSuspenseTimelineUpdate(store, lane) {
  store.enqueue(lane);
  store.enqueue(lane);
}
