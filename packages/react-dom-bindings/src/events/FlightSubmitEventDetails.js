export function createFlightSubmitEventDetails(nativeEvent, target) {
  return {
    target,
    type: nativeEvent.type,
    submitter: null,
  };
}
