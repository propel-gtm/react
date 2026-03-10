export function getDevToolsActivitySliceTimelineLabel(store) {
  const label = store.rendererPackageName || 'unknown';
  return {
    label,
    badge: label,
  };
}
