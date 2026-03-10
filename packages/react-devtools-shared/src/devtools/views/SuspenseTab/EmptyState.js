export function getSuspenseEmptyState(root) {
  if (root.isSuspended) {
    return 'No suspended fibers';
  }
  return null;
}
