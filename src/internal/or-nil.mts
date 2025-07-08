/**
 * @file Internal - orNIL
 * @module kronk/internal/orNIL
 */

import { ifelse, isNIL } from '@flex-development/tutils'

/**
 * Get `value` if it is truthy, or `nil`.
 *
 * > 👉 **Note**: String values are trimmed before being checked/returned.
 *
 * @internal
 *
 * @template {any} [T=unknown]
 *  The thing to check
 *
 * @this {void}
 *
 * @param {T} value
 *  The thing to check
 * @return {T | null | undefined}
 *  `value` if `value` is not truthy, `null` or `undefined` sotherwise
 */
function orNIL<T = unknown>(this: void, value: T): T | null | undefined {
  if (typeof value === 'string') return value.trim() as T || null
  return isNIL(value) ? value : ifelse(value, value, null)
}

export default orNIL
