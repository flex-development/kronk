/**
 * @file Test Utilities - snapshotEvents
 * @module tests/utils/snapshotEvents
 */

import type {
  Event,
  EventType,
  Token,
  TokenizeContext
} from '@flex-development/fsm-tokenizer'
import { ksort, shake } from '@flex-development/tutils'

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
  /**
   * The tokenize context.
   *
   * @var {TokenizeContext} context
   */
  let context: TokenizeContext

  return events.map(event => (context = event[2], [
    event[0],
    Object.defineProperties(event[1], { toJSON: { value: toJSON } })
  ]))

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
      global: this.global,
      id: this.id,
      long: this.long,
      mandatory: this.mandatory,
      next: this.next ? toJSON.call(this.next) : undefined,
      option: this.option ? String(this.option) : this.option,
      previous: this.previous ? toJSON.call(this.previous) : undefined,
      required: this.required,
      serialized: context.sliceSerialize(this),
      short: this.short,
      start: this.start,
      type: this.type,
      value: this.value,
      variadic: this.variadic
    }))
  }
}

export default snapshotEvents
