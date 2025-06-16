/**
 * @file Interfaces - CommandUsageData
 * @module kronk/interfaces/CommandUsageData
 */

/**
 * An object describing command usage.
 */
interface CommandUsageData {
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
   * @default '[options]'
   */
  options?: string | null | undefined

  /**
   * Subcommands descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > subcommand has at least one visible subcommand.
   *
   * @default '[command]'
   */
  subcommand?: string | null | undefined
}

export type { CommandUsageData as default }
