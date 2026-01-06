/**
 * @file Interfaces - ParseArg
 * @module kronk/interfaces/ParseArg
 */

import type { RestoreParser } from '@flex-development/kronk'

/**
 * Parse a raw argument `value`.
 *
 * @template {any} [T=any]
 *  The result of the parse
 * @template {any} [Previous=T]
 *  The previous parse result
 */
interface ParseArg<T = any, Previous = T> {
  /**
   * @param {string} value
   *  The raw argument to parse
   * @param {Previous} [previous]
   *  The default argument value,
   *  or the previous parse result for variadic arguments
   * @return {T}
   *  The parse result
   */
  (value: string, previous?: Previous): T

  /**
   * Restore the state of the parser.
   *
   * @see {@linkcode RestoreParser}
   */
  restore?: RestoreParser | null | undefined
}

export type { ParseArg as default }
