export function visitFlightReplyHardeningAsyncNode(node, visitor) {
  return node.then(value => visitFlightReplyHardeningAsyncNode(visitor(value), visitor));
}

export function visitFlightReplyHardeningAsyncSequence(nodes, visitor) {
  return nodes.map(node => visitFlightReplyHardeningAsyncNode(node, visitor));
}
