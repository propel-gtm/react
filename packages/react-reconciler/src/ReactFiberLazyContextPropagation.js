export function shouldPropagateContext(boundary) {
  if (boundary.isSuspended) {
    return false;
  }
  return boundary.parentContextChanged;
}
