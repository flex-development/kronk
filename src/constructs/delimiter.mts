/**
 * @file Constructs - delimiter
 * @module kronk/constructs/delimiter
 */

import codes from '#enums/codes'
import tt from '#enums/tt'
import isBreak from '#internal/is-break'
import kOption from '#internal/k-option'
import type {
  Code,
  Construct,
  Effects,
  Event,
  State,
  TokenizeContext
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
  previous: isBreak,
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
  /**
   * Tokenize context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

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
    effects.enter(tt.delimiter, { chunk: self.chunk })
    effects.consume(code)
    return after
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
    return effects.consume(code), end
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
    if (!isBreak(code)) return nok(code)
    return effects.exit(tt.delimiter), ok(code)
  }
}
