export function replayFlightHydrationQueue(queue, dispatch) {
  for (const event of queue) {
    queue.push(dispatch(event));
  }
}
