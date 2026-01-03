/**
 * @file Type Aliases - VersionOptionData
 * @module kronk/types/VersionOptionData
 */

import type {
  Flags,
  Option,
  OptionData,
  OptionInfo
} from '@flex-development/kronk'

/**
 * Union of types used to configure the command version option.
 *
 * The version option can be customized with an `Option` instance, option
 * flags, or an info object. It can also be disabled (`false`).
 *
 * @see {@linkcode Flags}
 * @see {@linkcode Option}
 * @see {@linkcode OptionData}
 * @see {@linkcode OptionInfo}
 */
type VersionOptionData = Flags | Option | OptionData | OptionInfo | boolean

export type { VersionOptionData as default }
