/**
 * @file Constructs - shortFlag
 * @module kronk/constructs/shortFlag
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
  previous: isBreak,
  resolve: resolveFlag,
  test: testFlag,
  tokenize: tokenizeShortFlag
}

export default shortFlag

/**
 * Tokenize a short flag.
 *
 * @see {@linkcode Effects}
 * @see {@linkcode State}
 * @see {@linkcode TokenizeContext}
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

  /**
   * Whether an operand was attached to a flag (e.g. `-s=value`, `-ds=value`).
   *
   * @var {boolean} attached
   */
  let attached: boolean = false

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
    effects.enter(tt.flag, { chunk: self.chunk, short: true })
    effects.consume(code)
    return beforeId
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
    return effects.enter(tt.id, { chunk: self.chunk }), id(code)
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
        if (self.code !== codes.eof) return nok
        return effects.exit(tt.id), effects.exit(tt.flag), ok
      case code === codes.equal:
        effects.exit(tt.id)
        effects.exit(tt.flag)
        effects.consume(code)
        return attached = true, beforeAttached
      case isBreak(code):
        effects.exit(tt.id)
        effects.exit(tt.flag)
        return ok(code)
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
    if (!isBreak(code)) return effects.consume(code), combined
    return effects.exit(tt.id), effects.exit(tt.flag), ok(code)
  }

  /**
   * Before attached short flag value.
   *
   * @example
   *  ```markdown
   *  > | -dn=value
   *          ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function beforeAttached(this: void, code: Code): State | undefined {
    effects.enter(tt.operand, { attached, chunk: self.chunk })
    return av(code)
  }

  /**
   * Inside attached short flag value.
   *
   * @example
   *  ```markdown
   *  > | -dn=value
   *          ^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  Current character code
   * @return {State | undefined}
   *  Next state
   */
  function av(this: void, code: Code): State | undefined {
    if (!isBreak(code)) return effects.consume(code), av
    return effects.exit(tt.operand), ok(code)
  }
}
