import { CardDB } from '@scripts/CardDB'
import { DeckDB } from '@scripts/DeckDB'
import { Command, ICommandNode } from '@commands/command'

export class OpenPage implements ICommandNode {
  readonly name: string
  constructor(name: string, private readonly fn: () => void) {
    this.name = `open > page ${name}`
  }

  async run(args: string[], cmd: Command): Promise<void> {
    this.fn()
  }

  async eval(args: string[], cmd: Command): Promise<string[]> {
    return [this.name]
  }
}

export class OpenDeck implements ICommandNode {
  readonly name = `open > deck {title | id | source}`
  constructor(private readonly deckDB: DeckDB) {}

  async run(args: string[], cmd: Command): Promise<void> {
    this.deckDB.selectDeck(args[0])
  }

  async eval(args: string[], cmd: Command): Promise<string[]> {
    const list = await this.deckDB.getDeckKeys()
    return list.map(key => `open > deck ${key}`)
  }
}

export class OpenCard implements ICommandNode {
  readonly name = 'open > card {id}'
  constructor(private readonly cardDB: CardDB) {}

  async run(args: string[], cmd: Command): Promise<void> {
    try {
      const card = await this.cardDB.getCard(args[0])
      console.log(card)
    } catch (e) {
      // NOTE: ignore
    }
  }

  async eval(args: string[], cmd: Command): Promise<string[]> {
    const list = await this.cardDB.getCardKeys()
    return list.map(key => `open > card ${key}`)
  }
}
