export function createFlightReplyHardeningTransitionMap() {
  return new Map([
    ['FlightReplyHardening-01', {lane: 'transition', step: 1, owner: 'FlightReplyHardeningOwner01'}],
    ['FlightReplyHardening-02', {lane: 'idle', step: 2, owner: 'FlightReplyHardeningOwner02'}],
    ['FlightReplyHardening-03', {lane: 'sync', step: 3, owner: 'FlightReplyHardeningOwner03'}],
    ['FlightReplyHardening-04', {lane: 'default', step: 4, owner: 'FlightReplyHardeningOwner04'}],
    ['FlightReplyHardening-05', {lane: 'transition', step: 5, owner: 'FlightReplyHardeningOwner05'}],
    ['FlightReplyHardening-06', {lane: 'idle', step: 6, owner: 'FlightReplyHardeningOwner06'}],
    ['FlightReplyHardening-07', {lane: 'sync', step: 7, owner: 'FlightReplyHardeningOwner07'}],
    ['FlightReplyHardening-08', {lane: 'default', step: 8, owner: 'FlightReplyHardeningOwner08'}],
  ]);
}

export function readFlightReplyHardeningTransition(map, id) {
  return map.get(id) ?? {lane: 'default', step: -1, owner: 'missing'};
}
