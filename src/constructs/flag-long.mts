/**
 * @file Constructs - longFlag
 * @module kronk/constructs/longFlag
 */

import codes from '#enums/codes'
import tt from '#enums/tt'
import resolveFlag from '#internal/flag-resolve'
import testFlag from '#internal/flag-test'
import isBreak from '#internal/is-break'
import kOption from '#internal/k-option'
import type {
  Code,
  Construct,
  Effects,
  State,
  TokenizeContext
} from '@flex-development/vfile-tokenizer'
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
  previous: isBreak,
  resolve: resolveFlag,
  test: testFlag,
  tokenize: tokenizeLongFlag
}

export default longFlag

/**
 * Tokenize a long flag.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode State}
 * @see {@linkcode TokenizeContext}
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

  /**
   * Whether an operand was attached to a flag (e.g. `--long-flag=value`).
   *
   * @var {boolean} attached
   */
  let attached: boolean = false

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
    effects.enter(tt.flag, { chunk: self.chunk, long: true })
    effects.consume(code)
    return after
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
    return effects.enter(tt.id, { chunk: self.chunk }), id(code)
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
   *  > | --long-flag=value
   *        ^^^^^^^^^
   *  ```
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
      case asciiAlphanumeric(code):
      case code === codes.dot:
      case code === codes.hyphen:
        return effects.consume(code), id
      case code === codes.equal && !self[kOption]:
        effects.exit(tt.id)
        effects.exit(tt.flag)
        effects.consume(code)
        return attached = true, beforeValue
      case isBreak(code):
        /**
         * Flag id codes.
         *
         * @const {Code[]} flagId
         */
        const flagId: Code[] = self.sliceStream(effects.exit(tt.id))

        // ensure flag is not actually a delimiter.
        if (flagId.length === 1 && flagId[0] === codes.hyphen) break
        return effects.exit(tt.flag), ok(code)
      default:
        break
    }

    return nok(code)
  }

  /**
   * Before long flag value.
   *
   * @example
   *  ```markdown
   *  > | --long=value
   *             ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | --long.flag=value
   *                  ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | --long-flag=value
   *                  ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function beforeValue(this: void, code: Code): State | undefined {
    assert(!self[kOption], 'expected to not be in `Option` context')
    effects.enter(tt.operand, { attached, chunk: self.chunk })
    return value(code)
  }

  /**
   * Inside long flag value.
   *
   * @example
   *  ```markdown
   *  > | --long=value
   *             ^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | --long.flag=value
   *                  ^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > | --long-flag=value
   *                  ^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function value(this: void, code: Code): State | undefined {
    if (!isBreak(code)) return effects.consume(code), value
    return effects.exit(tt.operand), ok(code)
  }
}
