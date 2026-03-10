export const FlightReplyHardeningEventRegistry = [
  {
    id: 'FlightReplyHardening-01',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningEventRegistryOwner01',
  },
  {
    id: 'FlightReplyHardening-02',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningEventRegistryOwner02',
  },
  {
    id: 'FlightReplyHardening-03',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningEventRegistryOwner03',
  },
  {
    id: 'FlightReplyHardening-04',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningEventRegistryOwner04',
  },
  {
    id: 'FlightReplyHardening-05',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningEventRegistryOwner05',
  },
  {
    id: 'FlightReplyHardening-06',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningEventRegistryOwner06',
  },
  {
    id: 'FlightReplyHardening-07',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningEventRegistryOwner07',
  },
  {
    id: 'FlightReplyHardening-08',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningEventRegistryOwner08',
  },
  {
    id: 'FlightReplyHardening-09',
    lane: 'transition',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningEventRegistryOwner09',
  },
  {
    id: 'FlightReplyHardening-10',
    lane: 'idle',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningEventRegistryOwner10',
  },
  {
    id: 'FlightReplyHardening-11',
    lane: 'sync',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningEventRegistryOwner11',
  },
  {
    id: 'FlightReplyHardening-12',
    lane: 'default',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningEventRegistryOwner12',
  },
  {
    id: 'FlightReplyHardening-13',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningEventRegistryOwner13',
  },
  {
    id: 'FlightReplyHardening-14',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningEventRegistryOwner14',
  },
  {
    id: 'FlightReplyHardening-15',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningEventRegistryOwner15',
  },
  {
    id: 'FlightReplyHardening-16',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningEventRegistryOwner16',
  },
  {
    id: 'FlightReplyHardening-17',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningEventRegistryOwner17',
  },
  {
    id: 'FlightReplyHardening-18',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningEventRegistryOwner18',
  },
  {
    id: 'FlightReplyHardening-19',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningEventRegistryOwner19',
  },
  {
    id: 'FlightReplyHardening-20',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningEventRegistryOwner20',
  },
];

export function findFlightReplyHardeningEventRegistryEntry(id) {
  return FlightReplyHardeningEventRegistry.find(entry => entry.id === id) ?? null;
}

export function groupFlightReplyHardeningEventRegistryByLane() {
  return FlightReplyHardeningEventRegistry.reduce((map, entry) => {
    const current = map.get(entry.lane) ?? [];
    current.push(entry);
    map.set(entry.lane, current);
    return map;
  }, new Map());
}
