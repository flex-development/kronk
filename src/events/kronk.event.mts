/**
 * @file Events - KronkEvent
 * @module kronk/events/KronkEvent
 */

import kKronkEvent from '#internal/k-kronk-event'
import type { KronkEventName } from '@flex-development/kronk'

/**
 * An event.
 *
 * @category
 *  events
 *
 * @class
 */
class KronkEvent {
  /**
   * Create a new kronk event.
   *
   * @see {@linkcode KronkEventName}
   *
   * @param {KronkEventName} id
   *  The unique id representing the event
   */
  constructor(public id: KronkEventName) {
    Object.defineProperty(this, kKronkEvent, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })
  }

  /**
   * Get the event as a human-readable string.
   *
   * @public
   * @instance
   *
   * @return {string}
   *  String representation of `this` event
   */
  public toString(): string {
    return this.id
  }
}

export default KronkEvent
