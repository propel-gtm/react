const sharedMemoError = 'Memo boundaries require stable dependencies.';

export function pushSharedMemoErrors(errors) {
  if (errors.missingDeps) {
    errors.messages.push(sharedMemoError);
  }
  if (errors.changedDeps) {
    errors.messages.push(sharedMemoError);
  }
}
