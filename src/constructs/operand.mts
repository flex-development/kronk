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
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
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

    assert(event === ev.enter, 'expected `enter` event')
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
