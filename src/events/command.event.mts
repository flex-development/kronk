/**
 * @file Events - CommandEvent
 * @module kronk/events/CommandEvent
 */

import KronkEvent from '#events/kronk.event'
import kCommandEvent from '#internal/k-command-event'
import type { Command } from '@flex-development/kronk'

/**
 * A parsed command event.
 *
 * @see {@linkcode Command}
 * @see {@linkcode KronkEvent}
 *
 * @template {Command} [T=Command]
 *  The command instance
 *
 * @category
 *  events
 *
 * @class
 * @extends {KronkEvent}
 */
class CommandEvent<T extends Command = Command> extends KronkEvent {
  /**
   * The event name.
   *
   * @see {@linkcode Command.event}
   *
   * @public
   * @instance
   * @member {Command['event']} id
   */
  declare public id: Command['event']

  /**
   * Create a new command event.
   *
   * @param {T} command
   *  The command instance representing the parsed command
   */
  constructor(public command: T) {
    super(command.event)

    Object.defineProperty(this, kCommandEvent, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })
  }
}

export default CommandEvent
