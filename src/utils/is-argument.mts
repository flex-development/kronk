/**
 * @file Utilities - isArgument
 * @module kronk/utils/isArgument
 */

import kArgument from '#internal/k-argument'
import Argument from '#lib/argument'

/**
 * Check if `value` looks like an {@linkcode Argument}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is Argument}
 *  `true` if `value` looks like an `Argument` instance, `false` otherwise
 */
function isArgument(this: void, value: unknown): value is Argument {
  return (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    value !== null &&
    (
      value instanceof Argument ||
      kArgument in value && value[kArgument] === true
    )
  )
}

export default isArgument
