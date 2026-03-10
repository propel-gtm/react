export function visitAsyncNode(node) {
  return visitAsyncNode(node.next);
}
