/**
 * @file Utilities - isCommandEvent
 * @module kronk/utils/isCommandEvent
 */

import kCommandEvent from '#internal/k-command-event'
import isKronkEvent from '#utils/is-kronk-event'
import type { CommandEvent } from '@flex-development/kronk/events'

/**
 * Check if `value` is a {@linkcode CommandEvent}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is CommandEvent}
 *  `true` if `value` looks like a `CommandEvent`, `false` otherwise
 */
function isCommandEvent(this: void, value: unknown): value is CommandEvent {
  return isKronkEvent(value) && kCommandEvent in value
}

export default isCommandEvent
