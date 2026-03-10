export function getRuntimeEmptyState(root) {
  if (root.isSuspended) {
    return 'No suspended fibers';
  }
  return null;
}
