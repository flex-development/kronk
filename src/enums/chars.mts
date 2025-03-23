/**
 * @file Enums - chars
 * @module kronk/enums/chars
 */

import * as vt from '@flex-development/vfile-tokenizer'

/**
 * Character dictionary.
 *
 * @internal
 *
 * @enum {string | null}
 */
const chars = { ...vt.chars, delimiter: vt.chars.hyphen.repeat(2) } as const

export default chars
