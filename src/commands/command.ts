import Fuse from 'fuse.js'

// Interface for controlling the command palette
export interface CommandInterface {
  setHint(text: string): void
  setCommands(cmds: string[]): void
  isHidden(): boolean
  setIsHidden(isHidden: boolean): void
  isInput(): boolean
  setIsInput(isInput: boolean): void
  setMessage(text: string): void
  setSearch(text: string): void
}

// Simple lexer
class LumaLexer {
  init(str: string): void {
    this.str = str
    this.cursor = 0
  }

  tokens(): string[] {
    const tokens: string[] = []
    let token = this.nextToken()
    if (token === null) return tokens
    tokens.push(token)
    while (token !== null) {
      token = this.nextToken()
      if (token !== null) tokens.push(token)
    }
    return tokens
  }

  nextToken(): string | null {
    if (!this.hasNext()) return null
    if (this.str[this.cursor] === ' ') this.cursor++
    if (!this.hasNext()) return null

    let str = ''
    if (this.str[this.cursor] === `'`) {
      do {
        str += this.str[this.cursor++]
      } while (this.str[this.cursor] != `'` && this.hasNext())
      if (this.hasNext()) str += this.str[this.cursor++]
      return str
    }

    if (this.str[this.cursor] === `"`) {
      do {
        str += this.str[this.cursor++]
      } while (this.str[this.cursor] != `"` && this.hasNext())
      if (this.hasNext()) str += this.str[this.cursor++]
      return str
    }

    do {
      str += this.str[this.cursor++]
    } while (this.str[this.cursor] != ' ' && this.hasNext())
    this.cursor++
    if (str === ' ') return null
    return str
  }

  private hasNext(): boolean {
    return this.cursor < this.str.length
  }

  private str!: string
  private cursor!: number
}

export interface ICommandNode {
  name: string
  run(args: string[], cmd: Command): Promise<void>
  eval(args: string[], cmd: Command): Promise<string[]>
}

// Command acts as a wrapper for the command palette
export class Command {
  async init(view: CommandInterface): Promise<void> {
    this.view = view
    this.view.setHint('search command')
    this.commandNames = [
      'open home',
      'open deck'
    ]
    this.setCommands(this.commandNames)
  }

  async run(cmd: string): Promise<void> {
    const res = this.fuse.search(cmd)
    if (res.length === 0) return
    const { item } = res[0]
    this.luma.init(item)
    const tokens = this.luma.tokens()
    console.log(tokens)

    // const tokens = this.luma.tokens()
    // const trunkName = tokens.shift()
    // if (!trunkName) return
    // const trunk = this.trunks.get(trunkName)
    // if (!trunk) return
    // const strs = tokens.filter(t => t !== '>')
    // const cmdName = strs.shift()
    // if (cmdName) {
    //   const cmd = this.commands.find(c => c.name.includes(cmdName))
    //   if (cmd) {
    //     await cmd.run(strs, this.view)
    //     return
    //   }
    // }
  }

  async eval(text: string): Promise<void> {
    if (text.length === 0) {
      this.setCommands(this.commandNames)
      return
    }

    const res = this.fuse.search(text)
    if (res.length === 0) {
      this.setCommands([])
      this.view.setMessage('no command found...')
      return
    }

    this.setCommands(res.map(({ item }) => item))
    console.log(res)

    const { item } = res[0]
    this.luma.init(item)
    const tokens = this.luma.tokens()
    console.log(tokens)

    // if (cmd === '') {
    //   this.view?.setCommands(this.names)
    //   return
    // }

    // this.luma.init(cmd)
    // const tokens = this.luma.tokens()
    // const trunk  = tokens.shift()
    // if (trunk) {
    //   const cmds = this.trunks.get(trunk)
    //   const list: string[] = []
    //   if (cmds) {
    //     for (const i of cmds) {
    //       const cmd = this.commands[i]
    //       list.push(...(await cmd.eval(tokens, this.view)))
    //     }
    //     this.view.setCommands(list)
    //     return
    //   }
    // }
  }

  async input(text: string): Promise<void> {
    console.log('input', text)
  }

  register(cmd: ICommandNode) {
    const n = this.commandList.findIndex(c => c.name === cmd.name)
    if (n !== -1) this.commandList[n] = cmd
    else this.commandList.push(cmd)

    for (let i = 0; i < this.commandList.length; i++) {
      const name   = this.commandList[i].name
      const depths = name.split('>').map(n => n.trim())
      const first  = depths.shift()
      if (!first) continue
      const trunk = this.commandTrees.get(first) ?? new Set()
      trunk.add(i)
      this.commandTrees.set(first, trunk)
    }
    // this.names = Array.from(this.trunks.keys())
    // this.view.setCommands(this.names)
  }

  unregister(cmd: ICommandNode) {
    // const n = this.commands.findIndex(c => c.name === cmd.name)
    // if (n === -1) return
    // this.commands.splice(n, 1)
    // let key = ''
    // this.trunks.forEach((c, k) => {
    //   if (n < c.length) c.splice(n, 1)
    //   if (c.length === 0) key = k
    // })
    // this.trunks.delete(key)
    // this.names = Array.from(this.trunks.keys())
    // this.view.setCommands(this.names)
  }

  setCommands(cmds: string[]) {
    this.results = cmds
    this.view.setCommands(cmds)
    this.fuse.setCollection(cmds)
  }
  setSearch(text: string) {
    this.view.setSearch(text)
  }
  setIsHidden(isHidden: boolean) {
    this.view.setIsHidden(isHidden)
  }

  private results: string[] = []

  private fuse: Fuse<string> = new Fuse([])
  private view!: CommandInterface
  private luma = new LumaLexer()
  private commandNames: string[] = []
  private commandList: ICommandNode[] = []
  private commandTrees: Map<string, Set<number>> = new Map()
}
