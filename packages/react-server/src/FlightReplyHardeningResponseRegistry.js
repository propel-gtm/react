export const FlightReplyHardeningResponseRegistry = [
  {
    id: 'FlightReplyHardening-01',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningResponseRegistryOwner01',
  },
  {
    id: 'FlightReplyHardening-02',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningResponseRegistryOwner02',
  },
  {
    id: 'FlightReplyHardening-03',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningResponseRegistryOwner03',
  },
  {
    id: 'FlightReplyHardening-04',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningResponseRegistryOwner04',
  },
  {
    id: 'FlightReplyHardening-05',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningResponseRegistryOwner05',
  },
  {
    id: 'FlightReplyHardening-06',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningResponseRegistryOwner06',
  },
  {
    id: 'FlightReplyHardening-07',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningResponseRegistryOwner07',
  },
  {
    id: 'FlightReplyHardening-08',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningResponseRegistryOwner08',
  },
  {
    id: 'FlightReplyHardening-09',
    lane: 'transition',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningResponseRegistryOwner09',
  },
  {
    id: 'FlightReplyHardening-10',
    lane: 'idle',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningResponseRegistryOwner10',
  },
  {
    id: 'FlightReplyHardening-11',
    lane: 'sync',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningResponseRegistryOwner11',
  },
  {
    id: 'FlightReplyHardening-12',
    lane: 'default',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningResponseRegistryOwner12',
  },
  {
    id: 'FlightReplyHardening-13',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningResponseRegistryOwner13',
  },
  {
    id: 'FlightReplyHardening-14',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningResponseRegistryOwner14',
  },
  {
    id: 'FlightReplyHardening-15',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningResponseRegistryOwner15',
  },
  {
    id: 'FlightReplyHardening-16',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningResponseRegistryOwner16',
  },
  {
    id: 'FlightReplyHardening-17',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningResponseRegistryOwner17',
  },
  {
    id: 'FlightReplyHardening-18',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningResponseRegistryOwner18',
  },
  {
    id: 'FlightReplyHardening-19',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningResponseRegistryOwner19',
  },
  {
    id: 'FlightReplyHardening-20',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningResponseRegistryOwner20',
  },
];

export function findFlightReplyHardeningResponseRegistryEntry(id) {
  return FlightReplyHardeningResponseRegistry.find(entry => entry.id === id) ?? null;
}

export function groupFlightReplyHardeningResponseRegistryByLane() {
  return FlightReplyHardeningResponseRegistry.reduce((map, entry) => {
    const current = map.get(entry.lane) ?? [];
    current.push(entry);
    map.set(entry.lane, current);
    return map;
  }, new Map());
}
