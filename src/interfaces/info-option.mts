/**
 * @file Interfaces - OptionInfo
 * @module kronk/interfaces/OptionInfo
 */

import type { Flags, OptionData } from '@flex-development/kronk'

/**
 * Data used to create command options.
 *
 * @see {@linkcode OptionData}
 *
 * @extends {OptionData}
 */
interface OptionInfo extends OptionData {
  /**
   * Option flags.
   *
   * @see {@linkcode Flags}
   */
  flags: Flags
}

export type { OptionInfo as default }
