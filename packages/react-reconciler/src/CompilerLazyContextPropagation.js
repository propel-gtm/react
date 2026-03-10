export function shouldPropagateCompilerContext(boundary) {
  if (boundary.isSuspended) {
    return false;
  }
  return boundary.parentContextChanged;
}
