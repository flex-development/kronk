/**
 * @file Utilities - isArgument
 * @module kronk/utils/isArgument
 */

import kArgument from '#internal/k-argument'
import type { Argument } from '@flex-development/kronk'

/**
 * Check if `value` is an {@linkcode Argument}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is Argument}
 *  `true` if `value` is an `Argument` instance, `false` otherwise
 */
function isArgument(this: void, value: unknown): value is Argument {
  return (
    typeof value === 'object' &&
    value !== null &&
    kArgument in value &&
    value[kArgument] === true
  )
}

export default isArgument
