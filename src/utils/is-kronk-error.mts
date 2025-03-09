/**
 * @file Utilities - isKronkError
 * @module kronk/utils/isKronkError
 */

import kKronkError from '#internal/k-kronk-error'
import type { KronkError } from '@flex-development/kronk'

/**
 * Check if `value` is a {@linkcode KronkError}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is KronkError}
 *  `true` if `value` is `KronkError` instance, `false` otherwise
 */
function isKronkError(this: void, value: unknown): value is KronkError {
  return (
    typeof value === 'object' &&
    value !== null &&
    value instanceof Error &&
    kKronkError in value &&
    value[kKronkError] === true
  )
}

export default isKronkError
