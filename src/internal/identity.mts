/**
 * @file Internal - identity
 * @module kronk/internal/identity
 */

/**
 * Return `value` unchanged.
 *
 * @internal
 *
 * @template {any} T
 *  Value type
 *
 * @this {void}
 *
 * @param {T} value
 *  The value to return
 * @return {T}
 *  `value`
 */
function identity<T>(this: void, value: T): T {
  return value
}

export default identity
