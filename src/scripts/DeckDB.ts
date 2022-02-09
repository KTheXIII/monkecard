import { MonkeDB } from './MonkeDB'
import { extractQuerySource } from './source'
import { CardDB } from './CardDB'
import { TDeckSource, IDeck } from '../models/Deck'
import md5 from 'crypto-js/md5'
import { isRight } from 'fp-ts/lib/Either'
import { Subject } from 'rxjs'
import { fetchSupportedURL } from '@scripts/source'
import {
  IDeckBase,
  DeckSource,
  EDeckType,
  EDeckStatus,
} from '@models/Deck'
import { boolean } from 'fp-ts'

async function parseDeck(url: string, source: TDeckSource, cardDB: CardDB): Promise<IDeckBase> {
  const { cards } = source
  try {
    const hash = md5(url).toString()
    const cardKeys: string[] = []
    for (const card of cards)
      await cardDB.loadCard(hash, card)
        .then(key => cardKeys.push(key))
        .catch(err => console.error('card parsing', err))

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
    collection.status = EDeckStatus.Error
    // FIXME: Parse error to string
    console.error(err)
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
  }

  async getDeck(id: string): Promise<IDeckBase> {
    const data = this.db.get(id)
    if (data) return Promise.resolve(data)
    else return Promise.reject(new Error(`No deck with id:${id}`))
  }

  async loadDeck(url: string, cardDB: CardDB): Promise<void> {
    this.loading.next(true)
    const id  = md5(url).toString()
    const col: IDeckBase = {
      type: EDeckType.Remote,
      source: url,
      status: EDeckStatus.Loading,
      error: undefined,
    }
    this.db.set(id, col)
    // FIXME: Set error state with message
    try {
      const loaded = await fetchDeck(col, cardDB)
      this.db.set(id, loaded)
    } catch (err) {
      col.status = EDeckStatus.Error
    }
    this.loading.next(false)
  }

  async getDeckList(): Promise<IDeckBase[]> {
    return Array.from(this.db.values())
  }
  async getDeckKeys(): Promise<string[]> {
    return Array.from(this.db.keys())
  }

  // <collection:hash, collection>
  private readonly db = new Map<string, IDeckBase>()
  readonly loading = new Subject<boolean>()
}
