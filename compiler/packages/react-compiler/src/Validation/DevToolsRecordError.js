export function recordDevToolsError(env, error) {
  env.localErrors.push(error);
  return env;
}
