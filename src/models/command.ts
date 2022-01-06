export enum ECommandMode {
  Normal,
  Input,
}

export interface ICommandResult {
  success: boolean      // Tells if the command was successful
  value?: string        // Default value to the user input
  mode?: ECommandMode
  hint?: string         // Hint to be displayed to the user
  restore?: () => void  // Function to restore the previous state
  fn?: TCommand         // Next command to be executed, used when in input mode
  pre?: TCommand        // Command to be executed before the input
}

export interface ICommand {
  mode?: ECommandMode  // Defaults to normal
}

export type TCommand = (input: string) => Promise<ICommandResult | void>
export type TCommandMap = Map<string, TCommand>
