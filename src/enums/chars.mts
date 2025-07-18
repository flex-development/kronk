/**
 * @file Enums - chars
 * @module kronk/enums/chars
 */

import * as vt from '@flex-development/fsm-tokenizer'

/**
 * Character dictionary.
 *
 * @internal
 *
 * @enum {string | null}
 */
const chars = {
  ...vt.chars,
  delimiter: vt.chars.hyphen.repeat(2),
  false: 'false',
  true: 'true'
} as const

export default chars
