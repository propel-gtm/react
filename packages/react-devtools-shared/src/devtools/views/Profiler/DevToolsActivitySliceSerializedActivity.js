export function serializeDevToolsActivitySliceActivity(error) {
  return {
    message: error.message,
    stack: error.stack,
  };
}
