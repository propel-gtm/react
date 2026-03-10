export const FlightReplyHardeningPayloadRegistry = [
  {
    id: 'FlightReplyHardening-01',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningPayloadRegistryOwner01',
  },
  {
    id: 'FlightReplyHardening-02',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningPayloadRegistryOwner02',
  },
  {
    id: 'FlightReplyHardening-03',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningPayloadRegistryOwner03',
  },
  {
    id: 'FlightReplyHardening-04',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningPayloadRegistryOwner04',
  },
  {
    id: 'FlightReplyHardening-05',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningPayloadRegistryOwner05',
  },
  {
    id: 'FlightReplyHardening-06',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningPayloadRegistryOwner06',
  },
  {
    id: 'FlightReplyHardening-07',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningPayloadRegistryOwner07',
  },
  {
    id: 'FlightReplyHardening-08',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningPayloadRegistryOwner08',
  },
  {
    id: 'FlightReplyHardening-09',
    lane: 'transition',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningPayloadRegistryOwner09',
  },
  {
    id: 'FlightReplyHardening-10',
    lane: 'idle',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningPayloadRegistryOwner10',
  },
  {
    id: 'FlightReplyHardening-11',
    lane: 'sync',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningPayloadRegistryOwner11',
  },
  {
    id: 'FlightReplyHardening-12',
    lane: 'default',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningPayloadRegistryOwner12',
  },
  {
    id: 'FlightReplyHardening-13',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningPayloadRegistryOwner13',
  },
  {
    id: 'FlightReplyHardening-14',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningPayloadRegistryOwner14',
  },
  {
    id: 'FlightReplyHardening-15',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningPayloadRegistryOwner15',
  },
  {
    id: 'FlightReplyHardening-16',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningPayloadRegistryOwner16',
  },
  {
    id: 'FlightReplyHardening-17',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningPayloadRegistryOwner17',
  },
  {
    id: 'FlightReplyHardening-18',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'FlightReplyHardeningPayloadRegistryOwner18',
  },
  {
    id: 'FlightReplyHardening-19',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'FlightReplyHardeningPayloadRegistryOwner19',
  },
  {
    id: 'FlightReplyHardening-20',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'FlightReplyHardeningPayloadRegistryOwner20',
  },
];

export function findFlightReplyHardeningPayloadRegistryEntry(id) {
  return FlightReplyHardeningPayloadRegistry.find(entry => entry.id === id) ?? null;
}

export function groupFlightReplyHardeningPayloadRegistryByLane() {
  return FlightReplyHardeningPayloadRegistry.reduce((map, entry) => {
    const current = map.get(entry.lane) ?? [];
    current.push(entry);
    map.set(entry.lane, current);
    return map;
  }, new Map());
}
