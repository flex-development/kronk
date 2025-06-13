/**
 * @file Interfaces - VersionOptionInfo
 * @module kronk/interfaces/VersionOptionInfo
 */

import type { Flags, OptionData, Version } from '@flex-development/kronk'

/**
 * Data used to create a version (i.e. `-v | --version`) command option.
 *
 * @see {@linkcode OptionData}
 *
 * @extends {OptionData}
 */
interface VersionOptionInfo extends OptionData {
  /**
   * Option flags.
   *
   * @see {@linkcode Flags}
   *
   * @default '-v | --version'
   */
  flags?: Flags | null | undefined

  /**
   * The command version.
   *
   * @see {@linkcode Version}
   */
  version: Version
}

export type { VersionOptionInfo as default }
