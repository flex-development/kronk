/**
 * @file Utilities - isKronkError
 * @module kronk/utils/isKronkError
 */

import kKronkError from '#internal/k-kronk-error'
import type { KronkError } from '@flex-development/kronk/errors'

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
 *  `true` if `value` looks like a `KronkError`, `false` otherwise
 */
function isKronkError(this: void, value: unknown): value is KronkError {
  return (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    value !== null &&
    value instanceof Error &&
    kKronkError in value
  )
}

export default isKronkError
