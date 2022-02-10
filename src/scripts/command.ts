import { Subject } from 'rxjs'

type TMapGeneric<T> = [string, T]
type TMap<T> = Map<string, T>

/**
 * Command manages the state of the command in the application.
 */
export class Command<T> {
  constructor() {
    this.sub(s => this.next_cmds = s)
    this.extend.subscribe(s => this.extend_cmds = new Map(s))
    this.extend.subscribe(s => this.subject.next(this.next_cmds))
  }

  /**
   * This runs the command in the 'next list'.
   *
   * @param cmd Command name
   * @returns Promise<T>
   */
  async run(cmd: string) {
    const command = this.next_cmds.get(cmd) ?? this.extend_cmds.get(cmd)
    if (!command) return
    if (typeof command === 'function') {
      this.cmd_history.push(cmd)
      return command(cmd)
    }
  }

  /**
   * Get the next command list as string
   * @returns list of commands
   */
  cmdStrings(): string[] {
    return [...Array.from(this.next_cmds.keys())]
  }
  cmdBaseStrings(): string[] {
    return Array.from(this.base_cmds.keys())
  }
  cmdExtendStrings(): string[] {
    return Array.from(this.extend_cmds.keys())
  }
  /**
   * Set next command list to the base command list.
   */
  restore() {
    this.subject.next(this.base_cmds)
  }
  resetBase() {
    this.base_cmds.clear()
    this.next([])
  }
  resetExtend() {
    this.extend.next([])
  }
  addBase(name: string, cmd: T) {
    this.base_cmds.set(name, cmd)
  }
  addNext(name: string, cmd: T) {
    this.next_cmds.set(name, cmd)
    this.subject.next(this.next_cmds)
  }
  nextExtend(cmds: TMapGeneric<T>[]) {
    this.extend.next(cmds)
  }
  next(cmds: TMapGeneric<T>[]) {
    this.subject.next(new Map(cmds))
  }
  sub(s: (cmd: TMap<T>) => void) {
    return this.subject.subscribe(s)
  }

  private cmd_history: string[] = []
  private base_cmds: TMap<T> = new Map()
  private extend_cmds: TMap<T> = new Map()
  private next_cmds: TMap<T> = new Map()
  private subject = new Subject<TMap<T>>()
  private extend = new Subject<TMapGeneric<T>[]>()
}
