/**
 * @file Internal - isBreak
 * @module kronk/internal/isBreak
 */

import codes from '#enums/codes'
import type { Code } from '@flex-development/vfile-tokenizer'

/**
 * Check if `code` is a character code representing a stream break.
 *
 * @see {@linkcode Code}
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Code} code
 *  The character code to check
 * @return {boolean}
 *  `true` if `value` is {@linkcode codes.break} or {@linkcode codes.eof}
 */
function isBreak(this: void, code: Code): boolean {
  return code === codes.break || code === codes.eof
}

export default isBreak
