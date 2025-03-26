/**
 * @file Constructs - shortFlag
 * @module kronk/constructs/shortFlag
 */

import operand from '#constructs/operand'
import tt from '#enums/tt'
import atBreak from '#internal/at-break'
import resolveFlag from '#internal/flag-resolve'
import kCommand from '#internal/k-command'
import kOption from '#internal/k-option'
import {
  codes,
  type Code,
  type Construct,
  type Effects,
  type State,
  type TokenizeContext
} from '@flex-development/fsm-tokenizer'
import { ok as assert } from 'devlop'
import { asciiAlphanumeric } from 'micromark-util-character'

/**
 * Short flag construct.
 *
 * A short flag is a hyphen — specifically [HYPHEN-MINUS `U+002D`][hyphen] —
 * followed by one case-insensitive alphanumeric character.
 *
 * [hyphen]: https://www.fileformat.info/info/unicode/char/002d/index.htm
 *
 * @internal
 *
 * @const {Construct} shortFlag
 */
const shortFlag: Construct = {
  name: 'shortFlag',
  resolve: resolveFlag,
  tokenize: tokenizeShortFlag
}

export default shortFlag

/**
 * Tokenize a short flag.
 *
 * @example
 *  ```markdown
 *  > | -s
 *  ```
 *
 * @example
 *  ```markdown
 *  > | -s=value
 *  ```
 *
 * @example
 *  ```markdown
 *  > | -cs
 *  ```
 *
 * @example
 *  ```markdown
 *  > | -dn=value
 *  ```
 *
 * @example
 *  ```markdown
 *  > | -dn1
 *  ```
 *
 * @example
 *  ```markdown
 *  > | -ds,
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
function tokenizeShortFlag(
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

  return shortFlag

  /**
   * Start of a short flag.
   *
   * @example
   *  ```markdown
   *  > | -s
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
  function shortFlag(this: void, code: Code): State | undefined {
    assert(code === codes.hyphen, 'expected `-`')

    if (!self.delimiter && (!self.now()._index || self.code === codes.break)) {
      effects.enter(tt.flag, { short: true })
      effects.consume(code)
      return beforeId
    }

    return nok(code)
  }

  /**
   * Before short flag id.
   *
   * @example
   *  ```markdown
   *  > | -s
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
  function beforeId(this: void, code: Code): State | undefined {
    if (!asciiAlphanumeric(code)) return nok(code)
    return effects.enter(tt.id), id(code)
  }

  /**
   * Inside short flag id.
   *
   * @example
   *  ```markdown
   *  > | -s
   *       ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | -cs
   *       ^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | -dn=value
   *       ^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | -dnNumber.POSITIVE_INFINITY
   *       ^^
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
      case asciiAlphanumeric(code):
        effects.consume(code)
        if (!self[kOption]) return id
        if (!atBreak(self.code)) return nok
        return effects.exit(tt.id), effects.exit(tt.flag), ok
      case code === codes.equal && self[kCommand]:
        effects.exit(tt.id)
        effects.exit(tt.flag)
        effects.consume(code)
        return effects.attempt(operand, ok, nok)
      default:
        break
    }

    return combined(code)
  }

  /**
   * Inside combined short flag.
   *
   * @example
   *  ```markdown
   *  > | -dnNumber.POSITIVE_INFINITY
   *               ^^^^^^^^^^^^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function combined(this: void, code: Code): State | undefined {
    if (!atBreak(code)) return effects.consume(code), combined
    return effects.exit(tt.id), effects.exit(tt.flag), ok(code)
  }
}
