/**
 * @file Interfaces - ParseableMetadata
 * @module kronk/interfaces/ParseableMetadata
 */

import type { ParseableInfo } from '@flex-development/kronk'

/**
 * Parse candidate metadata.
 *
 * @see {@linkcode ParseableInfo}
 *
 * @extends {ParseableInfo}
 */
interface ParseableMetadata extends ParseableInfo {
  /**
   * Whether required syntax was used when defining the candidate.
   */
  required?: boolean | null | undefined

  /**
   * Whether variadic syntax was used when defining the candidate.
   */
  variadic?: boolean | null | undefined
}

export type { ParseableMetadata as default }
