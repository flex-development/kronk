/**
 * @file Constructs - longFlag
 * @module kronk/constructs/longFlag
 */

import operand from '#constructs/operand'
import chars from '#enums/chars'
import tt from '#enums/tt'
import atBreak from '#internal/at-break'
import resolveFlag from '#internal/flag-resolve'
import kCommand from '#internal/k-command'
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
 * Long flag construct.
 *
 * A long flag starts with two hyphens ([HYPHEN-MINUS `U+002D`][hyphen])
 * followed by one or more case-insensitive alphanumeric characters.
 *
 * Hyphens and full stops ([FULL STOP `U+002E`][full-stop]) can be used to
 * separate words, as well as camelCase format.
 *
 * [full-stop]: https://www.fileformat.info/info/unicode/char/002e/index.htm
 * [hyphen]: https://www.fileformat.info/info/unicode/char/002d/index.htm
 * [lowline]: https://www.fileformat.info/info/unicode/char/005f/index.htm
 *
 * @internal
 *
 * @const {Construct} longFlag
 */
const longFlag: Construct = {
  name: 'longFlag',
  resolve: resolveFlag,
  tokenize: tokenizeLongFlag
}

export default longFlag

/**
 * Tokenize a long flag.
 *
 * @example
 *  ```markdown
 *  > | --long
 *  ```
 *
 * @example
 *  ```markdown
 *  > | --long.flag
 *  ```
 *
 * @example
 *  ```markdown
 *  > | --long-flag
 *  ```
 *
 * @example
 *  ```markdown
 *  > | --long=value
 *  ```
 *
 * @example
 *  ```markdown
 *  > | --long.flag=value
 *  ```
 *
 * @example
 *  ```markdown
 *  > | --long-flag=value
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
function tokenizeLongFlag(
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

  return longFlag

  /**
   * Start of a long flag.
   *
   * @example
   *  ```markdown
   *  > | --long-flag
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
  function longFlag(this: void, code: Code): State | undefined {
    assert(code === codes.hyphen, 'expected `-`')

    if (!self.delimiter && (!self.now()._index || self.code === codes.break)) {
      effects.enter(tt.flag, { long: true })
      effects.consume(code)
      return after
    }

    return nok(code)
  }

  /**
   * After first long flag marker.
   *
   * @example
   *  ```markdown
   *  > | --long-flag
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
    return effects.consume(code), beforeId
  }

  /**
   * Before long flag id.
   *
   * @example
   *  ```markdown
   *  > | --long-flag
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
  function beforeId(this: void, code: Code): State | undefined {
    if (!asciiAlphanumeric(code) && code !== codes.hyphen) return nok(code)
    return effects.enter(tt.id), id(code)
  }

  /**
   * Inside long flag id.
   *
   * @example
   *  ```markdown
   *  > | --long-flag
   *        ^^^^^^^^^
   *  ```
   * @example
   *  ```markdown
   *  > | --long.flag
   *        ^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | --long-flag=
   *        ^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | --long-flag=value
   *        ^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | --long.flag=value
   *        ^^^^^^^^^
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
      case atBreak(code):
      case self.code === codes.break:
        // actually a delimiter.
        if (self.sliceSerialize(effects.exit(tt.id)) === chars.hyphen) break
        return effects.exit(tt.flag), ok(code)
      case code === codes.equal && self[kCommand]:
        effects.exit(tt.id)
        effects.exit(tt.flag)
        effects.consume(code)
        return effects.attempt(operand, ok, nok)
      case asciiAlphanumeric(code):
      case code === codes.dot:
      case code === codes.hyphen:
        return effects.consume(code), id
      default:
        break
    }

    return nok(code)
  }
}
