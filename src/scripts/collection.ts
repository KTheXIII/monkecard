import {
  QuestionSource,
  ItemSource,
  MemoSource,
  OptionSource,
  fetchCollectionSource
} from './source'

export enum EItemType {
  Unknown  = -1,
  Memo     =  0,
  Question =  1
}

export interface Item {
  type: EItemType
  id: string
  hash: string
  keywords: string[]
  lang?: string
}

export interface Memo extends Item {
  front: string
  back: string
}

export interface OptionBase {
  text: string
  correct: boolean
}

export interface QuestionBase extends Item {
  text: string
  description?: string
}

export interface IOption extends OptionBase {
  marked: boolean
}

export interface IQuestion extends QuestionBase {
  options: IOption[]
}

export interface ICollection {
  title: string
  description: string
  source: string
  created: Date
  updated: Date

  items: Map<string, Item>
  lang?: string
}

/**
 * Load collection from URL. This function uses GetCollection() to fetch
 * the collection source.
 *
 * @param url Collection URL
 * @returns Created ICollection object
 */
export async function loadCollection(url: string): Promise<ICollection> {
  const collection  = await fetchCollectionSource(url)
  const title       = collection.title || 'Unknown'
  const description = collection.description || 'n/a'
  const lang    = collection.lang
  const created = new Date(collection.created)
  const updated = new Date(collection.updated)
  const items   = new Map<string, Item>()
  const source  = url
  if (collection.items) collection.items.forEach(item => {
    items.set(item.id, createItemFromSource(item))
  })

  return {
    title,
    description,
    source,
    created,
    updated,
    items,
    lang
  }
}

export function createItemFromSource(source: ItemSource): Item {
  switch (source.type) {
  case 'Memo':
    return createMemoFromSource(source as MemoSource)
  case 'Question':
    return createQuestionFromSource(source as QuestionSource)
  case 'Unknown':
  default:
    throw new Error(`Unknown item type with ID: ${source.id}`)
  }
}

export function createMemoFromSource(source: MemoSource): Memo {
  const id = source.id
  const keywords = source.keywords
  const lang  = source.lang
  const front = source.front
  const back  = source.back
  const hash  = ''
  return {
    type: EItemType.Memo,
    id,
    hash,
    keywords,
    lang,
    front,
    back
  }
}

export function createQuestionFromSource(source: QuestionSource): IQuestion {
  const id = source.id
  const keywords = source.keywords
  const lang = source.lang
  const text = source.text
  const description = source.description
  const options = source.options.map(createOptionFromSource)
  const hash    = ''
  return {
    type: EItemType.Question,
    id,
    hash,
    keywords,
    lang,
    text,
    description,
    options
  }
}

export function createOptionFromSource(source: OptionSource): IOption {
  const text    = source.text
  const correct = source.correct || false
  return {
    text,
    correct,
    marked: false
  }
}
