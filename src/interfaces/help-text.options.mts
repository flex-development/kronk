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
   * @default 110
   */
  columns?: number | null | undefined

  /**
   * The character, or characters, used to mark the end of a line.
   *
   * @default '\n'
   */
  eol?: string | null | undefined

  /**
   * The example marker to use.
   *
   * @default '$'
   */
  exampleMarker?: string | null | undefined

  /**
   * Whether to show global options.
   */
  globalOptions?: boolean | null | undefined
}

export type { HelpTextOptions as default }
