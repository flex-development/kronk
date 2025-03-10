/**
 * @file Interfaces - OptionMetadata
 * @module kronk/interfaces/OptionMetadata
 */

import type { OptionInfo } from '@flex-development/kronk'

/**
 * Command option metadata.
 *
 * @see {@linkcode OptionInfo}
 *
 * @extends {OptionInfo}
 */
interface OptionMetadata extends OptionInfo {
  /**
   * Long flag.
   */
  long: string | null | undefined

  /**
   * Whether a value is optional when the option is specified.
   */
  optional: boolean

  /**
   * Whether a value must be supplied when the option is specified.
   */
  required: boolean

  /**
   * Short (or shortish, e.g. `--ws`) flag.
   *
   * > 👉 **Note**: If `null` or `undefined`, {@linkcode long} will be a
   * > non-empty string.
   */
  short: string | null | undefined

  /**
   * Whether the option can be specified multiple times.
   */
  variadic: boolean
}

export type { OptionMetadata as default }
