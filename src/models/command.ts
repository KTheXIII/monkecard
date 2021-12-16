export interface ICommandResult {
  hint: string
  cmds: Promise<ICommandBase[]> | ICommandBase[]
}

export enum ECommandType {
  Normal,
  Option,
  Input,
  Sub,
}

export interface ICommandBase {
  name: string
  type: ECommandType
}

export interface ICommandNormal extends ICommandBase {
  type: ECommandType.Normal
  fn: () => void
}

export interface ICommandOption extends ICommandBase {
  type: ECommandType.Option
  hint: string
  list: () => string[]
  fn: (value: string) => void
}

export interface ICommandSubs extends ICommandBase {
  type: ECommandType.Sub
  fn: () => ICommandResult
}

export interface ICommandInput extends ICommandBase {
  hint: string
  type: ECommandType.Input
  fn: (value: string) => void
}

export function createInputCommand(name: string, hint: string,
  cmd: (input: string) => void): ICommandInput {
  return {
    name,
    type: ECommandType.Input,
    hint,
    fn: cmd,
  }
}
