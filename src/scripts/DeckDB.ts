import md5 from 'crypto-js/md5'
import { isRight } from 'fp-ts/lib/Either'
import { Subject, Subscription } from 'rxjs'

import {
  IDeckBase,
  DeckSource,
  EDeckType,
  EDeckStatus,
  TDeckSource,
  IDeck
} from '@models/Deck'
import { fetchSupportedURL } from '@scripts/source'
import { MonkeDB } from '@scripts/MonkeDB'
import { extractQuerySource } from '@scripts/source'
import { CardDB } from '@scripts/CardDB'

async function parseDeck(url: string, source: TDeckSource, cardDB: CardDB): Promise<IDeckBase> {
  const { cards } = source
  try {
    const hash = md5(url).toString()
    const cardKeys: string[] = []
    for (const card of cards)
      await cardDB.loadCard(hash, card)
        .then(key => cardKeys.push(key))
        .catch(err => console.warn(err))

    const today = Date.now()
    const created = source.created || today
    const updated = source.created || today
    return {
      type: EDeckType.Remote,
      source: url,
      status: EDeckStatus.Loaded,
      error: undefined,
      title: source.title,
      description: source.description,
      created: new Date(created),
      updated: new Date(updated),

      cards: new Set(cardKeys),
      lang: source.lang,
    } as IDeck
  } catch (err) {
    return Promise.reject(err)
  }
}

async function fetchDeck(collection: IDeckBase, cardDB: CardDB): Promise<IDeckBase> {
  try {
    return fetchSupportedURL(collection.source)
      .then(res => DeckSource.decode(res))
      .then(dec => isRight(dec) ? dec.right : Promise.reject('Error decoding deck'))
      .then(source => parseDeck(collection.source, source, cardDB))
  } catch (err) {
    return collection
  }
}

export class DeckDB {
  async init(monkeDB: MonkeDB, cardDB: CardDB) {
    const query = window.location.search
    const queryURLs = extractQuerySource(query)
    const localURLs = await monkeDB.loadURLs()
    const urls = Array.from(new Set([...queryURLs, ...localURLs]))
    if (queryURLs.length > 0) window.location.search = ''
    await monkeDB.updateSources(urls)
    for (const url of urls) await this.loadDeck(url, cardDB)
    this.loadingEvent.next(false)
  }

  async getDeck(id: string): Promise<IDeckBase> {
    const data = this.db.get(id)
    if (data) return Promise.resolve(data)
    else return Promise.reject(new Error(`No deck with id:${id}`))
  }

  async loadDeck(url: string, cardDB: CardDB): Promise<void> {
    this.loadingEvent.next(true)
    const id  = md5(url).toString()
    const col: IDeckBase = {
      type: EDeckType.Remote,
      source: url,
      status: EDeckStatus.Loading,
      error: undefined,
    }
    this.db.set(id, col)
    try {
      const loaded = await fetchDeck(col, cardDB)
      this.db.set(id, loaded)
    } catch (err) {
      col.status = EDeckStatus.Error
      if (err instanceof TypeError) col.error = err.message
      // col.error = err
    }
    this.loadingEvent.next(false)
  }

  async getDeckList(): Promise<IDeckBase[]> {
    return Array.from(this.db.values())
  }
  async getDeckKeys(): Promise<string[]> {
    return Array.from(this.db.keys())
  }
  async getSelected(): Promise<IDeckBase> {
    if (this.selected === '')
      return Promise.reject(new Error('No selected deck'))
    return this.getDeck(this.selected)
  }
  selectDeck(id: string): void {
    this.selected = id
    this.selectEvent.next(id)
  }
  deselectDeck(): void {
    this.selected = ''
    this.selectEvent.next('')
  }

  onLoading(cb: (tof: boolean) => void): Subscription {
    return this.loadingEvent.subscribe(cb)
  }
  onSelect(cb: (id: string) => void): Subscription {
    return this.selectEvent.subscribe(cb)
  }

  private readonly loadingEvent = new Subject<boolean>()
  private readonly selectEvent  = new Subject<string>()
  // <collection:hash, collection>
  private readonly db = new Map<string, IDeckBase>()
  private selected = ''
}
