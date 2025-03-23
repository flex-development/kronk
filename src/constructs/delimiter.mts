/**
 * @file Constructs - delimiter
 * @module kronk/constructs/delimiter
 */

import tt from '#enums/tt'
import atBreak from '#internal/at-break'
import kArgument from '#internal/k-argument'
import kOption from '#internal/k-option'
import {
  codes,
  type Code,
  type Construct,
  type Effects,
  type Event,
  type State,
  type TokenizeContext
} from '@flex-development/vfile-tokenizer'
import { ok as assert } from 'devlop'

/**
 * Delimiter (`--`) construct.
 *
 * If a non-option looks like an option because it starts with a hyphen (`-`),
 * delimiters (`--`) can be used to demarcate options from non-options.
 *
 * @internal
 *
 * @const {Construct} delimiter
 */
const delimiter: Construct = {
  name: tt.delimiter,
  previous: atBreak,
  resolve: resolveDelimiter,
  tokenize: tokenizeDelimiter
}

export default delimiter

/**
 * Resolve the events parsed by {@linkcode tokenizeDelimiter}.
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
function resolveDelimiter(
  this: void,
  events: Event[],
  context: TokenizeContext
): Event[] {
  assert(!context[kArgument], 'expected to not to be in `Argument` context')
  assert(!context[kOption], 'expected to not to be in `Option` context')

  // mark the presence of a delimiter.
  return context.delimiter = true, events
}

/**
 * Tokenize a delimiter.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode State}
 * @see {@linkcode TokenizeContext}
 *
 * @example
 *  ```markdown
 *  > | --
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
function tokenizeDelimiter(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return delimiter

  /**
   * Start of a delimiter.
   *
   * @example
   *  ```markdown
   *  > | --
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
  function delimiter(this: void, code: Code): State | undefined {
    assert(code === codes.hyphen, 'expected `-`')
    return effects.enter(tt.delimiter), effects.consume(code), after
  }

  /**
   * After first marker.
   *
   * @example
   *  ```markdown
   *  > | --
   *       ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function after(this: void, code: Code): State | undefined {
    if (code !== codes.hyphen) return nok(code)
    return effects.consume(code), effects.exit(tt.delimiter), end
  }

  /**
   * End of delimiter.
   *
   * @example
   *  ```markdown
   *  > | --
   *        ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function end(this: void, code: Code): State | undefined {
    return (atBreak(code) ? ok : nok)(code)
  }
}
