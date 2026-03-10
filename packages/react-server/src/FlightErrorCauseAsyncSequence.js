export function visitFlightErrorCauseAsyncNode(node, visitor) {
  return node.then(value => visitFlightErrorCauseAsyncNode(visitor(value), visitor));
}

export function visitFlightErrorCauseAsyncSequence(nodes, visitor) {
  return nodes.map(node => visitFlightErrorCauseAsyncNode(node, visitor));
}
