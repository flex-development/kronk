/**
 * @file Utilities - isKronkEvent
 * @module kronk/utils/isKronkEvent
 */

import kKronkEvent from '#internal/k-kronk-event'
import type { KronkEvent } from '@flex-development/kronk/events'

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
 *  `true` if `value` looks like a `KronkEvent`, `false` otherwise
 */
function isKronkEvent(this: void, value: unknown): value is KronkEvent {
  return (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    value !== null &&
    kKronkEvent in value
  )
}

export default isKronkEvent
