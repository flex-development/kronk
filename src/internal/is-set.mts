/**
 * @file Internal - isSet
 * @module kronk/internal/isSet
 */

/**
 * Check if `value` is a {@linkcode Set}.
 *
 * @internal
 *
 * @template {any} [T=unknown]
 *  Unique list item type
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is ReadonlySet<T> | Set<T>}
 *  `true` if `value` is {@linkcode Set}, `false` otherwise
 */
function isSet<T>(
  this: void,
  value: unknown
): value is ReadonlySet<T> | Set<T> {
  return value instanceof Set
}

export default isSet
