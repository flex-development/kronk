/**
 * @file Interfaces - OptionData
 * @module kronk/interfaces/OptionData
 */

import type { DefaultInfo, List, ParseArg } from '@flex-development/kronk'

/**
 * Data transfer object for command options.
 */
interface OptionData {
  /**
   * List of option choices.
   *
   * @see {@linkcode List}
   */
  choices?: List<string> | null | undefined

  /**
   * Default value configuration.
   *
   * > 👉 **Note**: The option-argument {@linkcode parser} will not be called.
   *
   * @see {@linkcode DefaultInfo}
   */
  default?: DefaultInfo | null | undefined

  /**
   * Description of the option.
   *
   * @default ''
   */
  description?: URL | string | null | undefined

  /**
   * Name of the environment variable to check for option value.
   */
  env?: string | null | undefined

  /**
   * Whether the option should be not displayed in help text.
   *
   * @default false
   */
  hidden?: boolean | null | undefined

  /**
   * Whether the option is mandatory.
   *
   * Mandatory options must have a value after parsing, which usually means the
   * option must be specified on the command line.
   *
   * @default false
   */
  mandatory?: boolean | null | undefined

  /**
   * Handler used to parse option-arguments.
   *
   * The handler receives two parameters, the raw, unparsed option-argument (or
   * *option-arguments* for variadic options), and the previous (default) value
   * for the argument. It should return the new value for the argument.
   *
   * @see {@linkcode ParseArg}
   */
  parser?: ParseArg<any, string> | ParseArg<any, string[]> | null | undefined

  /**
   * For boolean and optional options, the preset to use when the option is
   * specified without an option-argument.
   *
   * The option-argument {@linkcode parser} will be called.
   */
  preset?: string | null | undefined

  /**
   * Whether to use snake_case format when converting the option name to an
   * object property key. By default, camelCase format is used.
   */
  snakecase?: boolean | null | undefined
}

export type { OptionData as default }
