import * as YAML from 'js-yaml'
import { YAMLException } from 'js-yaml'

// REGEX for source and collection query keys
const SOURCE_REGEX   = /source=([^&]+)&?/gi  // source=<source>&
const LIST_REGEX     = /list=([^&]+)&?/gi    // For data with a list of source
const ITEMS_REGEX    = /items=([^&]+)&?/gi   // For data with a list of items
const SRCLZ_REGEX    = /src_lz=([^&]+)&?/gi  // Compressed source links
const NODE_REGEX     = /node=([^&]+)&?/gi
const JSON_EXT_REGEX = /\.json$/i
const YAML_EXT_REGEX = /\.ya?ml$/i
const GITHUB_GIST_REGEX = /^https:\/\/gist\.github\.com\/([^/]+)\/([^/]+)\/?$/i

/**
 * Extract query value from query string.
 *
 * @example
 * const array = extractQueryValues('source=a&source=b&source=c', /source=([^&]+&?)/gi)
 * @note Might consider switching to URLSearchParams
 * @param query Query string to parse
 * @param regex Regex to match against
 * @returns Array of strings with regex match stripped.
 */
export function extractQueryValues(query: string, regex: RegExp): string[] {
  const sources: string[] = []
  const matches = query.match(regex)
  if (matches) {
    matches.forEach(match => {
      const matchSplit = match
        .replace(regex, '$1')
        .split(/\+/)
        .map(s => s.trim())
      sources.push(...matchSplit)
    })
  }
  return sources
}

/**
 * Extract source urls from the query string.
 *
 * @example
 * const query   = '?source=url1+url2+url3&source=url4'
 * const sources = extractSource(query)
 * @param query Query parameter
 * @returns Array of source urls, might be an empty array
 */
export const extractQuerySource     = (query: string)
  : string[] => extractQueryValues(query, SOURCE_REGEX)

export const extractQuerySourceList = (query: string)
  : string[] => extractQueryValues(query, LIST_REGEX)

export const extractQueryItems      = (query: string)
  : string[] => extractQueryValues(query, ITEMS_REGEX)

export const extractQuerySRCLZ      = (query: string)
  : string[] => extractQueryValues(query, SRCLZ_REGEX)

export const extractQueryNode       = (query: string)
  : string[] => extractQueryValues(query, NODE_REGEX)

/**
 * Fetch yaml file and parse it to JavaScript object using js-yaml.
 *
 * @param url YAML file path
 * @returns Promise that resolves to the parsed YAML object
 */
export async function fetchYAML(url: string): Promise<unknown> {
  return await fetch(url, { mode: 'cors' }).then(res => {
    if (res.ok) return res.text()
    return Promise.reject(new Error(`Fetch failed: ${res.statusText}`))
  }).then(text => parseSource(text))
}

/**
 * Fetch json file and parse it to JavaScript object using built-in JSON.parse.
 *
 * @param url JSON file path
 * @returns Promise that resolves to the parsed JSON object.
 */
export async function fetchJSON(url: string): Promise<unknown> {
  return await fetch(url, { mode: 'cors' }).then(res => {
    if (res.ok) return res.text()
    return Promise.reject(new Error(`Fetch failed: ${res.statusText}`))
  }).then(text => parseSource(text))
}

export async function fetchGistGithub(url: string): Promise<unknown> {
  const dest = url.replace(GITHUB_GIST_REGEX, 'https://gist.githubusercontent.com/$1/$2/raw')
  return await fetch(dest, { mode: 'cors' }).then(res => {
    if (res.ok) return res.text()
    return Promise.reject(res.statusText)
  }).then(text =>  parseSource(text))
}

/**
 * Fetch source file and parse it to JavaScript object.
 * @param url JSON, YAML or GitHub Gist url
 * @returns Promise with unknown data type
 */
export async function fetchSupportedURL(url: string): Promise<unknown> {
  try {
    if (JSON_EXT_REGEX.test(url))
      return await fetchJSON(url)
    else if (YAML_EXT_REGEX.test(url))
      return await fetchYAML(url)
    else if (GITHUB_GIST_REGEX.test(url))
      return await fetchGistGithub(url)
    else
      return Promise.reject(`URL: ${url} is not supported`)
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function parseSource(text: string): Promise<unknown> {
  try {
    const data = YAML.load(text)
    return Promise.resolve(data)
  } catch (err) {
    if (err instanceof YAMLException)
      return Promise.reject(err.message)
    return Promise.reject(err)
  }
}
