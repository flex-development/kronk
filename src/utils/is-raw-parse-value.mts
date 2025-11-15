/**
 * @file Utilities - isRawParseValue
 * @module kronk/utils/isRawParseValue
 */

import type { RawParseValue } from '@flex-development/kronk'

/**
 * Check if `value` can be passed to an argument parser.
 *
 * @see {@linkcode RawParseValue}
 *
 * @category
 *  utils
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is RawParseValue}
 *  `true` if `value` can be passed to an argument parser, `false` otherwise
 */
function isRawParseValue(this: void, value: unknown): value is RawParseValue {
  if (typeof value === 'string') return true
  if (!Array.isArray(value)) return false
  return value.every(val => typeof val === 'string')
}

export default isRawParseValue
