import { ItemSource } from '@models/item'
import { Command } from '@scripts/command'
import {
  EItemType,
  TItemSource,
  TMemoSource,
  MemoSource,
  Memo
} from '@models/item'
import { Subject } from 'rxjs'
import {
  fold,
  isRight,
} from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { Errors } from 'io-ts'
import sha256 from 'crypto-js/sha256'

import {
  ICollectionBase,
  ICollection,
  CollectionSource,
  TCollectionSource,
  ECType, ECStatus,
} from '@models/collection'
import {
  extractQuerySource,
  fetchSupportedURL,
} from '@scripts/source'
import {
  copyToClipboard,
  getLocalSourceList,
  saveLocalSourceList
} from '@scripts/cache'
import { Item } from '@models/item'
import {
  ECommandMode,
  TCommand,
} from '@models/command'

export async function createItemFromSource(source: TItemSource): Promise<Item> {
  if (source.type === EItemType[0] || source.type === EItemType.Memo) {
    const memoSource = source as TMemoSource
    const id = memoSource.id === '' ?
      sha256(memoSource.front + memoSource.back).toString()
      :
      memoSource.id
    const memo: Memo = {
      type: EItemType.Memo,
      keywords: memoSource.keywords,
      lang: memoSource.lang,
      id: id,
      hash: sha256(JSON.stringify(memoSource)).toString(),
      front: memoSource.front,
      back: memoSource.back,
    }
    return memo
  }

  throw new Error('Unsupported item type')
}

export async function sourceToCollection(source: TCollectionSource): Promise<ICollectionBase> {
  const items = new Map<string, Item>()
  for (const itemSource of source.items) {
    const res = MemoSource.decode(itemSource)
    if (isRight(res)) {
      items.set(res.right.id, await createItemFromSource(res.right))
    } else {
      const item = ItemSource.decode(itemSource)
      if (isRight(item))
        console.warn('invalid item format', item.right)
      else
        console.error('invalid item format', item.left)
    }
  }

  return {
    type: ECType.Remote,
    source: sha256(JSON.stringify(source)).toString(),
    status: ECStatus.Loaded,
    title: source.title,
    description: source.description,
    created: new Date(source.created),
    updated: new Date(source.updated),
    items: items,
    lang: source.lang,
  } as ICollection
}

export async function validateCollection(data: unknown): Promise<ICollectionBase> {
  return new Promise((resolve, reject) => {
    const onLeft = (err: Errors): string => {
      console.error(err)
      reject('invalid collection data')
      return 'Invalid collection data'
    }
    const onRight = (value: TCollectionSource) => {
      resolve(sourceToCollection(value))
      return 'ok'
    }
    pipe(CollectionSource.decode(data), fold(onLeft, onRight))
  })
}

export async function loadCollection(collection: ICollectionBase): Promise<ICollectionBase> {
  try {
    if (collection.type === ECType.Remote) {
      const data = await fetchSupportedURL(collection.source)
      return await validateCollection(data).then(data => {
        data.source = collection.source
        return data
      })
    }
  } catch (err) {
    if (typeof err === 'string') {
      collection.error = String(err)
    }
    collection.status = ECStatus.Error
    return collection
  }

  throw new Error('Not implemented branch')
}

export class MonkeCollection {
  constructor() {
    this.collection.subscribe(c => this.collectionList = c)
    this.collection.subscribe(c => {
      saveLocalSourceList(c.filter(c => c.type === ECType.Remote).map(c => c.source))
    })
    this.selected.subscribe(i => this.selectIndex = i)
  }

  async init() {
    const queries = extractQuerySource(window.location.search)
    const locals  = await getLocalSourceList()
    const sources = new Set([...queries, ...locals])
    this.collection.next(await Promise.all(
      Array.from(sources.values())
        .map(s => ({
          type: ECType.Remote,
          source: s,
          status: ECStatus.NotLoaded,
        } as ICollectionBase))
    ))

    await this.load()

    // Remove query params when loaded
    window.history.replaceState({}, document.title, '/')
  }

  async load() {
    try {
      // TODO: Load from cache

      this.loading.next(true)
      const collection = await Promise.all(
        this.collectionList.map(c => loadCollection(c)))
      this.collection.next(collection)
      this.loading.next(false)
    } catch (err) {
      console.error(err)
    }
  }

  list() {
    return this.collectionList
  }
  addSource(url: string) {
    this.collectionList.push({
      type: ECType.Remote,
      source: url,
      status: ECStatus.NotLoaded,
    })
    this.collection.next(this.collectionList)
    this.load()
  }
  editSource(index: number, url: string) {
    this.collectionList[index].source = url
    this.collection.next(this.collectionList)
    this.load()
  }
  removeSource(index: number) {
    this.collectionList.splice(index, 1)
    this.collection.next(this.collectionList)
    this.selected.next(-1)
    this.load()
  }

  select(index: number) {
    this.selected.next(index)
  }
  subSelect(fn: (c: number) => void) {
    return this.selected.subscribe(fn)
  }
  getSelect() {
    if (this.selectIndex >= 0 && this.selectIndex < this.collectionList.length)
      return this.collectionList[this.selectIndex]
  }
  subLoading(cb: (tof: boolean) => void) {
    return this.loading.subscribe(cb)
  }

  register(command: Command<TCommand>) {
    command.addBase('open collection', async () => {
      command.next(this.list().map((c, i) => [
        c.status === ECStatus.Loaded ? (c as ICollection).title : c.source,
        async () => {
          this.select(i)
        }
      ]))
      return {
        success: false,
        hint: 'select a collection to open',
        restore: command.restore.bind(command),
      }
    })

    command.addBase('edit collection', async () => {
      command.next(this.list().map((c, i) => [
        c.status === ECStatus.Loaded ? (c as ICollection).title : c.source,
        async () => {
          command.next([
            ['edit source', async () => {
              return {
                success: false,
                value: c.source,
                hint: 'edit source',
                mode: ECommandMode.Input,
                fn: async (v: string) => {
                  if (v === '') return { success: false }
                  this.editSource(i, v)
                }
              }
            }],
            ['remove', async () => {
              command.next([
                ['yes', async () => {
                  this.removeSource(i)
                }],
                ['no', async () => {/**/}]
              ])
              return {
                success: false,
                hint: `confirm to remove ${c.source}`,
              }
            }],
            ['copy source', async () => {
              await copyToClipboard(c.source)
            }],
            ['go to source', async () => {
              window.open(c.source, '_blank')
            }]
          ])
          return {
            success: false,
            hint: 'select command',
          }
        }
      ]))
      return {
        success: false,
        hint: 'select a collection to edit',
        restore: command.restore.bind(command),
      }
    })

    command.addBase('add source', async () => ({
      success: false,
      mode: ECommandMode.Input,
      hint: 'enter url source to add',
      fn: async (input: string) => this.addSource(input.trim())
    }))
  }

  private selectIndex = -1
  private selected = new Subject<number>()

  private collectionList: ICollectionBase[] = []
  private collection = new Subject<ICollectionBase[]>()
  private loading = new Subject<boolean>()
}
