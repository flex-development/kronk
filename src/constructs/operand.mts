/**
 * @file Constructs - operand
 * @module kronk/constructs/operand
 */

import tt from '#enums/tt'
import atBreak from '#internal/at-break'
import kArgument from '#internal/k-argument'
import kCommand from '#internal/k-command'
import kOption from '#internal/k-option'
import {
  codes,
  ev,
  type Code,
  type Construct,
  type Effects,
  type Event,
  type State,
  type Token,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import type { Option } from '@flex-development/kronk'
import { ok as assert } from 'devlop'

/**
 * Operand construct.
 *
 * The `value` of a token produced by this construct is either a subcommand
 * name, a command-argument, or an option-argument.
 *
 * @internal
 *
 * @const {Construct} operand
 */
const operand: Construct = {
  name: tt.operand,
  previous: previousOperand,
  resolve: resolveOperand,
  resolveAll: resolveAllOperand,
  tokenize: tokenizeOperand
}

export default operand

/**
 * Check if the previous character `code` can come before an operand.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  `true` if `code` can come before operand construct
 */
function previousOperand(this: TokenizeContext, code: Code): boolean {
  if (atBreak(code)) return true

  /**
   * Possible flag exit event.
   *
   * @const {Event | undefined} event
   */
  const event: Event | undefined = this.events.at(-1)

  return !!event && event[0] === ev.exit && event[1].type === tt.flag
}

/**
 * Resolve the events parsed by {@linkcode tokenizeOperand}.
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
function resolveOperand(
  this: void,
  events: Event[],
  context: TokenizeContext
): Event[] {
  assert(!context[kOption], 'expected to not to be in `Option` context')
  assert(context.command, 'expected `context.command`')

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
      assert(token.type === tt.operand, 'expected `operand` token')

      token.value = context.sliceSerialize(token)
      token.command = context.command.findCommand(token.value)

      // refine command context to subcommand.
      if (token.command) {
        context.command = token.command
        delete token.attached
      }

      index++
    }
  }

  return events
}

/**
 * Resolve all events when the content is complete, from the start to the end.
 *
 * > 👉 **Note**: Only used if {@linkcode tokenizeOperand} is successful once.
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
function resolveAllOperand(
  this: void,
  events: Event[],
  context: TokenizeContext
): Event[] {
  assert(!context[kOption], 'expected to not to be in `Option` context')

  /**
   * Map, where each key is a variadic {@linkcode Option} instance and each
   * value is an operand token.
   *
   * @const {WeakMap<Option, Token<tt.operand>>} variadics
   */
  const variadics: WeakMap<Option, Token<tt.operand>> = new WeakMap()

  /**
   * Index of current event.
   *
   * @var {number} index
   */
  let index: number = -1

  /**
   * The current option.
   *
   * @var {Option | null | undefined} option
   */
  let option: Option | null | undefined

  while (++index < events.length) {
    assert(events[index], 'expected event')
    const [event, token] = events[index]!

    // capture current option.
    if (event === ev.exit && token.type === 'flag') {
      assert(token.long || token.short, 'expected long or short flag')
      option = token.option
      continue
    }

    // combine option-arguments for variadic options into a single token.
    if (
      event === ev.enter &&
      token.type === tt.operand &&
      !token.command &&
      option?.variadic
    ) {
      assert(token.value !== undefined, 'expected token value')
      if (typeof token.value === 'string') token.value = [token.value]

      /**
       * Previous event.
       *
       * @const {Event | undefined} event
       */
      const previous: Event | undefined = events[index - 1]

      if (variadics.has(option)) {
        /**
         * Operand token.
         *
         * @const {Token} operand
         */
        const operand: Token = variadics.get(option)!

        assert(operand.type === tt.operand, 'expected operand token')
        assert(Array.isArray(operand.value), 'expected array token value')
        operand.value.push(...token.value)

        if (previous) {
          const [pe, pt] = previous

          if (pe === ev.exit && pt.type === tt.flag && pt.option?.variadic) {
            index -= events.splice(index - 2, 2).length
          }
        }

        events.splice(index, 2)
        if (!token.attached) index--

        continue
      } else {
        token.value = [...token.value]
        variadics.set(option, token as Token<tt.operand>)
      }
    }
  }

  return events
}

/**
 * Tokenize an operand.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode State}
 * @see {@linkcode TokenizeContext}
 *
 * @example
 *  ```markdown
 *  > | info
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
function tokenizeOperand(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  /**
   * Tokenize context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  return operand

  /**
   * Start of an operand.
   *
   * @example
   *  ```markdown
   *  > | info
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
  function operand(this: void, code: Code): State | undefined {
    assert(!self[kArgument], 'expected to not be in `Argument` context')
    assert(!self[kOption], 'expected to not be in `Option` context')
    assert(self[kCommand], 'expected to be in `Command` context')

    // empty operands are preceded by equal signs (`=`).
    if (atBreak(code) && self.previous !== codes.equal) return nok(code)

    effects.enter(tt.operand, { attached: self.previous === codes.equal })
    return inside(code)
  }

  /**
   * Inside operand.
   *
   * @example
   *  ```markdown
   *  > | info
   *      ^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function inside(this: void, code: Code): State | undefined {
    if (!atBreak(code)) return effects.consume(code), inside
    return effects.exit(tt.operand), ok(code)
  }
}
