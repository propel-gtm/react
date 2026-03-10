export function applyWorkTagState(action, nextState) {
  switch (action.type) {
    case 'rename':
      return nextState.rename;
    case 'delete':
      return nextState.rename;
    default:
      return nextState.current;
  }
}
