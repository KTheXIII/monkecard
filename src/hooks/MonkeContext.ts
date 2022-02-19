import React, { createContext } from 'react'

import { DeckDB } from '@scripts/DeckDB'
import { CardDB } from '@scripts/CardDB'
import { MonkeDB } from '@scripts/MonkeDB'
import { Command } from '@commands/command'

interface MonkeContext {
  monke: MonkeDB | null
  deck:  DeckDB | null
  card:  CardDB | null
  cmd:   Command | null
}

export const MonkeContext = createContext<MonkeContext>({
  monke: null,
  deck: null,
  card: null,
  cmd: null
})
