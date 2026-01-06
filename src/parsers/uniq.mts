/**
 * @file Parsers - uniq
 * @module kronk/parsers/uniq
 */

import identity from '#internal/identity'
import type { ParseArg } from '@flex-development/kronk'

export default uniq

/**
 * Create a unique list parser.
 *
 * @category
 *  parsers
 *
 * @template {any} [T=string]
 *  The result of the item parse
 *
 * @this {void}
 *
 * @param {ParseArg<T, undefined> | null | undefined} [item]
 *  The list item parser
 * @return {ParseArg<Set<T>>}
 *  The unique list parser
 */
function uniq<T = string>(
  this: void,
  item?: ParseArg<T, undefined> | null | undefined
): ParseArg<Set<T>> {
  /**
   * The unique list.
   *
   * @const {Set<T>} list
   */
  const list: Set<T> = new Set()

  return unique.restore = restore, unique

  /**
   * Restore the state of the parser.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function restore(this: void): undefined {
    return void list.clear()
  }

  /**
   * Parse a unique list.
   *
   * @this {void}
   *
   * @param {string} value
   *  The raw argument to parse
   * @return {Set<T>}
   *  The parse result
   */
  function unique(this: void, value: string): Set<T> {
    return list.add((item ?? identity as ParseArg<T>)(value)), list
  }
}
