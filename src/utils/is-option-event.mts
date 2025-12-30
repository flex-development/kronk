/**
 * @file Utilities - isOptionEvent
 * @module kronk/utils/isOptionEvent
 */

import kOptionEvent from '#internal/k-option-event'
import isKronkEvent from '#utils/is-kronk-event'
import type { OptionEvent } from '@flex-development/kronk/events'

/**
 * Check if `value` is a {@linkcode OptionEvent}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is OptionEvent}
 *  `true` if `value` looks like a `OptionEvent`, `false` otherwise
 */
function isOptionEvent(this: void, value: unknown): value is OptionEvent {
  return isKronkEvent(value) && kOptionEvent in value
}

export default isOptionEvent
