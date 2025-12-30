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
import type { Option } from '@flex-development/kronk'
import { ok } from 'devlop'

export default resolveFlag

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
      if (context[kCommand] && context.command) {
        findOption(token.value, token, context) // find corresponding option.

        // split combined short flag.
        if (token.short && id.value.length > 1) {
          id.value = id.value.slice(1) // remove already processed character.

          // fix end location of original flag token.
          token.end.column = token.start.column + token.value.length
          token.end.offset = token.start.offset + token.value.length

          // fix end position in string chunk of original flag token.
          if (token.end._bufferIndex < 0) token.end._index--
          token.end._bufferIndex = token.start._bufferIndex
          token.end._bufferIndex += token.value.length

          /**
           * The distance from the beginning of the token value.
           *
           * @var {number} k
           */
          let k: number = -1

          /**
           * The value of the current flag id token.
           *
           * @var {string} value
           */
          let value: string = id.value

          // treat the first character in `value` as a short flag id until an
          // option is not found.
          // if any portion of the `id.value` is left, it will be considered an
          // operand for `token.value` or the last combined flag.
          // this means short flags can be combined with operands as long as the
          // first character in the operand is not also a short flag id.
          while (value.length) {
            /**
             * The new flag token.
             *
             * @const {Token} flag
             */
            const flag: Token = Object.assign({}, token, {
              combined: true,
              end: Object.assign({}, token.end),
              start: Object.assign({}, token.start)
            })

            // look for an option.
            // the option may be local, global, or an option known only
            // to the current default command.
            // break once an option is not found to treat the current `value`
            // as an operand for `token.value`, or the last combined flag.
            findOption(chars.hyphen + value[0]!, flag, context)
            if (!flag.option) break
            ok(typeof flag.value === 'string', 'expected string token value')

            // get distance from beginning of original flag token.
            k = token.value.length + id.value.length - value.length

            // fix start location of new flag token.
            flag.start.column += k
            flag.start.offset = flag.start.column - 1

            // fix end location of new flag token.
            flag.end.column += flag.value.length - 1
            flag.end.offset = flag.end.column - 1

            // fix position in string chunk of new flag token.
            // note: when serialized, the token value will not start
            // with a hyphen. `findOption` prepends the hyphen.
            flag.start._bufferIndex = token.start._bufferIndex + k
            flag.end._bufferIndex = flag.start._bufferIndex + 1

            // move one past original flag exit event and onto next character.
            index += 2
            value = value.slice(1)

            // add new flag event pack.
            events.splice(index, 0, [event, flag, ctx], [ev.exit, flag, ctx])
          }

          // treat the rest of `value` as an operand.
          if (value) {
            id.type = tt.operand
            id.combined = true // operand was combined with flags.

            // all of `value` is an operand if still equal to `id.value`.
            // otherwise, set new operand value.
            if (value === id.value) k = 1
            else id.value = value

            // fix start location of operand.
            id.start.column += k
            id.start.offset = id.start.column - 1

            // fix start position in string chunk of operand.
            id.start._bufferIndex += k

            // move one past original flag exit event.
            index += 2

            // add new operand event pack.
            events.splice(index, 0, [event, id, ctx], [ev.exit, id, ctx])
          }
        }
      }
    }
  }

  return events
}

/**
 * Find an option for `token`, setting `token.option`.
 *
 * The option may be local, global, or an option known only
 * to the current default command.
 *
 * > 👉 **Note**: Sets `token.value` to `flag` if an option is found.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {string} flag
 *  The option flag
 * @param {Token} token
 *  The current token
 * @param {TokenizeContext} context
 *  Tokenize context
 * @return {undefined}
 */
function findOption(
  this: void,
  flag: string,
  token: Token,
  context: TokenizeContext
): undefined {
  ok(context[kCommand], 'expected to be in `Command` context')
  ok(context.command, 'expected `context.command`')

  // look for a local option.
  token.option = context.command.findOption(flag, 0)

  // capture current command or continue looking for option and command.
  if (token.option) {
    token.command = context.command
  } else {
    token.option = context.command.findOption(flag)

    // capture command or look for global option and command.
    if (token.option) {
      token.command = context.command.defaultCommand
    } else {
      for (const ancestor of context.command.ancestors()) {
        /**
         * The ancestor option with the flag `flag`.
         *
         * @var {Option | undefined} option
         */
        let option: Option | undefined

        if ((option = ancestor.findOption(flag, 0))) {
          token.command = ancestor
          token.global = true
          token.option = option
          break
        }
      }
    }
  }

  // capture option flag on `token`.
  if (token.option) {
    token.value = flag
  } else {
    token.option = null
  }

  return void token
}
