export function createFlightBindingName(binding, temporaryReference) {
  const bindingName = binding.name;
  return temporaryReference.name || bindingName;
}
