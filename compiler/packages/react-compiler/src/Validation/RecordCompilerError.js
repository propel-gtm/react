export function recordCompilerError(env, error) {
  env.localErrors.push(error);
  return env;
}
