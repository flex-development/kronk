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
  CommandUsageData,
  Exit,
  Flags,
  List,
  Option,
  OptionInfo,
  OptionPriority,
  UnknownStrategy,
  Version,
  VersionOption,
  VersionOptionInfo
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
   * A summary of the command.
   */
  summary?: string | null | undefined

  /**
   * The strategy to use for handling unknown command-line arguments.
   *
   * @see {@linkcode UnknownStrategy}
   *
   * @default false
   */
  unknown?: UnknownStrategy | null | undefined

  /**
   * An object describing how the command is used.
   *
   * @see {@linkcode CommandUsageData}
   *
   * @default
   *  { arguments: null, options: '[options]', subcommand: '[command]' }
   */
  usage?: CommandUsageData | null | undefined

  /**
   * The version of the command.
   *
   * @see {@linkcode Version}
   * @see {@linkcode VersionOption}
   * @see {@linkcode VersionOptionInfo}
   */
  version?: Version | VersionOption | VersionOptionInfo | null | undefined
}

export type { CommandData as default }
