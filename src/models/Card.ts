import * as io from 'io-ts'

export enum ECardType {
  Unknown  = -1,
  Memo     =  0,
  Question =  1,
  Tenta    =  2,
}
export type TCardType = keyof typeof ECardType

export interface Card {
  type: ECardType | TCardType
  keywords: string[]
  lang?: string
  id: string
  deck: string   // url or hash of local item
  hash: string   // hash of item source
}

export interface Memo extends Card {
  front: string
  back: string
}

export interface ITenta {
  text: string
  solution: string
  hint?: string
  tag: string[]

  head?: ITenta
  branch?: ITenta[]
}

export interface TentaItem extends Card {
  trunk: ITenta
}

export const CardSource = io.type({
  type: io.union([
    io.literal(ECardType['Unknown']),
    io.literal(ECardType['Memo']),
    io.literal(ECardType['Question']),
    io.literal(ECardType[-1]),
    io.literal(ECardType[0]),
    io.literal(ECardType[1]),
  ]),
  keywords: io.array(io.string),
  lang: io.union([io.string, io.undefined]),
  id: io.string,
})
export type TCardSource = io.TypeOf<typeof CardSource>

export const MemoSourceBase = io.type({
  front: io.string,
  back: io.string
})
export const MemoSource = io.intersection([CardSource, MemoSourceBase])
export type TMemoSource = io.TypeOf<typeof MemoSource>

export const TentaSourceBase = io.type({
  text: io.union([io.string, io.undefined]),
  solution: io.union([io.string, io.undefined]),
  hint: io.union([io.string, io.undefined, io.null]),
  tag: io.union([io.array(io.string), io.undefined, io.null]),
  branch: io.union([io.array(io.unknown), io.undefined, io.null]),
})
export const TentaSource = io.intersection([CardSource, TentaSourceBase])
export type TTentaSource = io.TypeOf<typeof TentaSource>
