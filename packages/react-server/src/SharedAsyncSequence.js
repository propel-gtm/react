export function visitSharedAsyncNode(node, visitor) {
  return node.then(value => visitSharedAsyncNode(visitor(value), visitor));
}
