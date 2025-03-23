/**
 * @file Test Utilities - sfmt
 * @module tests/utils/sfmt
 */

import chars from '#enums/chars'
import type { ArgumentSyntax } from '@flex-development/kronk'

export default {
  /**
   * Create an optional argument syntax string.
   *
   * @this {void}
   *
   * @param {Options | null | undefined} [options]
   *  Formatting options
   * @return {ArgumentSyntax}
   *  Optional argument syntax string
   */
  optional(this: void, options?: Options | null | undefined): ArgumentSyntax {
    return `${chars.leftBracket}${id(options)}${chars.rightBracket}`
  },
  /**
   * Create a required argument syntax string.
   *
   * @this {void}
   *
   * @param {Options | null | undefined} [options]
   *  Formatting options
   * @return {ArgumentSyntax}
   *  Required argument syntax string
   */
  required(this: void, options?: Options | null | undefined): ArgumentSyntax {
    return `${chars.leftAngleBracket}${id(options)}${chars.rightAngleBracket}`
  }
}

/**
 * Argument syntax formatting options.
 */
type Options = {
  /**
   * Argument syntax id.
   *
   * @default chars.empty
   */
  id?: string | null | undefined

  /**
   * Whether to add mandatory option-argument syntax to {@linkcode id}.
   */
  mandatory?: boolean | null | undefined

  /**
   * Whether to add variadic argument syntax to {@linkcode id}.
   */
  variadic?: boolean | null | undefined
}

/**
 * Format an argument syntax id.
 *
 * @this {void}
 *
 * @param {Options | null | undefined} [options]
 *  Formatting options
 * @return {string}
 *  Formatted argument syntax id
 */
function id(this: void, options?: Options | null | undefined): string {
  /**
   * Argument syntax id.
   *
   * @var {string} id
   */
  let id: string = options?.id ?? chars.empty

  if (options?.mandatory) id += chars.exclamation
  if (options?.variadic) id += chars.dot.repeat(+chars.digit3)

  return id
}
