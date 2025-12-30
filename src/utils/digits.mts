/**
 * @file Utilities - digits
 * @module utils/digits
 */

import chars from '#enums/chars'

/**
 * A list of digits.
 *
 * @category
 *  utils
 *
 * @const {Readonly<['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']>} digits
 */
const digits = Object.freeze([
  chars.digit0,
  chars.digit1,
  chars.digit2,
  chars.digit3,
  chars.digit4,
  chars.digit5,
  chars.digit6,
  chars.digit7,
  chars.digit8,
  chars.digit9
] as const)

export default digits
