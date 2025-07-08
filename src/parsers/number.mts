/**
 * @file Parsers - number
 * @module kronk/parsers/number
 */

/**
 * Parse a number.
 *
 * @category
 *  parsers
 *
 * @this {void}
 *
 * @param {string} value
 *  The value to parse
 * @return {number}
 *  The number parsed from `value`
 */
function number(this: void, value: string): number {
  return +value
}

export default number
