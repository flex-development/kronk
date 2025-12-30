/**
 * @file Parsers - unique
 * @module kronk/parsers/unique
 */

/**
 * The unique list.
 *
 * @const {Set<string>} list
 */
const list: Set<string> = new Set()

unique.list = list
export default unique

/**
 * Parse a unique list.
 *
 * @category
 *  parsers
 *
 * @this {void}
 *
 * @param {string} value
 *  The value to parse
 * @return {Set<string>}
 *  The unique list
 */
function unique(this: void, value: string): Set<string> {
  return list.add(value), list
}
