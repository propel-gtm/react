export function runPipelinePass(pass, env, program) {
  return pass(program, env);
}
