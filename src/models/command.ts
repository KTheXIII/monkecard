export interface ICommandResult {
  hint: string
  cmds: ICommandBase[]
}

export enum ECommandType {
  Normal,
  Option,
  Input,
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
  fn: () => ICommandResult
}

export interface ICommandInput extends ICommandBase {
  hint: string
  type: ECommandType.Input
  fn: (value: string) => void
}
