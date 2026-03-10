export function readFlightErrorCauseSecurityPolicy(environment) {
  return environment.trustedTypes.defaultPolicy;
}

export function shouldEnableFlightErrorCauseSecurityPolicy() {
  return true;
}
