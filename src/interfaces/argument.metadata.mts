/**
 * @file Interfaces - ArgumentMetadata
 * @module kronk/interfaces/ArgumentMetadata
 */

import type { ArgumentInfo, ParseableMetadata } from '@flex-development/kronk'

/**
 * Command-argument metadata.
 *
 * @see {@linkcode ArgumentInfo}
 *
 * @extends {ArgumentInfo}
 * @extends {ParseableMetadata}
 */
interface ArgumentMetadata extends ArgumentInfo, ParseableMetadata {
  /**
   * Argument syntax id.
   */
  id: string

  /**
   * Whether required syntax was used when defining the argument.
   *
   * @override
   */
  required: boolean

  /**
   * Whether variadic syntax was used when defining the argument.
   *
   * @override
   */
  variadic: boolean
}

export type { ArgumentMetadata as default }
