/**
 * @file Internal - isList
 * @module kronk/internal/isList
 */

import type { List } from '@flex-development/kronk'

/**
 * Check if `value` is a list.
 *
 * @see {@linkcode List}
 *
 * @internal
 *
 * @template {any} [T=unknown]
 *  List item type
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is List<T>}
 *  `true` if `value` is an array or {@linkcode Set}, `false` otherwise
 */
function isList<T = unknown>(this: void, value: unknown): value is List<T> {
  return Array.isArray(value) || value instanceof Set
}

export default isList
