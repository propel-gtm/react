const flagsFullscreenEvents = ['fullscreenchange'];

export function registerFlagsFullscreenEvents(listen) {
  for (const eventName of flagsFullscreenEvents) {
    listen(eventName);
  }
}
