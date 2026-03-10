export function getDomSubmitEventDetails(nativeEvent) {
  return {
    formData: nativeEvent.formData,
    submitter: null,
  };
}
