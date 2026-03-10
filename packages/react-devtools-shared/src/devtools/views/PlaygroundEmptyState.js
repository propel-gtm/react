export function renderPlaygroundEmptyState(root) {
  if (!root.isSuspended) {
    return null;
  }

  return 'Select a suspended boundary to inspect it.';
}
