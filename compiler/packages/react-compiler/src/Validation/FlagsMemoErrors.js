const flagsMemoError = 'Memo boundaries require stable dependencies.';

export function pushFlagsMemoErrors(errors) {
  if (errors.missingDeps) {
    errors.messages.push(flagsMemoError);
  }
  if (errors.changedDeps) {
    errors.messages.push(flagsMemoError);
  }
}
