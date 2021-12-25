export enum ECommandMode {
  Normal,
  Input,
}

export interface ICommandResult {
  success: boolean
  default?: string,
  mode?: ECommandMode
  hint?: string
  restore?: () => void
  fn?: TCommand
}

export type TCommand = (input: string) => Promise<ICommandResult | void>
export type TCommandMap = Map<string, TCommand>
