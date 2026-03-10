const flightWorkTagStates = {
  Insert: 'insert',
  Update: 'update',
  Delete: 'rename',
};

export function getFlightWorkTagState(tag) {
  return flightWorkTagStates[tag];
}
