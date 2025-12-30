/**
 * @file Interfaces - CommandData
 * @module kronk/interfaces/CommandData
 */

import type {
  Action,
  ArgumentsData,
  Command,
  ExamplesData,
  Exit,
  Help,
  HelpableInfo,
  HelpCommandData,
  HelpOptionData,
  HelpTextOptions,
  List,
  OptionPriority,
  OptionsData,
  SubcommandsData,
  UnknownStrategy,
  UsageData,
  VersionData
} from '@flex-development/kronk'

/**
 * Data transfer object for commands.
 *
 * @see {@linkcode HelpableInfo}
 *
 * @extends {HelpableInfo}
 */
interface CommandData extends HelpableInfo {
  /**
   * The callback to fire when the command is executed.
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
   * The callback to fire after the command {@linkcode action} is executed.
   *
   * @see {@linkcode Action}
   */
  done?: Action<any> | null | undefined

  /**
   * An example of the command, or a list of examples.
   *
   * @see {@linkcode ExamplesData}
   */
  examples?: ExamplesData | null | undefined

  /**
   * The callback to fire when the process is exited.
   *
   * @see {@linkcode Exit}
   */
  exit?: Exit | null | undefined

  /**
   * Options for formatting help text,
   * or the utility to use when generating help text.
   *
   * @see {@linkcode Help}
   * @see {@linkcode HelpTextOptions}
   *
   * @default
   *  new Help()
   */
  help?: Help | HelpTextOptions | null | undefined

  /**
   * Customize the help subcommand, or disable it (`false`).
   *
   * A `help` command is added by default if
   * the command has {@linkcode subcommands}.
   *
   * > 👉 **Note**: To configure the help command or option (i.e. `help help`,
   * > `help --help`) for `helpCommand`, a `Command` instance must be used.
   * > Both `helpCommand.helpCommand` and `helpCommand.helpOption` are set to
   * > `false` when `helpCommand` is not a `Command`.
   *
   * @see {@linkcode HelpCommandData}
   *
   * @default
   *  { description: 'show help', name: 'help' }
   */
  helpCommand?: HelpCommandData | null | undefined

  /**
   * Customize the help option, or disable it (`false`).
   *
   * @see {@linkcode HelpOptionData}
   *
   * @default
   *  { description: 'show help', flags: '-h, --help' }
   */
  helpOption?: HelpOptionData | null | undefined

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
   * @see {@linkcode UsageData}
   *
   * @default
   *  { arguments: null, options: '[options]', subcommand: '[command]' }
   */
  usage?: UsageData | null | undefined

  /**
   * Command version configuration.
   *
   * @see {@linkcode VersionData}
   */
  version?: VersionData | null | undefined
}

export type { CommandData as default }
