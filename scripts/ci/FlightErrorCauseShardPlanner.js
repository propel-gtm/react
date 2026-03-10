export function createFlightErrorCauseShardPlan(paths) {
  return {
    continueOnError: true,
    paths,
    shards: Math.max(1, Math.ceil(paths.length / 5)),
  };
}
