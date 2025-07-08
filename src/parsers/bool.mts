/**
 * @file Parsers - bool
 * @module kronk/parsers/bool
 */

import chars from '#enums/chars'
import type { List, ParseArg } from '@flex-development/kronk'

export default bool

/**
 * @property {Readonly<Set<string>>} choices
 *  List of choices that evaluate to `true` or `false`
 */
bool.choices = Object.freeze(new Set([
  chars.digit0,
  chars.digit1,
  chars.false,
  chars.lowercaseN,
  chars.true,
  chars.lowercaseY
]))

/**
 * Create a boolean parser.
 *
 * The values `'1'`, `'y'`, and `'true'` are converted to `true` by default. All
 * other values evaluate to `false`.
 *
 * @see {@linkcode List}
 * @see {@linkcode ParseArg}
 * @see {@linkcode bool.choices}
 *
 * @category
 *  parsers
 *
 * @this {void}
 *
 * @param {List<string> | null | undefined} choices
 *  List of choices that should evaluate to `true`
 * @return {ParseArg<boolean>}
 *  Boolean parser
 */
function bool(
  this: void,
  choices?: List<string> | null | undefined
): ParseArg<boolean> {
  /**
   * Default list of choices that should evaluate to `true`.
   *
   * @const {Set<string>} truthy
   */
  const truthy: Set<string> = new Set([chars.digit1, chars.lowercaseY, 'true'])

  return boolean

  /**
   * @this {void}
   *
   * @param {unknown} value
   *  The value to parse
   * @return {boolean}
   *  The boolean parsed from `value`
   */
  function boolean(this: void, value: unknown): boolean {
    return [...(choices ?? truthy)].includes(String(value).trim())
  }
}
