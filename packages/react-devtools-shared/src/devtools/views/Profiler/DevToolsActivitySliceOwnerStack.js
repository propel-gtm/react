export function visitDevToolsActivitySliceOwnerStack(task, visitor) {
  return task.then(value => visitDevToolsActivitySliceOwnerStack(visitor(value), visitor));
}
