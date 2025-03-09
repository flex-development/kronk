/**
 * @file Interfaces - ArgumentInfo
 * @module kronk/interfaces/ArgumentInfo
 */

import type { ArgumentData, ArgumentSyntax } from '@flex-development/kronk'

/**
 * Data used to create command-arguments.
 *
 * @see {@linkcode ArgumentData}
 *
 * @extends {ArgumentData}
 */
interface ArgumentInfo extends ArgumentData {
  /**
   * Argument syntax.
   *
   * @see {@linkcode ArgumentSyntax}
   */
  syntax: ArgumentSyntax | string
}

export type { ArgumentInfo as default }
