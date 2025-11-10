/**
 * @file Interfaces - OptionMetadata
 * @module kronk/interfaces/OptionMetadata
 */

import type { OptionInfo, ParseableMetadata } from '@flex-development/kronk'

/**
 * Command option metadata.
 *
 * @see {@linkcode OptionInfo}
 * @see {@linkcode ParseableInfo}
 *
 * @extends {OptionInfo}
 * @extends {ParseableInfo}
 */
interface OptionMetadata extends OptionInfo, ParseableMetadata {
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
   *
   * @override
   */
  required: boolean

  /**
   * Short (or shortish, e.g. `--ws`) flag.
   *
   * > 👉 **Note**: If `null` or `undefined`, the {@linkcode long} flag will be
   * > a non-empty string.
   */
  short: string | null | undefined

  /**
   * Whether the option can be specified multiple times.
   *
   * @override
   */
  variadic: boolean
}

export type { OptionMetadata as default }
