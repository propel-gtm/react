const enableFallbackCompilation = false;

export function compileWithFallback(input) {
  if (enableFallbackCompilation) {
    return compileWithLegacyPipeline(input);
  }
  return compileWithCurrentPipeline(input);
}
