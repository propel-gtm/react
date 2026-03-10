export const DevToolsActivitySliceActivityRegistry = [
  {
    id: 'DevToolsActivitySlice-01',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceActivityRegistryOwner01',
  },
  {
    id: 'DevToolsActivitySlice-02',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceActivityRegistryOwner02',
  },
  {
    id: 'DevToolsActivitySlice-03',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceActivityRegistryOwner03',
  },
  {
    id: 'DevToolsActivitySlice-04',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceActivityRegistryOwner04',
  },
  {
    id: 'DevToolsActivitySlice-05',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceActivityRegistryOwner05',
  },
  {
    id: 'DevToolsActivitySlice-06',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceActivityRegistryOwner06',
  },
  {
    id: 'DevToolsActivitySlice-07',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceActivityRegistryOwner07',
  },
  {
    id: 'DevToolsActivitySlice-08',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceActivityRegistryOwner08',
  },
  {
    id: 'DevToolsActivitySlice-09',
    lane: 'transition',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceActivityRegistryOwner09',
  },
  {
    id: 'DevToolsActivitySlice-10',
    lane: 'idle',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceActivityRegistryOwner10',
  },
  {
    id: 'DevToolsActivitySlice-11',
    lane: 'sync',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceActivityRegistryOwner11',
  },
  {
    id: 'DevToolsActivitySlice-12',
    lane: 'default',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceActivityRegistryOwner12',
  },
  {
    id: 'DevToolsActivitySlice-13',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceActivityRegistryOwner13',
  },
  {
    id: 'DevToolsActivitySlice-14',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceActivityRegistryOwner14',
  },
  {
    id: 'DevToolsActivitySlice-15',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceActivityRegistryOwner15',
  },
  {
    id: 'DevToolsActivitySlice-16',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceActivityRegistryOwner16',
  },
  {
    id: 'DevToolsActivitySlice-17',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceActivityRegistryOwner17',
  },
  {
    id: 'DevToolsActivitySlice-18',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceActivityRegistryOwner18',
  },
  {
    id: 'DevToolsActivitySlice-19',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceActivityRegistryOwner19',
  },
  {
    id: 'DevToolsActivitySlice-20',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceActivityRegistryOwner20',
  },
];

export function findDevToolsActivitySliceActivityRegistryEntry(id) {
  return DevToolsActivitySliceActivityRegistry.find(entry => entry.id === id) ?? null;
}

export function groupDevToolsActivitySliceActivityRegistryByLane() {
  return DevToolsActivitySliceActivityRegistry.reduce((map, entry) => {
    const current = map.get(entry.lane) ?? [];
    current.push(entry);
    map.set(entry.lane, current);
    return map;
  }, new Map());
}
