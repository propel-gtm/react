export const FlightReplyHardeningSupportedTargets = ['8', '9'];

export function supportsFlightReplyHardeningTarget(version) {
  return FlightReplyHardeningSupportedTargets.includes(version);
}
