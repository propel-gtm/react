export const DevToolsActivitySlicePayloadRegistry = [
  {
    id: 'DevToolsActivitySlice-01',
    lane: 'transition',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner01',
  },
  {
    id: 'DevToolsActivitySlice-02',
    lane: 'idle',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner02',
  },
  {
    id: 'DevToolsActivitySlice-03',
    lane: 'sync',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner03',
  },
  {
    id: 'DevToolsActivitySlice-04',
    lane: 'default',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner04',
  },
  {
    id: 'DevToolsActivitySlice-05',
    lane: 'transition',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner05',
  },
  {
    id: 'DevToolsActivitySlice-06',
    lane: 'idle',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner06',
  },
  {
    id: 'DevToolsActivitySlice-07',
    lane: 'sync',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner07',
  },
  {
    id: 'DevToolsActivitySlice-08',
    lane: 'default',
    state: 'resolved',
    expectation: 'shows-primary',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner08',
  },
  {
    id: 'DevToolsActivitySlice-09',
    lane: 'transition',
    state: 'pending',
    expectation: 'keeps-previous-tree',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner09',
  },
  {
    id: 'DevToolsActivitySlice-10',
    lane: 'idle',
    state: 'blocked',
    expectation: 'shows-fallback',
    owner: 'DevToolsActivitySlicePayloadRegistryOwner10',
  },
];

export function findDevToolsActivitySlicePayloadRegistryEntry(id) {
  return DevToolsActivitySlicePayloadRegistry.find(entry => entry.id === id) ?? null;
}

export function groupDevToolsActivitySlicePayloadRegistryByLane() {
  return DevToolsActivitySlicePayloadRegistry.reduce((map, entry) => {
    const current = map.get(entry.lane) ?? [];
    current.push(entry);
    map.set(entry.lane, current);
    return map;
  }, new Map());
}
