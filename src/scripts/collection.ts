import { ISourceSet, ICollectionSet } from '@models/dataset'
import {
  ICollection,
  Item,
  Memo,
  IQuestion,
  IOption,
  EItemType,
} from '@models/collection'
import {
  QuestionSource,
  ItemSource,
  MemoSource,
  OptionSource,
} from '@models/source'

/**
 * Load collection from source set.
 *
 * @param set Source set.
 * @returns Created ICollection object
 */
export function loadCollection(set: ISourceSet): ICollection | null {
  if (set.data) {
    const title       = set.data.title || 'Unknown'
    const description = set.data.description || 'n/a'
    const lang    = set.data.lang
    const created = new Date(set.data.created)
    const updated = new Date(set.data.updated)
    const items   = new Map<string, Item>()
    return {
      title,
      description,
      created,
      updated,
      items,
      lang
    }
  }
  return null
}

/**
 * Merge the source set into the collection.
 *
 * @note The merge is done by the source title.
 *
 * @param sourceSet Source set list of collection
 * @returns Collection set list
 */
export function mergeCollection(sourceSet: ISourceSet[]): ICollectionSet[] {
  return sourceSet
    .reduce((acc, cur) => {       // merge collections
      const found = acc.find(c => c.collection && cur.data &&
                                  c.collection.title === cur.data.title)
      if (found) found.sources.push(cur)
      else acc.push({
        sources: [cur],
        collection: loadCollection(cur)
      })
      return acc
    }, [] as ICollectionSet[])
    .map(set => {                 // merge items
      const { sources, collection } = set
      sources.reduce((acc, cur) => {  // reduce to array of items
        if (cur.data && cur.data.items) return acc
          .concat(cur.data.items
            .map(i => createItemFromSource(i))
          )
        else return acc
      }, [] as Item[])
        .forEach(i => collection && collection.items.set(i.id, i))  // put items into a map
      return set
    })
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
