/**
 * @file Type Aliases - KronkEventListener
 * @module kronk/types/KronkEventListener
 */

import type { Awaitable, KronkEvent } from '@flex-development/kronk'

/**
 * Handle an `event`.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode KronkEvent}
 *
 * @template {KronkEvent} [T=KronkEvent]
 *  The emitted event
 *
 * @param {KronkEvent} event
 *  The emitted event
 * @return {Awaitable<undefined>}
 */
type KronkEventListener<T extends KronkEvent = KronkEvent> = (
  event: T
) => Awaitable<undefined>

export type { KronkEventListener as default }
