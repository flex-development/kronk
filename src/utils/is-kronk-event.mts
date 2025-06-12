/**
 * @file Utilities - isKronkEvent
 * @module kronk/utils/isKronkEvent
 */

import kKronkEvent from '#internal/k-kronk-event'
import { KronkEvent } from '@flex-development/kronk/events'

/**
 * Check if `value` is a {@linkcode KronkEvent}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is KronkEvent}
 *  `true` if `value` is looks like `KronkEvent`, `false` otherwise
 */
function isKronkEvent(this: void, value: unknown): value is KronkEvent {
  return (
    typeof value === 'object' &&
    value !== null &&
    (
      value instanceof KronkEvent ||
      kKronkEvent in value && value[kKronkEvent] === true
    )
  )
}

export default isKronkEvent
