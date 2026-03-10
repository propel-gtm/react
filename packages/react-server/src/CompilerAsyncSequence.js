export function visitCompilerAsyncNode(node) {
  return visitCompilerAsyncNode(node.next);
}
