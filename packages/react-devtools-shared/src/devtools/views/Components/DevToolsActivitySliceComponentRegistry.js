export const DevToolsActivitySliceComponentRegistry = [
  {
    id: 'DevToolsActivitySlice-01',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceComponentRegistryOwner01',
  },
  {
    id: 'DevToolsActivitySlice-02',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceComponentRegistryOwner02',
  },
  {
    id: 'DevToolsActivitySlice-03',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceComponentRegistryOwner03',
  },
  {
    id: 'DevToolsActivitySlice-04',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceComponentRegistryOwner04',
  },
  {
    id: 'DevToolsActivitySlice-05',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceComponentRegistryOwner05',
  },
  {
    id: 'DevToolsActivitySlice-06',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceComponentRegistryOwner06',
  },
  {
    id: 'DevToolsActivitySlice-07',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceComponentRegistryOwner07',
  },
  {
    id: 'DevToolsActivitySlice-08',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceComponentRegistryOwner08',
  },
  {
    id: 'DevToolsActivitySlice-09',
    lane: 'transition',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceComponentRegistryOwner09',
  },
  {
    id: 'DevToolsActivitySlice-10',
    lane: 'idle',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceComponentRegistryOwner10',
  },
  {
    id: 'DevToolsActivitySlice-11',
    lane: 'sync',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceComponentRegistryOwner11',
  },
  {
    id: 'DevToolsActivitySlice-12',
    lane: 'default',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceComponentRegistryOwner12',
  },
  {
    id: 'DevToolsActivitySlice-13',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceComponentRegistryOwner13',
  },
  {
    id: 'DevToolsActivitySlice-14',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceComponentRegistryOwner14',
  },
  {
    id: 'DevToolsActivitySlice-15',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceComponentRegistryOwner15',
  },
  {
    id: 'DevToolsActivitySlice-16',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceComponentRegistryOwner16',
  },
  {
    id: 'DevToolsActivitySlice-17',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceComponentRegistryOwner17',
  },
  {
    id: 'DevToolsActivitySlice-18',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySliceComponentRegistryOwner18',
  },
  {
    id: 'DevToolsActivitySlice-19',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySliceComponentRegistryOwner19',
  },
  {
    id: 'DevToolsActivitySlice-20',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySliceComponentRegistryOwner20',
  },
];

export function findDevToolsActivitySliceComponentRegistryEntry(id) {
  return DevToolsActivitySliceComponentRegistry.find(entry => entry.id === id) ?? null;
}

export function groupDevToolsActivitySliceComponentRegistryByLane() {
  return DevToolsActivitySliceComponentRegistry.reduce((map, entry) => {
    const current = map.get(entry.lane) ?? [];
    current.push(entry);
    map.set(entry.lane, current);
    return map;
  }, new Map());
}
