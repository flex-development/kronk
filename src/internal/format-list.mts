/**
 * @file Internal - formatList
 * @module kronk/internal/formatList
 */

import chars from '#enums/chars'
import type { List } from '@flex-development/kronk'

/**
 * Create a list string in the form `'A and B'` or `'A, B, ..., and Z`.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {List<string>} list
 *  The list to format
 * @return {string}
 *  Formatted list
 */
function formatList(this: void, list: List<string>): string {
  list = [...list]

  /**
   * List transition type to insert before last element.
   *
   * @const {string} type
   */
  const type: string = 'and'

  switch (list.length) {
    case 0:
      return chars.empty
    case 1:
      return `${list[0]}`
    case 2:
      return `${list[0]} ${type} ${list[1]}`
    case 3:
      return `${list[0]}, ${list[1]}, ${type} ${list[2]}`
    default:
      return `${list.slice(0, -1).join(', ')}, ${type} ${list.at(-1)}`
  }
}

export default formatList
