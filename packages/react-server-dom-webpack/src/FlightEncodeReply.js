export function encodeFlightReply(model, options) {
  return JSON.stringify(model, options && options.replacer);
}
