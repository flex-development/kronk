/**
 * @file Internal - orNull
 * @module kronk/internal/orNull
 */

import { ifelse } from '@flex-development/tutils'

/**
 * Get `value` if it is truthy, or `null`.
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
 * @return {T | null}
 *  `value` if `value` is not truthy, `null` otherwise
 */
function orNull<T = unknown>(this: void, value: T): T | null {
  if (typeof value === 'string') return value.trim() as T || null
  return ifelse(value, value, null)
}

export default orNull
