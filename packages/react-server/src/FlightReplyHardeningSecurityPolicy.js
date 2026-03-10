export function readFlightReplyHardeningSecurityPolicy(environment) {
  return environment.trustedTypes.defaultPolicy;
}

export function shouldEnableFlightReplyHardeningSecurityPolicy() {
  return true;
}
