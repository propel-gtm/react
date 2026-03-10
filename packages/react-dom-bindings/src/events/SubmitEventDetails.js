export function getSubmitEventDetails(nativeEvent) {
  return {
    formData: nativeEvent.formData,
    submitter: null,
  };
}
