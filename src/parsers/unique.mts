/**
 * @file Parsers - unique
 * @module kronk/parsers/unique
 */

import toList from '#internal/to-list'
import type { List } from '@flex-development/kronk'

/**
 * Parse a unique list.
 *
 * @see {@linkcode List}
 *
 * @category
 *  parsers
 *
 * @this {void}
 *
 * @param {List<string> | string} value
 *  The value to parse
 * @return {ReadonlySet<string> | Set<string>}
 *  Unique list created from `value`
 */
function unique(
  this: void,
  value: List<string> | string
): ReadonlySet<string> | Set<string> {
  return value instanceof Set ? value : new Set(toList(value))
}

export default unique
