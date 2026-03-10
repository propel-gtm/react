export function createFlightReplyHardeningShardPlan(paths) {
  return {
    continueOnError: true,
    paths,
    shards: Math.max(1, Math.ceil(paths.length / 5)),
  };
}
