export function runSharedCompilerPass(pass, program, env) {
  return pass(program, env);
}
