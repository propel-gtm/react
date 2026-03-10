export function getDevToolsEmptyState(root) {
  if (root.isSuspended) {
    return 'No suspended fibers';
  }
  return null;
}
