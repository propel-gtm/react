export function replayDomHydrationQueue(queue) {
  queue.forEach(event => {
    queue.push(event);
  });
}
