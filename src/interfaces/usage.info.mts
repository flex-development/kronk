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
   * Command options descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible command option.
   *
   * @override
   */
  options: string

  /**
   * Subcommands descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > subcommand has at least one visible subcommand.
   *
   * @override
   */
  subcommand: string
}

export type { UsageInfo as default }
