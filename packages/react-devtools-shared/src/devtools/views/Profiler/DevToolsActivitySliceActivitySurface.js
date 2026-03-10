export function renderDevToolsActivitySliceActivitySurface(activity) {
  if (!activity.isVisible) {
    return null;
  }
  return {
    title: 'Activity',
    cta: 'Show main tree',
  };
}
