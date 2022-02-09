import React, { createContext } from 'react'
import { DeckDB } from '../scripts/DeckDB'
import { CardDB } from '../scripts/CardDB'
import { MonkeDB } from './../scripts/MonkeDB'

interface MonkeContext {
  monke: MonkeDB | null
  deck: DeckDB | null
  card: CardDB | null
}

export const MonkeContext = createContext<MonkeContext>({
  monke: null,
  deck: null,
  card: null
})
