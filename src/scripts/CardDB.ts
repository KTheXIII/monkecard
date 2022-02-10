
import { isLeft, isRight } from 'fp-ts/lib/Either'
import md5 from 'crypto-js/md5'
import {
  Card,
  CardSource,
  Memo,
  MemoSource,
  CardException,
  ECardType
} from '@models/Card'

async function sourceToMemo(srcHash: string, hash: string, source: unknown): Promise<Memo> {
  const decode = MemoSource.decode(source)
  if (isLeft(decode)) return Promise.reject(decode.left)
  const item = decode.right
  return {
    type: ECardType.Memo,
    tags: item.tags,
    lang: item.lang,
    id: item.id,
    deck: srcHash,
    hash: hash,
    front: item.front,
    back: item.back
  } as Memo
}

async function sourceToCard(srcHash: string, hash: string, source: unknown): Promise<Card> {
  const dec = CardSource.decode(source)
  if (isRight(dec)) {
    const { type } = dec.right
    switch (type) {
    case 0:
    case 'Memo':
      return sourceToMemo(srcHash, hash, source)

    case 1:
    case 'Question':
      return Promise.reject(new CardException('Question is not supported yet'))

    case 2:
    case 'Tenta':
      return Promise.reject(new CardException('Tenta is not supported yet'))

    default:
    case -1:
    case 'Unknown':
      return Promise.reject(new CardException('Unknown card type'))
    }
  } else {
    return Promise.reject(dec.left)
  }
}

export class CardDB {
  async getCard(id: string): Promise<Card> {
    const item = this.db.get(id)
    if (item) return Promise.resolve(item)
    else return Promise.reject(`No card with id:${id}`)
  }

  /**
   * Load card from source to DB
   * @param srcHash URL hash or item hash if it's a local item
   * @param card card source object
   * @returns card key
   */
  async loadCard(srcHash: string, card: unknown): Promise<string> {
    const hash = md5(JSON.stringify(card)).toString()
    try {
      const value = await sourceToCard(srcHash, hash, card)
      this.db.set(hash, value)
      return Promise.resolve(hash)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getCardList(): Promise<Card[]> {
    return Array.from(this.db.values())
  }

  async getCardKeys(): Promise<string[]> {
    return Array.from(this.db.keys())
  }

  // <hash, item>
  private readonly db = new Map<string, Card>()
}
