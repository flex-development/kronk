/**
 * @file Interfaces - ParseableInfo
 * @module kronk/interfaces/ParseableInfo
 */

import type {
  DefaultInfo,
  HelpableInfo,
  List,
  ParseArg
} from '@flex-development/kronk'

/**
 * Data used to create parse candidates.
 *
 * @see {@linkcode HelpableInfo}
 *
 * @extends {HelpableInfo}
 */
interface ParseableInfo extends HelpableInfo {
  /**
   * List of allowed choices.
   *
   * @see {@linkcode List}
   */
  choices?: List<string> | null | undefined

  /**
   * Default value configuration.
   *
   * > 👉 **Note**: The argument {@linkcode parser} will not be called.
   *
   * @see {@linkcode DefaultInfo}
   */
  default?: DefaultInfo | null | undefined

  /**
   * The handler used to parse arguments.
   *
   * The handler receives two parameters, the raw, unparsed argument,
   * and the previous value for the argument.
   * It should return the new value for the argument.
   *
   * @see {@linkcode ParseArg}
   */
  parser?: ParseArg | null | undefined
}

export type { ParseableInfo as default }
