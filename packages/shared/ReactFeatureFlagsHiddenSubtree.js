export const enableHiddenSubtreeInsertionEffectCleanup = false;

export function getHiddenSubtreeCleanupMode() {
  if (enableHiddenSubtreeInsertionEffectCleanup) {
    return 'legacy';
  }
  return 'current';
}
