/**
 * @file Type Aliases - CommandEventListener
 * @module kronk/types/CommandEventListener
 */

import type { Command, CommandEvent } from '@flex-development/kronk'

/**
 * Handle a parsed command `event`.
 *
 * @see {@linkcode Command}
 * @see {@linkcode CommandEvent}
 *
 * @template {Command} [T=Command]
 *  The parsed command
 *
 * @param {CommandEvent<T>} event
 *  The emitted parsed command event
 * @return {undefined}
 */
type CommandEventListener<T extends Command = Command> = (
  event: CommandEvent<T>
) => undefined

export type { CommandEventListener as default }
