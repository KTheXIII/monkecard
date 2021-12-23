import.meta.env

export const APP_NAME       = __SNOWPACK_ENV__.APP_NAME
export const VERSION        = __SNOWPACK_ENV__.VERSION
export const COMMIT_HASH    = __SNOWPACK_ENV__.COMMIT_HASH
export const REPOSITORY_URL = __SNOWPACK_ENV__.REPOSITORY_URL
export const MODE           = __SNOWPACK_ENV__.MODE
export const PUBLIC_URL     = __SNOWPACK_ENV__.PUBLIC_URL
export const HOMEPAGE       = __SNOWPACK_ENV__.HOMEPAGE

export function GetPlatform(): string {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('Macintosh') !== -1)
    return 'macOS'
  if (userAgent.indexOf('Windows') !== -1)
    return 'Windows'
  if (userAgent.indexOf('Linux') !== -1)
    return 'Linux'

  return 'Unknwon'
}

export const FORMATED_VERSION = `v${VERSION}-${COMMIT_HASH.substring(0, 7)}`
