import * as yaml from 'js-yaml'

import {
  OptionBase,
  QuestionBase
} from './collection'

export type OptionSource = OptionBase;

export interface QuestionSource extends QuestionBase {
  options: OptionSource[]
}

export interface CollectionSource {
  title?: string
  description?: string
  lang?: string

  datas: QuestionSource[]
  created: string | number  // ISO 8601 or unix time ms
  updated: string | number  // ISO 8601 or unix time ms
}

export type CollectionSources = QuestionSource[];

// REGEX for source and collection query keys
const SOURCE_REGX      = /source=([^&]+)&?/gi
const COLLECTIONS_REGX = /collection=([^&]+)&?/gi
const JSON_EXT_REGX    = /\.json$/g
const YAML_EXT_REGX    = /\.ya?ml$/g

/**
 * Extract query value from query string.
 *
 * @example
 * const array = extractQueryValues('source=a&source=b&source=c', /source=([^&]+&?)/gi)
 *
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
        .split('+')
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
export const extractSource = (query: string)
  : string[] => extractQueryValues(query, SOURCE_REGX)

/**
 * Extract collection urls from query string.
 *
 * @todo There's no definitive way to use this at the moment.
 *
 * @description
 * A collection url points to json or yaml file that has array
 * of urls to collection source file.
 *
 * Sample yaml collection url file
 * ```yml
 * - 'collection_01.yml'
 * - 'collection_02.json'
 * - 'collection_03.yaml'
 * ```
 *
 * @example
 * const query       = '?collection=url+url2&collection=url3'
 * const collections = extractCollection(query)
 * @param query Query string to parse
 * @returns Array of collection urls, might be an empty array
 */
export const extractCollections = (query: string)
  : string[] => extractQueryValues(query, COLLECTIONS_REGX)

/**
 * Fetch yaml file and parse it to JavaScript object using js-yaml.
 *
 * @param url YAML file path
 * @returns Promise that resolves to the parsed YAML object
 */
export async function GetYAML<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url)
    if (!res.ok) return Promise.reject(res.statusText)
    const text = await res.text()
    const data = yaml.load(text)
    if (typeof data === 'object')
      return Promise.resolve(Object(data))

    return Promise.reject('YAML data is not an object')
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * Fetch json file and parse it to JavaScript object using built-in JSON.parse.
 *
 * @param url JSON file path
 * @returns Promise that resolves to the parsed JSON object.
 */
export async function GetJSON<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url)
    if (!res.ok) return Promise.reject(res.statusText)
    const data = await res.json()
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * Fetch collection data from a url.
 * Supports JSON and YAML files depeding on the file extension.
 *
 * @param url Collection file url.
 * @returns Promise that resolves to the parsed collection data.
 */
export async function GetCollection(url: string): Promise<CollectionSource> {
  try {
    // NOTE: Should consider using endsWith() instead of regex.
    if (JSON_EXT_REGX.test(url))
      return GetJSON<CollectionSource>(url)
    else if (YAML_EXT_REGX.test(url))
      return GetYAML<CollectionSource>(url)
    else
      return Promise.reject('Unknown file extension')
  } catch (err) {
    return Promise.reject(err)
  }
}
