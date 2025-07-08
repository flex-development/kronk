/**
 * @file Interfaces - CommandSnapshot
 * @module kronk/interfaces/CommandSnapshot
 */

import type {
  CommandName,
  OptionValues,
  OptionValueSources
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
}

export type { CommandSnapshot as default }
