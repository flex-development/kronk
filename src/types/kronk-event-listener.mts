/**
 * @file Type Aliases - KronkEventListener
 * @module kronk/types/KronkEventListener
 */

import type { KronkEvent } from '@flex-development/kronk'

/**
 * Handle an `event`.
 *
 * @see {@linkcode KronkEvent}
 *
 * @template {KronkEvent} [T=KronkEvent]
 *  The emitted event
 *
 * @param {KronkEvent} event
 *  The emitted event
 * @return {undefined}
 */
type KronkEventListener<T extends KronkEvent = KronkEvent> = (
  event: T
) => undefined

export type { KronkEventListener as default }
