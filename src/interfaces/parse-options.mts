/**
 * @file Interfaces - ParseOptions
 * @module kronk/interfaces/ParseOptions
 */

import type { ArgvSource } from '@flex-development/kronk'

/**
 * Options for parsing command-line arguments.
 */
interface ParseOptions {
  /**
   * The source of the command line arguments.
   *
   * @see {@linkcode ArgvSource}
   */
  from?: ArgvSource | null | undefined
}

export type { ParseOptions as default }
