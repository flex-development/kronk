/**
 * @file Interfaces - HelpTextOptions
 * @module kronk/interfaces/HelpTextOptions
 */

import type { ColorizerOptions } from '@flex-development/colors'

/**
 * Options for formating help text.
 *
 * @see {@linkcode ColorizerOptions}
 *
 * @extends {ColorizerOptions}
 */
interface HelpTextOptions extends ColorizerOptions {
  /**
   * The maximum number of columns to output.
   *
   * @default 80
   */
  columns?: number | null | undefined
}

export type { HelpTextOptions as default }
