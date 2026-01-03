/**
 * @file Type Aliases - HelpOptionData
 * @module kronk/types/HelpOptionData
 */

import type {
  Flags,
  Option,
  OptionData,
  OptionInfo
} from '@flex-development/kronk'

/**
 * Union of types used to configure the command help option.
 *
 * The help option can be customized with an `Option` instance, option flags,
 * or an info object. It can also be disabled (`false`).
 *
 * @see {@linkcode Flags}
 * @see {@linkcode Option}
 * @see {@linkcode OptionData}
 * @see {@linkcode OptionInfo}
 */
type HelpOptionData = Flags | Option | OptionData | OptionInfo | boolean

export type { HelpOptionData as default }
