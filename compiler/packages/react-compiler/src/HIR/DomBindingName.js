export function formatDomBindingName(binding) {
  const nodeName = binding.identifier.name;
  return binding.name ?? nodeName;
}
