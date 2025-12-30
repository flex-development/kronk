/**
 * @file Interfaces - UsageData
 * @module kronk/interfaces/UsageData
 */

/**
 * An object describing command usage.
 */
interface UsageData {
  /**
   * The parts of the arguments descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible argument.
   *
   * @default
   *  generated using visible command arguments
   */
  arguments?: readonly string[] | string | null | undefined

  /**
   * The options descriptor, with `null` used to omit the descriptor completely.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible option.
   *
   * @default '[options]'
   */
  options?: string | null | undefined

  /**
   * The subcommands descriptor.
   *
   * > 👉 **Note**: Displayed in auto-generated help text **only** when a
   * > command has at least one visible subcommand.
   *
   * @default '[command]'
   */
  subcommand?: string | null | undefined
}

export type { UsageData as default }
