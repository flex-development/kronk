/**
 * @file Interfaces - ArgumentMetadata
 * @module kronk/interfaces/ArgumentMetadata
 */

import type { ArgumentInfo } from '@flex-development/kronk'

/**
 * Command-argument metadata.
 *
 * @see {@linkcode ArgumentInfo}
 *
 * @extends {ArgumentInfo}
 */
interface ArgumentMetadata extends ArgumentInfo {
  /**
   * Argument syntax id.
   */
  id: string

  /**
   * Whether required syntax was used when defining the argument.
   */
  required: boolean

  /**
   * Whether variadic syntax was used when defining the argument.
   */
  variadic: boolean
}

export type { ArgumentMetadata as default }
