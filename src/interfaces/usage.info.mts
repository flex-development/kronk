/**
 * @file Interfaces - UsageInfo
 * @module kronk/interfaces/UsageInfo
 */

import type { UsageData } from '@flex-development/kronk'

/**
 * Command usage info.
 *
 * @see {@linkcode UsageData}
 *
 * @extends {UsageData}
 */
interface UsageInfo extends UsageData {
  /**
   * The parts of the arguments descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible argument.
   *
   * @override
   */
  arguments: readonly string[]

  /**
   * The options descriptor, with `null` used to omit the descriptor completely.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible command option.
   *
   * @override
   */
  options: string | null

  /**
   * The subcommands descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > subcommand has at least one visible subcommand.
   *
   * @override
   */
  subcommand: string
}

export type { UsageInfo as default }
