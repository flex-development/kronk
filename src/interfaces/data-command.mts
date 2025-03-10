/**
 * @file Interfaces - CommandData
 * @module kronk/interfaces/CommandData
 */

import type {
  Action,
  Argument,
  ArgumentInfo,
  ArgumentSyntax,
  Command,
  CommandInfo,
  Exit,
  Flags,
  List,
  Option,
  OptionInfo,
  OptionPriority,
  UnknownStrategy
} from '@flex-development/kronk'

/**
 * Data transfer object for commands.
 */
interface CommandData {
  /**
   * Callback to fire when the command is executed.
   *
   * @see {@linkcode Action}
   */
  action?: Action<any> | null | undefined

  /**
   * Aliases for the command.
   *
   * @see {@linkcode List}
   */
  aliases?: List<string> | string | null | undefined

  /**
   * Arguments for the command.
   *
   * @see {@linkcode Argument}
   * @see {@linkcode ArgumentInfo}
   * @see {@linkcode ArgumentSyntax}
   * @see {@linkcode List}
   */
  arguments?:
    | Argument
    | ArgumentInfo
    | List<Argument | ArgumentInfo | ArgumentSyntax>
    | string
    | null
    | undefined

  /**
   * Whether this is the default command.
   */
  default?: boolean | null | undefined

  /**
   * Description of the command.
   */
  description?: URL | string | null | undefined

  /**
   * Callback to fire after the command is executed.
   *
   * @see {@linkcode Action}
   */
  done?: Action<any> | null | undefined

  /**
   * Callback to fire when the process is exited.
   *
   * @see {@linkcode Exit}
   */
  exit?: Exit | null | undefined

  /**
   * Whether the command should be not displayed in help text.
   */
  hidden?: boolean | null | undefined

  /**
   * Merge strategy to use when merging global and local options.
   *
   * @see {@linkcode OptionPriority}
   *
   * @default 'local'
   */
  optionPriority?: OptionPriority | null | undefined

  /**
   * Options for the command.
   *
   * @see {@linkcode Flags}
   * @see {@linkcode List}
   * @see {@linkcode Option}
   * @see {@linkcode OptionInfo}
   */
  options?:
    | Flags
    | List<Flags | Option | OptionInfo>
    | Option
    | OptionInfo
    | null
    | undefined

  /**
   * Subcommands for the command.
   *
   * @see {@linkcode Command}
   * @see {@linkcode CommandInfo}
   * @see {@linkcode List}
   */
  subcommands?:
    | Command
    | CommandInfo
    | List<Command | CommandInfo | string>
    | string
    | null
    | undefined

  /**
   * Strategy for handling unknown command-line arguments.
   *
   * - `'argument'`: allow unknown command-arguments only
   * - `'option'`: allow unknown options only
   * - `false`: disallow unknown command-arguments and options
   * - `true`: allow unknown command-arguments and options
   *
   * @see {@linkcode UnknownStrategy}
   *
   * @default false
   */
  unknown?: UnknownStrategy | null | undefined
}

export type { CommandData as default }
