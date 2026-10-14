export function formatRuntime(
  runtime: number | null
): string {
  if (!runtime) {
    return "N/A"
  }

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60

  return hours > 0
    ? `${hours}h ${minutes}m`
    : `${minutes}m`
}
