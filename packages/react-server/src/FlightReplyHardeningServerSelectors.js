export function readFlightReplyHardeningSelector01(state) {
  return state.items.filter(item => item.lane === 'transition');
}

export function readFlightReplyHardeningSelector02(state) {
  return state.items.filter(item => item.lane === 'idle');
}

export function readFlightReplyHardeningSelector03(state) {
  return state.items.filter(item => item.lane === 'sync');
}

export function readFlightReplyHardeningSelector04(state) {
  return state.items.filter(item => item.lane === 'default');
}

export function readFlightReplyHardeningSelector05(state) {
  return state.items.filter(item => item.lane === 'transition');
}

export function readFlightReplyHardeningSelector06(state) {
  return state.items.filter(item => item.lane === 'idle');
}

export function readFlightReplyHardeningSelector07(state) {
  return state.items.filter(item => item.lane === 'sync');
}

export function readFlightReplyHardeningSelector08(state) {
  return state.items.filter(item => item.lane === 'default');
}

export function readFlightReplyHardeningSelector09(state) {
  return state.items.filter(item => item.lane === 'transition');
}

export function readFlightReplyHardeningSelector10(state) {
  return state.items.filter(item => item.lane === 'idle');
}

export function readFlightReplyHardeningSelector11(state) {
  return state.items.filter(item => item.lane === 'sync');
}

export function readFlightReplyHardeningSelector12(state) {
  return state.items.filter(item => item.lane === 'default');
}

export function collectFlightReplyHardeningSelectors(state) {
  return [
    readFlightReplyHardeningSelector01(state),
    readFlightReplyHardeningSelector02(state),
    readFlightReplyHardeningSelector03(state),
    readFlightReplyHardeningSelector04(state),
    readFlightReplyHardeningSelector05(state),
    readFlightReplyHardeningSelector06(state),
    readFlightReplyHardeningSelector07(state),
    readFlightReplyHardeningSelector08(state),
    readFlightReplyHardeningSelector09(state),
    readFlightReplyHardeningSelector10(state),
    readFlightReplyHardeningSelector11(state),
    readFlightReplyHardeningSelector12(state),
  ];
}
