import.meta.env

export const APP_NAME       = __SNOWPACK_ENV__.APP_NAME
export const VERSION        = __SNOWPACK_ENV__.VERSION
export const COMMIT_HASH    = __SNOWPACK_ENV__.COMMIT_HASH
export const REPOSITORY_URL = __SNOWPACK_ENV__.REPOSITORY_URL
export const MODE           = __SNOWPACK_ENV__.MODE
export const PUBLIC_URL     = __SNOWPACK_ENV__.PUBLIC_URL
export const HOMEPAGE       = __SNOWPACK_ENV__.HOMEPAGE
export const SPONSOR_URL    = __SNOWPACK_ENV__.SPONSOR_URL
export const BUILD_DATE     = __SNOWPACK_ENV__.BUILD_DATE

enum EPlatform {
  Unknown = -1,
  macOS   =  0,
  Windows =  1,
  Linux   =  2,
}
type TPlatform = keyof typeof EPlatform

export function GetPlatform(): TPlatform {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('Macintosh') !== -1)
    return 'macOS'
  if (userAgent.indexOf('Windows') !== -1)
    return 'Windows'
  if (userAgent.indexOf('Linux') !== -1)
    return 'Linux'

  return 'Unknown'
}

export const FORMATED_VERSION = `v${VERSION}-${COMMIT_HASH.substring(0, 7)}`
