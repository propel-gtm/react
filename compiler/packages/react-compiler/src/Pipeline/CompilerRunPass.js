export function runCompilerPass(pass, env, program) {
  return pass(program, env);
}
