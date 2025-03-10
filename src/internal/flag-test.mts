/**
 * @file Internal - testFlag
 * @module kronk/internal/testFlag
 */

import codes from '#enums/codes'
import type { Code, TokenizeContext } from '@flex-development/vfile-tokenizer'

/**
 * Check if the current character `code` can start a flag construct.
 *
 * @see {@linkcode Code}
 * @see {@linkcode TokenizeContext}
 *
 * @internal
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The current character code
 * @return {boolean}
 *  `true` if `code` can start long or short flag construct
 */
function testFlag(this: TokenizeContext, code: Code): boolean {
  return !this.delimiter && code === codes.hyphen
}

export default testFlag
