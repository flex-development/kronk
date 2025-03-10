/**
 * @file Enums - tt
 * @module kronk/enums/tt
 */

import type { TokenType } from '@flex-development/vfile-tokenizer'

/**
 * Token types.
 *
 * @internal
 *
 * @enum {TokenType}
 */
enum tt {
  /**
   * Command or option argument syntax.
   */
  argtax = 'argtax',

  /**
   * Command-line argument separator.
   */
  delimiter = 'delimiter',

  /**
   * Long or short flag.
   */
  flag = 'flag',

  /**
   * Flag or argument syntax id.
   */
  id = 'id',

  /**
   * Command name, command-argument, or option-argument.
   */
  operand = 'operand'
}

export default tt
