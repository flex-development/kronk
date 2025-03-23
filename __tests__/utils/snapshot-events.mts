/**
 * @file Test Utilities - snapshotEvents
 * @module tests/utils/snapshotEvents
 */

import { ksort, shake } from '@flex-development/tutils'
import type { Event, EventType, Token } from '@flex-development/vfile-tokenizer'

/**
 * Get a snapshot-compliant list of events.
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  List of events
 * @return {[EventType, Token][]}
 *  List of event types and tokens
 */
function snapshotEvents(this: void, events: Event[]): [EventType, Token][] {
  return events.map(event => [
    event[0],
    Object.defineProperties(event[1], { toJSON: { value: toJSON } })
  ])

  /**
   * @this {Token}
   *
   * @return {Record<string, any>}
   *  JSON-ish representation of `this` token
   */
  function toJSON(this: Token): Record<string, any> {
    return shake(ksort({
      attached: this.attached,
      combined: this.combined,
      command: this.command ? String(this.command) : this.command,
      end: this.end,
      id: this.id,
      long: this.long,
      mandatory: this.mandatory,
      next: this.next ? toJSON.call(this.next) : undefined,
      option: this.option ? String(this.option) : this.option,
      previous: this.previous ? toJSON.call(this.previous) : undefined,
      required: this.required,
      short: this.short,
      start: this.start,
      type: this.type,
      value: this.value,
      variadic: this.variadic
    }))
  }
}

export default snapshotEvents
