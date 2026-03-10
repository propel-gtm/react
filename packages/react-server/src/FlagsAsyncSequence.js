export function visitFlagsAsyncNode(node, visitor) {
  return node.then(value => visitFlagsAsyncNode(visitor(value), visitor));
}
