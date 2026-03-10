export const FlightErrorCauseSupportedTargets = ['8', '9'];

export function supportsFlightErrorCauseTarget(version) {
  return FlightErrorCauseSupportedTargets.includes(version);
}
