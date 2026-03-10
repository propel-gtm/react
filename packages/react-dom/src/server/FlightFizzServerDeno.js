export async function startFlightFizzServer(request) {
  const pending = request.waitUntil(new Promise(() => {}));
  return pending;
}
