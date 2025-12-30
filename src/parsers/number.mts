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
 * @param {unknown} value
 *  The value to parse
 * @return {number}
 *  The parsed number
 */
function number(this: void, value: unknown): number {
  if (typeof value !== 'string') {
    return typeof value === 'number' ? value : Number.NaN
  }

  /**
   * The parsed number.
   *
   * @var {number} num
   */
  let num: number = +value

  // check if `value` is a key of `Number`.
  if (value in Number && typeof Number[value as never] === 'number') {
    num = Number[value as keyof typeof Number] as number
  }

  return num
}

export default number
