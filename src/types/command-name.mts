/**
 * @file Type Aliases - CommandName
 * @module kronk/types/CommandName
 */

/**
 * The name of a command.
 *
 * Parent commands do not need to have a name, but all subcommands must have a
 * name. Valid command names are non-empty strings.
 */
type CommandName = string | null

export type { CommandName as default }
