export async function hash(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
}

export function hashToString(hash: ArrayBuffer): string {
  return Array.from(new Uint8Array(hash)).map(v => v.toString(16).padStart(2, '0')).join('')
}
