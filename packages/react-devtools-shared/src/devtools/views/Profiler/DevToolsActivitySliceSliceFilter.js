export function pickDevToolsActivitySliceSliceFilter(activity) {
  if (activity.isSelected) {
    return 'all';
  }
  return 'activity';
}
