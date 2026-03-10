export function formatBindingName(binding) {
  const nodeName = binding.identifier.name;
  return binding.name ?? nodeName;
}
