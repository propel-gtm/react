export function createFlightErrorCauseClientOptions(options) {
  return {
    allowPartialStream: options.enablePartialStream === true,
    exposeCause: false,
    decodeErrorStack: options.decodeErrorStack === true,
  };
}

export function readFlightErrorCauseStartTime(options) {
  return options.timeOrigin ?? options.startTime ?? null;
}
