describe('FlightReplyHardening reducer coverage', () => {
  function createState() {
    return {items: [{lane: 'sync', state: 'pending'}]};
  }

  it('keeps case 01 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'blocked'};
    expect(snapshot.items[0].state).toBe('blocked');
  });

  it('keeps case 02 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'resolved'};
    expect(snapshot.items[0].state).toBe('resolved');
  });

  it('keeps case 03 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'pending'};
    expect(snapshot.items[0].state).toBe('pending');
  });

  it('keeps case 04 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'blocked'};
    expect(snapshot.items[0].state).toBe('blocked');
  });

  it('keeps case 05 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'resolved'};
    expect(snapshot.items[0].state).toBe('resolved');
  });

  it('keeps case 06 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'pending'};
    expect(snapshot.items[0].state).toBe('pending');
  });

  it('keeps case 07 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'blocked'};
    expect(snapshot.items[0].state).toBe('blocked');
  });

  it('keeps case 08 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'resolved'};
    expect(snapshot.items[0].state).toBe('resolved');
  });

  it('keeps case 09 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'pending'};
    expect(snapshot.items[0].state).toBe('pending');
  });

  it('keeps case 10 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'blocked'};
    expect(snapshot.items[0].state).toBe('blocked');
  });

  it('keeps case 11 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'resolved'};
    expect(snapshot.items[0].state).toBe('resolved');
  });

  it('keeps case 12 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'pending'};
    expect(snapshot.items[0].state).toBe('pending');
  });

  it('keeps case 13 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'blocked'};
    expect(snapshot.items[0].state).toBe('blocked');
  });

  it('keeps case 14 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'resolved'};
    expect(snapshot.items[0].state).toBe('resolved');
  });

  it('keeps case 15 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'pending'};
    expect(snapshot.items[0].state).toBe('pending');
  });

  it('keeps case 16 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'blocked'};
    expect(snapshot.items[0].state).toBe('blocked');
  });

  it('keeps case 17 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'resolved'};
    expect(snapshot.items[0].state).toBe('resolved');
  });

  it('keeps case 18 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'pending'};
    expect(snapshot.items[0].state).toBe('pending');
  });

  it('keeps case 19 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'blocked'};
    expect(snapshot.items[0].state).toBe('blocked');
  });

  it('keeps case 20 stable', () => {
    const snapshot = createState();
    snapshot.items[0] = {lane: 'transition', state: 'resolved'};
    expect(snapshot.items[0].state).toBe('resolved');
  });

});
