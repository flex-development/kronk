/**
 * @file Constructs - argumentSyntax
 * @module kronk/constructs/argumentSyntax
 */

import chars from '#enums/chars'
import tt from '#enums/tt'
import kArgument from '#internal/k-argument'
import kCommand from '#internal/k-command'
import kOption from '#internal/k-option'
import {
  codes,
  eof,
  ev,
  type Code,
  type Construct,
  type Effects,
  type Event,
  type State,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import { ok as assert } from 'devlop'

/**
 * Argument syntax construct.
 *
 * Arguments are marked as required using empty angle brackets (`<>`) or by
 * wrapping an argument id in angle brackets: `<id>`.\
 * Optional arguments use empty square brackets (`[]`) or have their id wrapped
 * in square brackets: `[id]`.
 *
 * Variadic arguments are specified with an ellipsis wrapped in brackets (e.g.
 * `<...>`, `[...]`) or by appending the ellipsis to the end of the argument id
 * (`<value...>`, `[value...]`).
 *
 * Option-arguments can be marked as mandatory by appending an exclamation mark
 * to the end of the argument id: (`<!>`, `<id!>`, `<value!...>`).
 *
 * @internal
 *
 * @const {Construct} argumentSyntax
 */
const argumentSyntax: Construct = {
  name: 'argumentSyntax',
  previous: previousArgumentSyntax,
  resolve: resolveArgumentSyntax,
  tokenize: tokenizeArgumentSyntax
}

export default argumentSyntax

/**
 * Check if the previous character `code` can come before argument syntax.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  `true` if `code` can come before argument syntax construct
 */
function previousArgumentSyntax(this: TokenizeContext, code: Code): boolean {
  assert(!this[kCommand], 'expected to not be in `Command` context')

  if (this[kArgument]) return code === codes.eof
  assert(this[kOption], 'expected to be in `Option` context')

  /**
   * Last event.
   *
   * @const {Event | undefined} event
   */
  const event: Event | undefined = this.events.at(-1)

  return !!event && event[0] === ev.exit && event[1].type === tt.flag
}

/**
 * Resolve the events parsed by {@linkcode tokenizeArgumentSyntax}.
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
function resolveArgumentSyntax(
  this: void,
  events: Event[],
  context: TokenizeContext
): Event[] {
  assert(!context[kCommand], 'expected to not be in `Command` context')
  assert(context[kArgument] || context[kOption], 'expected instance context')

  /**
   * Index of current event.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < events.length) {
    assert(events[index], 'expected events[index]')
    const [event, token] = events[index]!

    if (event === ev.enter && token.type === tt.argtax) {
      /**
       * Next set of argument id events.
       *
       * @const {Event[]} idEvents
       */
      const idEvents: Event[] = events.splice(index + 1, 2)

      assert(idEvents[0], 'expected `idEvents[0]`')
      assert(idEvents[0][1].type === tt.id, 'expected argument id token')
      assert(idEvents[0][0] === ev.enter, 'expected argument id enter event')

      // capture argument id and syntax.
      token.id = context.sliceSerialize(idEvents[0][1])
      token.value = context.sliceSerialize(token)

      // determine if argument is required and/or variadic.
      token.required = token.value.endsWith(chars.rightAngleBracket)
      token.variadic = token.id.endsWith(chars.ellipsis)

      // remove ellipsis from id if argument is variadic.
      if (token.variadic) token.id = token.id.slice(0, -3)

      // add additional metadata to option-arguments.
      if (context[kOption]) {
        // determine if option-argument is mandatory.
        token.mandatory = token.id.endsWith(chars.exclamation)

        // remove exclamation mark from id if option-argument is mandatory.
        if (token.mandatory) token.id = token.id.slice(0, -1)
      }
    }
  }

  return events
}

/**
 * Tokenize command or option argument syntax.
 *
 * @example
 *  ```markdown
 *  > | <>
 *  ```
 *
 * @example
 *  ```markdown
 *  > | <!>
 *  ```
 *
 * @example
 *  ```markdown
 *  > | <value>
 *  ```
 *
 * @example
 *  ```markdown
 *  > | <value...>
 *  ```
 *
 * @example
 *  ```markdown
 *  > | <value!...>
 *  ```
 *
 * @example
 *  ```markdown
 *  > | []
 *  ```
 *
 * @example
 *  ```markdown
 *  > | [!]
 *  ```
 *
 * @example
 *  ```markdown
 *  > | [value]
 *  ```
 *
 * @example
 *  ```markdown
 *  > | [value...]
 *  ```
 *
 * @example
 *  ```markdown
 *  > | [value!...]
 *  ```
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  Context object to transition state machine
 * @param {State} ok
 *  Successful tokenization state
 * @param {State} nok
 *  Failed tokenization state
 * @return {State}
 *  Initial state
 */
function tokenizeArgumentSyntax(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  /**
   * Record where each key is an opening character code and each value is the
   * expected closing character code.
   *
   * @const {Record<NonNullable<Code>, NonNullable<Code>>} map
   */
  const map: Record<NonNullable<Code>, NonNullable<Code>> = {
    [codes.leftAngleBracket]: codes.rightAngleBracket,
    [codes.leftBracket]: codes.rightBracket
  }

  /**
   * Tokenize context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  /**
   * Opening character code.
   *
   * @var {NonNullable<Code>} opener
   */
  let opener: NonNullable<Code>

  return argumentSyntax

  /**
   * Start of argument syntax.
   *
   * @example
   *  ```markdown
   *  > | <>
   *      ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | [value]
   *      ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function argumentSyntax(this: void, code: Code): State | undefined {
    assert(!eof(code) && map[code], 'expected `<` or `[`')
    effects.enter(tt.argtax, { required: code === codes.leftAngleBracket })
    effects.consume(code)
    effects.enter(tt.id)
    return opener = code, id
  }

  /**
   * Inside argument id.
   *
   * @example
   *  ```markdown
   *  > | <!>
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | <value>
   *       ^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | [value...]
   *       ^^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function id(this: void, code: Code): State | undefined {
    switch (true) {
      case code === map[opener]:
        // option-argument syntax split across chunks.
        if (self[kOption] && self.code === codes.break) break

        effects.exit(tt.id)
        effects.consume(code)
        effects.exit(tt.argtax)

        // command and option-argument syntax should have nothing after it,
        // not even whitespace (thus meaning syntax strings must be trimmed
        // **before** being tokenized).
        if (self.code !== codes.eof) return nok

        return ok
      case !eof(code) && code > codes.space && code <= codes.tilde:
        return effects.consume(code), id
      default:
        break
    }

    return nok(code)
  }
}
