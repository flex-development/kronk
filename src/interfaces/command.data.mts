/**
 * @file Interfaces - CommandData
 * @module kronk/interfaces/CommandData
 */

import type {
  Action,
  ArgumentsData,
  Command,
  CommandUsageData,
  Exit,
  List,
  OptionPriority,
  OptionsData,
  SubcommandsData,
  UnknownStrategy,
  VersionData
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
   * @see {@linkcode ArgumentsData}
   */
  arguments?: ArgumentsData | null | undefined

  /**
   * Whether this is the default command.
   */
  default?: boolean | null | undefined

  /**
   * Description of the command.
   */
  description?: URL | string | null | undefined

  /**
   * The callback to fire after the command {@linkcode action} is executed.
   *
   * @see {@linkcode Action}
   */
  done?: Action<any> | null | undefined

  /**
   * The callback to fire when the process is exited.
   *
   * @see {@linkcode Exit}
   */
  exit?: Exit | null | undefined

  /**
   * Whether the command should be not displayed in help text.
   */
  hidden?: boolean | null | undefined

  /**
   * The strategy to use when merging global and local options.
   *
   * @see {@linkcode OptionPriority}
   *
   * @default 'local'
   */
  optionPriority?: OptionPriority | null | undefined

  /**
   * Options for the command.
   *
   * @see {@linkcode OptionsData}
   */
  options?: OptionsData | null | undefined

  /**
   * The parent command.
   *
   * @see {@linkcode Command}
   */
  parent?: Command | null | undefined

  /**
   * Subcommands for the command.
   *
   * @see {@linkcode SubcommandsData}
   */
  subcommands?: SubcommandsData | null | undefined

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
   * Command version configuration.
   *
   * @see {@linkcode VersionData}
   */
  version?: VersionData | null | undefined
}

export type { CommandData as default }
