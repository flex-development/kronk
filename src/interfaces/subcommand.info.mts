/**
 * @file Interfaces - SubcommandInfo
 * @module kronk/interfaces/SubcommandInfo
 */

import type { CommandInfo } from '@flex-development/kronk'

/**
 * Data used to create subcommands.
 *
 * @see {@linkcode CommandInfo}
 *
 * @extends {CommandInfo}
 */
interface SubcommandInfo extends CommandInfo {
  /**
   * Options for formatting help text,
   * or the utility to use when generating help text.
   *
   * @override
   */
  help?: null | undefined

  /**
   * The name of the subcommand.
   */
  name: string
}

export type { SubcommandInfo as default }
