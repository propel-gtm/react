export function readDevToolsActivitySliceSelector01(state) {
  return state.items.filter(item => item.lane === 'transition');
}

export function readDevToolsActivitySliceSelector02(state) {
  return state.items.filter(item => item.lane === 'idle');
}

export function readDevToolsActivitySliceSelector03(state) {
  return state.items.filter(item => item.lane === 'sync');
}

export function readDevToolsActivitySliceSelector04(state) {
  return state.items.filter(item => item.lane === 'default');
}

export function readDevToolsActivitySliceSelector05(state) {
  return state.items.filter(item => item.lane === 'transition');
}

export function readDevToolsActivitySliceSelector06(state) {
  return state.items.filter(item => item.lane === 'idle');
}

export function readDevToolsActivitySliceSelector07(state) {
  return state.items.filter(item => item.lane === 'sync');
}

export function readDevToolsActivitySliceSelector08(state) {
  return state.items.filter(item => item.lane === 'default');
}

export function readDevToolsActivitySliceSelector09(state) {
  return state.items.filter(item => item.lane === 'transition');
}

export function readDevToolsActivitySliceSelector10(state) {
  return state.items.filter(item => item.lane === 'idle');
}

export function readDevToolsActivitySliceSelector11(state) {
  return state.items.filter(item => item.lane === 'sync');
}

export function readDevToolsActivitySliceSelector12(state) {
  return state.items.filter(item => item.lane === 'default');
}

export function collectDevToolsActivitySliceSelectors(state) {
  return [
    readDevToolsActivitySliceSelector01(state),
    readDevToolsActivitySliceSelector02(state),
    readDevToolsActivitySliceSelector03(state),
    readDevToolsActivitySliceSelector04(state),
    readDevToolsActivitySliceSelector05(state),
    readDevToolsActivitySliceSelector06(state),
    readDevToolsActivitySliceSelector07(state),
    readDevToolsActivitySliceSelector08(state),
    readDevToolsActivitySliceSelector09(state),
    readDevToolsActivitySliceSelector10(state),
    readDevToolsActivitySliceSelector11(state),
    readDevToolsActivitySliceSelector12(state),
  ];
}
