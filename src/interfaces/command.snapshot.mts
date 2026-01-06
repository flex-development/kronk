/**
 * @file Interfaces - CommandSnapshot
 * @module kronk/interfaces/CommandSnapshot
 */

import type {
  ArgumentValueSources,
  CommandName,
  OptionValues,
  OptionValueSources,
  UsageInfo
} from '@flex-development/kronk'

/**
 * Object representing a command overview.
 */
interface CommandSnapshot {
  /**
   * List of ancestor command names.
   *
   * @see {@linkcode CommandName}
   */
  ancestors: CommandName[]

  /**
   * List of parsed command arguments.
   */
  args: any[]

  /**
   * List, where each index is the position of a command-argument
   * and each value is the source of the argument.
   *
   * @see {@linkcode ArgumentValueSources}
   */
  argumentValueSources: ArgumentValueSources

  /**
   * List of raw command arguments.
   */
  argv: string[]

  /**
   * The name of the command.
   *
   * @see {@linkcode CommandName}
   */
  command: CommandName

  /**
   * Record, where each key is an option key and each value is the source of the
   * parsed option value.
   *
   * @see {@linkcode OptionValueSources}
   */
  optionValueSources: OptionValueSources

  /**
   * Parsed command options.
   *
   * @see {@linkcode OptionValues}
   */
  opts: OptionValues

  /**
   * Parsed command options (with globals).
   *
   * @see {@linkcode OptionValues}
   */
  optsWithGlobals: OptionValues

  /**
   * The command usage info.
   *
   * @see {@linkcode UsageInfo}
   */
  usage: UsageInfo
}

export type { CommandSnapshot as default }
