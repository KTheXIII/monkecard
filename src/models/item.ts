import * as io from 'io-ts'

export enum EItemType {
  Unknown  = -1,
  Memo     =  0,
  Question =  1,
  Task     =  2,
}
export type TItemType = keyof typeof EItemType

export interface ItemBase {
  type: EItemType | TItemType
  keywords: string[]
  lang?: string
  id: string
}

export interface Item extends ItemBase {
  hash: string
}

export interface Memo extends Item {
  front: string
  back: string
}

// export interface

export const ItemSource = io.type({
  type: io.union([
    io.literal(EItemType['Unknown']),
    io.literal(EItemType['Memo']),
    io.literal(EItemType['Question']),
    io.literal(EItemType[-1]),
    io.literal(EItemType[0]),
    io.literal(EItemType[1]),
  ]),
  keywords: io.array(io.string),
  lang: io.union([io.string, io.undefined]),
  id: io.string,
})
export type TItemSource = io.TypeOf<typeof ItemSource>

export const MemoSource = io.intersection([ItemSource, io.type({
  front: io.string,
  back: io.string,
})])
export type TMemoSource = io.TypeOf<typeof MemoSource>
