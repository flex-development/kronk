/**
 * @file Interfaces - ArgumentData
 * @module kronk/interfaces/ArgumentData
 */

import type { DefaultInfo, List, ParseArg } from '@flex-development/kronk'

/**
 * Data transfer object for command-arguments.
 */
interface ArgumentData {
  /**
   * List of argument choices.
   *
   * @see {@linkcode List}
   */
  choices?: List<string> | null | undefined

  /**
   * Default value configuration.
   *
   * @see {@linkcode DefaultInfo}
   */
  default?: DefaultInfo | null | undefined

  /**
   * Description of the argument.
   */
  description?: URL | string | null | undefined

  /**
   * Handler used to parse command-arguments.
   *
   * The handler receives two parameters, the raw, unparsed command-argument (or
   * *command-arguments* for variadic options), and the previous (default) value
   * for the argument. It should return the new value for the argument.
   *
   * @see {@linkcode ParseArg}
   */
  parser?: ParseArg<any, any> | null | undefined
}

export type { ArgumentData as default }
