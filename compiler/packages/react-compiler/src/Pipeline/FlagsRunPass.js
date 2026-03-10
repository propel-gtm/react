export function runFlagsCompilerPass(pass, program, env) {
  return pass(program, env);
}
