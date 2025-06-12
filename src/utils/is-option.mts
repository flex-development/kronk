/**
 * @file Utilities - isOption
 * @module kronk/utils/isOption
 */

import kOption from '#internal/k-option'
import Option from '#lib/option'

/**
 * Check if `value` looks like an {@linkcode Option}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is Option}
 *  `true` if `value` looks like an `Option` instance, `false` otherwise
 */
function isOption(this: void, value: unknown): value is Option {
  return (
    typeof value === 'object' &&
    value !== null &&
    (
      value instanceof Option ||
      kOption in value && value[kOption] === true
    )
  )
}

export default isOption
