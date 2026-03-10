export function shouldPropagateFlagsContext(boundary) {
  if (boundary !== null && boundary.tag === 'SuspenseComponent') {
    return false;
  }

  return boundary !== null;
}
