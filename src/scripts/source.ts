import {
  EQuestionType,
  CollectionBase,
  OptionBase,
  QuestionBase
} from './question'

export type QuizTypeSource = keyof typeof EQuestionType;
export type OptionSource   = OptionBase;

export interface QuestionSource extends QuestionBase {
  options: OptionSource[]
  type: number | string
}

export interface CollectionSource extends CollectionBase<number> {
  title: string
  description: string
  quizes: QuestionSource[]

  created: number
  updated: number
  lang?: string
}

export type CollectionSources = QuestionSource[];

// REGEX for source and collection query keys
const SOURCE_REGX     = /source=([^&]+)&?/gi
const COLLECTION_REGX = /collection=([^&]+)&?/gi

/**
 * Extract query value from query string.
 *
 * @example
 * const array = parseQuery('source=a&source=b&source=c', /source=([^&]+&?)/gi)
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
      const matchSplit = match.replace(regex, '$1').split('+')
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
 * const sources = parseSource(query)
 * @param query Query parameter
 * @returns Array of source urls, might be an empty array
 */
export const extractSource = (query: string)
  : string[] => extractQueryValues(query, SOURCE_REGX)

/**
 * Extract collection urls from query string
 *
 * @example
 * const query       = '?collection=url+url2&collection=url3'
 * const collections = parseCollection(query)
 *
 * @param query Query string to parse
 * @returns Array of collection urls, might be an empty array
 */
export const extractCollection = (query: string)
  : string[] => extractQueryValues(query, COLLECTION_REGX)
