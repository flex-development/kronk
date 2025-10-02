/**
 * @file Interfaces - UsageData
 * @module kronk/interfaces/UsageData
 */

/**
 * An object describing command usage.
 */
interface UsageData {
  /**
   * Command arguments descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible argument.
   *
   * @default
   *  generated using visible command arguments
   */
  arguments?: string | null | undefined

  /**
   * Command options descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible option.
   *
   * @default '[options]'
   */
  options?: string | null | undefined

  /**
   * Subcommands descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible subcommand.
   *
   * @default '[command]'
   */
  subcommand?: string | null | undefined
}

export type { UsageData as default }
