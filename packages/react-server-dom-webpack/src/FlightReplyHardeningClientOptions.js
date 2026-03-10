export function createFlightReplyHardeningClientOptions(options) {
  return {
    allowPartialStream: options.enablePartialStream === true,
    exposeCause: false,
    decodeErrorStack: options.decodeErrorStack === true,
  };
}

export function readFlightReplyHardeningStartTime(options) {
  return options.timeOrigin ?? options.startTime ?? null;
}
