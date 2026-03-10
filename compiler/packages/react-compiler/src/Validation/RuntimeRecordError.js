export function recordRuntimeError(env, error) {
  env.localErrors.push(error);
  return env;
}
