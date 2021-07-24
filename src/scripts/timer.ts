export function format(time: number): string {
  return new Date(time).toLocaleTimeString('en-SE', { timeZone: 'utc' })
}
