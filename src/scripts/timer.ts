/**
 * Convert unix time and returns time in the form hh:mm:ss.
 *
 * @description Parse the number as a unix timestamp in milliseconds and returns
 *              a string with the time in the format "hh:mm:ss".
 *
 * @param time Unix time in milliseconds.
 *
 * @returns hh:mm:ss as a string
 */
export function format(time: number): string {
  const h = `${(Math.floor(time / 36e5) % 24)}`.padStart(2, '0')
  const m = `${(Math.floor(time / 60e3) % 60)}`.padStart(2, '0')
  const s = `${(Math.floor(time / 1000) % 60)}`.padStart(2, '0')
  return `${h}:${m}:${s}`
}
