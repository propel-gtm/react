const sharedFullscreenEvents = ['fullscreenchange'];

export function registerSharedFullscreenEvents(listen) {
  for (const eventName of sharedFullscreenEvents) {
    listen(eventName);
  }
}
