export function serializeRuntimeErrorValue(error) {
  return {
    message: error.message,
  };
}
