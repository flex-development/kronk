/**
 * @file Utilities - isOption
 * @module kronk/utils/isOption
 */

import kOption from '#internal/k-option'
import type { Option } from '@flex-development/kronk'

/**
 * Check if `value` is an {@linkcode Option}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is Option}
 *  `true` if `value` is an `Option` instance, `false` otherwise
 */
function isOption(this: void, value: unknown): value is Option {
  return (
    typeof value === 'object' &&
    value !== null &&
    kOption in value &&
    value[kOption] === true
  )
}

export default isOption
