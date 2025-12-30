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
 *  `true` if `value` looks like an `Argument`, `false` otherwise
 */
function isArgument(this: void, value: unknown): value is Argument {
  return (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    value !== null &&
    kArgument in value
  )
}

export default isArgument
