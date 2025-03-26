/**
 * @file Internal - resolveFlag
 * @module kronk/internal/resolveFlag
 */

import chars from '#enums/chars'
import tt from '#enums/tt'
import kCommand from '#internal/k-command'
import {
  ev,
  type Event,
  type Token,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import { ok } from 'devlop'

/**
 * Resolve long and short flag events.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  List of events
 * @param {TokenizeContext} context
 *  Tokenize context
 * @return {Event[]}
 *  List of changed events
 */
function resolveFlag(
  this: void,
  events: Event[],
  context: TokenizeContext
): Event[] {
  /**
   * Index of current event.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < events.length) {
    ok(events[index], 'expected event')
    const [event, token, ctx] = events[index]!

    if (event === ev.enter) {
      if (token.type !== tt.flag) {
        ok(token.type !== tt.id, 'expected no flag id token')
        ok(token.value !== undefined, 'expected token value')
        continue
      }

      // merge flag id events into flag tokens and split short flags.
      ok(token.long || token.short, 'expected long or short flag')

      /**
       * Next set of events.
       *
       * @const {Event[]} next
       */
      const next: Event[] = events.splice(index + 1, 2)

      ok(next[0], 'expected flag id event')
      ok(next[0][0] === ev.enter, 'expected flag id enter event')
      ok(next[0][1].type === tt.id, 'expected flag id token')
      const [, id] = next[0]

      // capture option flag id.
      id.value = context.sliceSerialize(id)
      ok(id.value, 'expected non-empty flag id token value')

      // set option flag.
      token.value = token.long
        ? chars.hyphen + chars.hyphen + id.value
        : chars.hyphen + id.value[0]!

      // handle flag when tokenizing in a `Command` instance context.
      if (context[kCommand]) {
        ok(context.findOption, 'expected `context.findOption`')
        ok(context.findSubOption, 'expected `context.findSubOption`')

        // find option associated with flag.
        if (!token.option) {
          const { value: flag } = token
          token.option = context.findOption(flag) ?? context.findSubOption(flag)
        }

        // split combined short flag.
        if (token.option && token.short && id.value.length > 1) {
          id.start._bufferIndex++
          id.start.column++
          id.start.offset++
          id.value = id.value.slice(1)

          // `next` set of events will be mutated, so capture current length.
          const { length } = next

          // determine flag combination strategy.
          // the flag accepting an argument must be specified after all boolean
          // flags. otherwise, the argument will be processed as several
          // combined flags.
          if (!token.option.optional && !token.option.required) {
            // boolean flag was combined.

            // the first character in `id.value` is now assumed to be a flag id.
            // the corresponding flag may be another boolean short flag, or a
            // flag that accepts an argument.

            /**
             * New flag token.
             *
             * @const {Token} flag
             */
            const flag: Token = Object.assign({}, token, {
              combined: true,
              option: null,
              value: undefined
            })

            // add flag events to continue processing any remaining
            // combined flags or option-arguments.
            next.unshift([event, flag, ctx])
            next.push([ev.exit, flag, ctx])
          } else {
            // flag representing optional or required option was combined.

            // `id.value` is now assumed to be an option-argument.
            id.type = tt.operand
            id.combined = true
            token.end = id.start
          }

          // re-insert previously removed flag id events, along with any events
          // that were added to continue processing any remaining combined flags
          // or option-arguments.
          events.splice(index + length, 0, ...next)
        }
      }
    }
  }

  return events
}

export default resolveFlag
