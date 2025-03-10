/**
 * @file Constructs - argumentSyntax
 * @module kronk/constructs/argumentSyntax
 */

import chars from '#enums/chars'
import codes from '#enums/codes'
import tt from '#enums/tt'
import isBreak from '#internal/is-break'
import kArgument from '#internal/k-argument'
import kCommand from '#internal/k-command'
import kOption from '#internal/k-option'
import {
  ev,
  type Code,
  type Construct,
  type Effects,
  type Event,
  type State,
  type TokenizeContext
} from '@flex-development/vfile-tokenizer'
import { ok as assert } from 'devlop'
import { markdownLineEndingOrSpace } from 'micromark-util-character'

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
  previous: isBreak,
  resolve: resolveArgumentSyntax,
  test: testArgumentSyntax,
  tokenize: tokenizeArgumentSyntax
}

export default argumentSyntax

/**
 * Resolve the events parsed by {@linkcode tokenizeArgumentSyntax}.
 *
 * @see {@linkcode Event}
 * @see {@linkcode TokenizeContext}
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

  /**
   * Index of current event.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < events.length) {
    assert(events[index], 'expected event')
    const [event, token] = events[index]!

    if (event === ev.enter) {
      if (token.type === tt.argtax) {
        /**
         * Next set of argument id events.
         *
         * @const {Event[]} idEvents
         */
        const idEvents: Event[] = events.splice(index + 1, 2)

        assert(idEvents[0], 'expected argument id event')
        assert(idEvents[0][0] === ev.enter, 'expected argument id enter event')
        assert(idEvents[0][1].type === tt.id, 'expected argument id token')

        // capture argument id and syntax.
        token.id = context.sliceSerialize(idEvents[0][1])
        token.value = context.sliceSerialize(token)

        // determine if argument is required and/or variadic.
        token.required = !token.value.endsWith(chars.rightBracket)
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
  }

  return events
}

/**
 * Check if the current character code can start this construct.
 *
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {boolean}
 *  `true` if current character code can start argument syntax construct
 */
function testArgumentSyntax(this: TokenizeContext): boolean {
  return this[kArgument] || this.events.at(-1)?.[1].type === tt.flag
}

/**
 * Tokenize command or option argument syntax.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode State}
 * @see {@linkcode TokenizeContext}
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
   * closing character code.
   *
   * @const {Record<NonNullable<Code>, NonNullable<Code>>} map
   */
  const map: Record<NonNullable<Code>, NonNullable<Code>> = {
    [codes.leftBracket]: codes.rightBracket,
    [codes.lt]: codes.gt
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
    assert(code !== codes.eof && map[code], 'expected `<` or `[`')
    effects.enter(tt.argtax, { chunk: self.chunk, required: code === codes.lt })
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
        effects.exit(tt.id)
        effects.consume(code)
        effects.exit(tt.argtax)
        return ok
      case !isBreak(code) && !markdownLineEndingOrSpace(code):
        return effects.consume(code), id
      default:
        break
    }

    return nok(code)
  }
}
