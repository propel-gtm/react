export function shouldHideDevToolsActivitySlicePortal(portal) {
  return portal.parentActivity == null;
}
