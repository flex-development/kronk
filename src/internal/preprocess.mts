/**
 * @file Internal - preprocess
 * @module kronk/internal/preprocess
 */

import codes from '#enums/codes'
import type {
  Code,
  Column,
  Encoding,
  FileLike,
  Value
} from '@flex-development/vfile-tokenizer'

/**
 * Turn `value` into character code chunks.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {FileLike | Value | null | undefined} value
 *  The value to preprocess
 * @param {Encoding | null | undefined} [encoding]
 *  The character encoding to use when `value`
 *  or its contents is an {@linkcode Uint8Array}
 * @param {boolean | null | undefined} [end]
 *  Whether to end the stream
 * @return {Code[]}
 *  Character code chunks
 */
function preprocess(
  this: void,
  value: FileLike | Value | null | undefined,
  encoding?: Encoding | null | undefined,
  end?: boolean | null | undefined
): Code[] {
  /**
   * Character code chunks.
   *
   * @const {Code[]} chunks
   */
  const chunks: Code[] = []

  if (value === null) {
    chunks.push(codes.break)
  } else if (value !== undefined) {
    if (typeof value === 'object' && 'value' in value) {
      value = value.value
    }

    if (typeof value !== 'string') {
      value = new TextDecoder(encoding ?? undefined).decode(value)
    }

    /**
     * Number of spaces a tab is equivalent to.
     *
     * @const {number} tabSize
     */
    const tabSize: number = 2

    /**
     * Current column.
     *
     * @var {Column} column
     */
    let column: Column = 1

    /**
     * Index of current character code.
     *
     * @var {number} index
     */
    let index: number = 0

    while (index < value.length) {
      /**
       * Character code.
       *
       * @var {NonNullable<Code>} code
       */
      let code: NonNullable<Code> = value[index]!.codePointAt(0)!

      /**
       * Difference between next column and current column.
       *
       * @var {number} k
       */
      let k: number = 1

      switch (true) {
        case code === codes.cr:
          if (value[index + 1]?.codePointAt(0) === codes.lf) {
            chunks.push(codes.crlf)
            k++
          } else {
            chunks.push(codes.vcr)
          }

          column = 1
          break
        case code === codes.ht:
          /**
           * Next column.
           *
           * @const {number} n
           */
          const n: number = Math.ceil(column / tabSize) * tabSize

          chunks.push(codes.vht)
          while (column++ < n) chunks.push(codes.vs)

          break
        case code === codes.lf:
          chunks.push(codes.vlf)
          column = 1
          break
        default:
          chunks.push(code)
          column++
          break
      }

      index += k
    }
  }

  return end && chunks.push(codes.eof), chunks
}

export default preprocess
