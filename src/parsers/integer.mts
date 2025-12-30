/**
 * @file Parsers - integer
 * @module kronk/parsers/integer
 */

import number from '#parsers/number'

/**
 * Parse an integer.
 *
 * @category
 *  parsers
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to parse
 * @return {number}
 *  The parsed integer
 */
function integer(this: void, value: unknown): number {
  /**
   * The parsed number.
   *
   * @const {number} num
   */
  const num: number = number(value)

  return Number.isInteger(num) ? num : Number.NaN
}

export default integer
