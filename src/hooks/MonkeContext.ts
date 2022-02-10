import React, { createContext } from 'react'

import { TCommand } from '@models/command'
import { Command } from '@scripts/command'
import { DeckDB } from '@scripts/DeckDB'
import { CardDB } from '@scripts/CardDB'
import { MonkeDB } from '@scripts/MonkeDB'

interface MonkeContext {
  monke: MonkeDB | null
  deck: DeckDB | null
  card: CardDB | null
  command: Command<TCommand> | null
}

export const MonkeContext = createContext<MonkeContext>({
  monke: null,
  deck: null,
  card: null,
  command: null
})
