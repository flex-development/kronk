/**
 * @file Internal - isList
 * @module kronk/internal/isList
 */

import isSet from '#internal/is-set'
import type { List } from '@flex-development/kronk'

/**
 * Check if `value` is a list.
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
function isList<T>(this: void, value: unknown): value is List<T> {
  return Array.isArray(value) || isSet(value)
}

export default isList
