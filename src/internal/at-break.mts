/**
 * @file Internal - atBreak
 * @module kronk/internal/atBreak
 */

import { codes, type Code } from '@flex-development/fsm-tokenizer'

/**
 * Check if `code` represents a break or an end to the stream.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Code} code
 *  The character code to check
 * @return {code is typeof codes.break | typeof codes.eof}
 *  `true` if `value` is {@linkcode codes.break} or {@linkcode codes.eof}
 */
function atBreak(
  this: void,
  code: Code
): code is typeof codes.break | typeof codes.eof {
  return code === codes.break || code === codes.eof
}

export default atBreak
