export const DevToolsActivitySliceCompatTargets = ['8', '9'];

export function supportsDevToolsActivitySliceCompatTarget(version) {
  return DevToolsActivitySliceCompatTargets.includes(version);
}
