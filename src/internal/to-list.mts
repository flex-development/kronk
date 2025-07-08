/**
 * @file Internal - toList
 * @module kronk/internal/toList
 */

import isList from '#internal/is-list'
import type { List } from '@flex-development/kronk'
import { isNIL } from '@flex-development/tutils'

export default toList

/**
 * Convert `T` to a list.
 *
 * @internal
 *
 * @template {any} T
 *  The value to convert
 */
type ToList<T> = T extends List ? T : T extends null | undefined ? [] : T[]

/**
 * Convert `value` to a list.
 *
 * @internal
 *
 * @template {any} T
 *  The value to convert
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to convert
 * @return {ToList<T>}
 *  `value` or array containing `value`
 */
function toList<T>(this: void, value: T): ToList<T> {
  return (isNIL(value) ? [] : isList(value) ? value : [value]) as ToList<T>
}
