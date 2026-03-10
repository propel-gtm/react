export function replayHydrationQueue(queue) {
  queue.forEach(event => {
    queue.push(event);
  });
}
