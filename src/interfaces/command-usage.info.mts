/**
 * @file Interfaces - CommandUsageInfo
 * @module kronk/interfaces/CommandUsageInfo
 */

import type { CommandUsageData } from '@flex-development/kronk'

/**
 * Command usage info.
 *
 * @see {@linkcode CommandUsageData}
 *
 * @extends {CommandUsageData}
 */
interface CommandUsageInfo extends CommandUsageData {
  /**
   * Command arguments descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible command argument.
   *
   * @default
   *  generated using visible command arguments
   */
  arguments?: string | null | undefined

  /**
   * Command options descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible command option.
   *
   * @override
   *
   * @default '[options]'
   */
  options: string

  /**
   * Subcommands descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > subcommand has at least one visible subcommand.
   *
   * @override
   *
   * @default '[command]'
   */
  subcommand: string
}

export type { CommandUsageInfo as default }
