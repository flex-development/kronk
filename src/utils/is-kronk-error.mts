/**
 * @file Utilities - isKronkError
 * @module kronk/utils/isKronkError
 */

import kKronkError from '#internal/k-kronk-error'
import { KronkError } from '@flex-development/kronk/errors'

/**
 * Check if `value` looks like a {@linkcode KronkError}.
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is KronkError}
 *  `true` if `value` looks like a `KronkError` instance, `false` otherwise
 */
function isKronkError(this: void, value: unknown): value is KronkError {
  return (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    value !== null &&
    value instanceof Error &&
    (
      value instanceof KronkError ||
      kKronkError in value && value[kKronkError] === true
    )
  )
}

export default isKronkError
