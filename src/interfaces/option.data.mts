/**
 * @file Interfaces - OptionData
 * @module kronk/interfaces/OptionData
 */

import type {
  List,
  OptionValues,
  ParseableInfo
} from '@flex-development/kronk'

/**
 * Data transfer object for command options.
 *
 * @see {@linkcode ParseableInfo}
 *
 * @extends {ParseableInfo}
 */
interface OptionData extends ParseableInfo {
  /**
   * An option reference, or list of references,
   * representing conflicting options.
   *
   * An error will be displayed if any conflicts are found during parsing.
   *
   * > 👉 **Note**: Local options can conflict with global options and other
   * > local options, but global options cannot conflict with local options.
   *
   * @see {@linkcode List}
   */
  conflicts?: List<string> | string | null | undefined

  /**
   * An option reference, or list of references,
   * representing options that are required by this option.
   *
   * > 👉 **Note**: Local options can depend on global options and other
   * > local options, but global options cannot depend on local options.
   *
   * @see {@linkcode List}
   */
  depends?: List<string> | string | null | undefined

  /**
   * The name of the environment variable to check for the option value,
   * or a list of names, in order of priority, to check.
   *
   * @see {@linkcode List}
   */
  env?: List<string> | string | null | undefined

  /**
   * A reference to an implied option, or a map where each key is a reference
   * and each value is the value to use when the option is set but the implied
   * option is not.\
   * Lone keys imply (string `implies`) `true`, i.e. `{ [implies]: true }`.
   *
   * The option-argument {@linkcode parser} will be called for implied values
   * that are strings.
   *
   * > 👉 **Note**: Local options can imply global options and other
   * > local options, but global options cannot imply local options.
   *
   * @see {@linkcode OptionValues}
   */
  implies?: OptionValues | string | null | undefined

  /**
   * Whether the option is mandatory.
   *
   * Mandatory options must have a value after parsing, which usually means the
   * option must be specified on the command line.
   */
  mandatory?: boolean | null | undefined

  /**
   * For boolean and optional options, the preset to use when the option is
   * specified without an option-argument.
   *
   * The option-argument {@linkcode parser} will be called.
   */
  preset?: string | null | undefined

  /**
   * Whether to use `snake_case` format when converting the option id to an
   * object property key.
   */
  snakecase?: boolean | null | undefined
}

export type { OptionData as default }
